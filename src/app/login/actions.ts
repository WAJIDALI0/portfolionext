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

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
