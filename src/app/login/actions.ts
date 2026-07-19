"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Simple in-memory rate limiter for login attempts
const loginRateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LOGIN_RATE_LIMIT_MAX = 5; // Max 5 failed attempts
const LOGIN_RATE_LIMIT_WINDOW = 1000 * 60 * 15; // per 15 minutes

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const recaptchaToken = formData.get("g-recaptcha-response") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // 1. Rate Limiting Check
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown-ip";
  const now = Date.now();
  
  const userRateData = loginRateLimitMap.get(ip);
  if (userRateData) {
    if (now - userRateData.lastReset > LOGIN_RATE_LIMIT_WINDOW) {
      // Reset window
      loginRateLimitMap.set(ip, { count: 0, lastReset: now }); // count is 0 because we only count failures
    } else if (userRateData.count >= LOGIN_RATE_LIMIT_MAX) {
      return {
        error: "Too many login attempts. Please try again in 15 minutes.",
      };
    }
  } else {
    loginRateLimitMap.set(ip, { count: 0, lastReset: now });
  }

  // 2. reCAPTCHA v3 Verification
  if (!recaptchaToken) {
    return { error: "Security check failed. Please refresh the page and try again." };
  }

  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!recaptchaSecretKey) {
    console.error("RECAPTCHA_SECRET_KEY is missing from environment variables.");
    return { error: "Server configuration error." };
  }

  try {
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaRes.json();
    
    // Log the successful score so the user can verify it is working
    console.log("reCAPTCHA Verification Successful! Score:", recaptchaData.score);

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.warn("reCAPTCHA failed or score too low:", recaptchaData);
      return { error: "Bot activity detected. Access denied." };
    }
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return { error: "Failed to verify security check." };
  }

  // 3. Supabase Authentication
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Increment failed attempt counter
    const currentRateData = loginRateLimitMap.get(ip) || { count: 0, lastReset: now };
    currentRateData.count += 1;
    loginRateLimitMap.set(ip, currentRateData);

    return { error: error.message };
  }

  // On successful login, clear the rate limit counter for this IP
  loginRateLimitMap.delete(ip);

  // 4. Check if MFA (2FA) is required
  const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (mfaError) {
    return { error: "Failed to verify authentication level." };
  }

  if (mfaData.currentLevel === 'aal1' && mfaData.nextLevel === 'aal2') {
    // User has MFA enrolled, they need to enter their TOTP code
    return { mfaRequired: true };
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function verifyTotp(prevState: any, formData: FormData) {
  const code = formData.get("code") as string;
  const supabase = await createClient();
  
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
  if (factorsError || !factors.totp || factors.totp.length === 0) {
    return { error: "No 2FA authenticator found for this account." };
  }

  const totpFactor = factors.totp[0];

  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
  if (challengeError) return { error: "Failed to initiate 2FA challenge." };

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: totpFactor.id,
    challengeId: challengeData.id,
    code,
  });

  if (verifyError) return { error: "Invalid 6-digit code. Please try again." };

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function enrollMfa() {
  try {
    const supabase = await createClient();
    
    // 1. Check for existing factors
    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    
    if (listError) {
      console.error("listFactors error:", listError);
      return { error: listError.message };
    }

    if (factors?.totp && factors.totp.length > 0) {
      const existingFactor = factors.totp[0];
      
      if (existingFactor.status === 'verified') {
        return { error: "2FA is already fully enabled on this account." };
      }
      
      if (existingFactor.status === 'unverified') {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: existingFactor.id });
        if (unenrollError) {
          console.error("unenroll error:", unenrollError);
          // Don't return here, try to enroll anyway
        }
      }
    }

    // 2. Enroll a brand new factor
    const { data, error } = await supabase.auth.mfa.enroll({ 
      factorType: "totp",
      friendlyName: "Admin_" + Date.now()
    });
    
    if (error) {
      console.error("enroll error:", error);
      return { error: error.message };
    }
    
    return { id: data.id, uri: data.totp.uri, secret: data.totp.secret };
  } catch (err: any) {
    console.error("enrollMfa catch error:", err);
    return { error: err.message || "An unexpected error occurred during 2FA setup." };
  }
}

export async function verifyEnrollment(factorId: string, code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.challenge({ factorId });
  if (error) return { error: error.message };
  
  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: data.id,
    code,
  });
  
  if (verifyError) return { error: "Invalid 6-digit code." };
  
  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function checkMfaStatus() {
  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  if (factors?.totp && factors.totp.length > 0) {
    return { isEnrolled: factors.totp[0].status === 'verified' };
  }
  return { isEnrolled: false };
}

export async function disableMfa() {
  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  
  if (factors?.totp) {
    for (const factor of factors.totp) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
  }
  revalidatePath("/", "layout");
  return { success: true };
}
