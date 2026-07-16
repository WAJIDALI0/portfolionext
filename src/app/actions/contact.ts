"use server";

import { Resend } from "resend";
import { contactFormSchema } from "@/features/contact/schema";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter (resets on serverless cold starts, but good enough for basic spam prevention)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 3; // Max 3 messages
const RATE_LIMIT_WINDOW = 1000 * 60 * 60; // per 1 hour

export async function submitContactForm(prevState: any, formData: FormData) {
  // 0. Rate Limiting Check
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown-ip";
  const now = Date.now();
  
  const userRateData = rateLimitMap.get(ip);
  if (userRateData) {
    if (now - userRateData.lastReset > RATE_LIMIT_WINDOW) {
      // Reset window
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else if (userRateData.count >= RATE_LIMIT_MAX) {
      return {
        success: false,
        error: "You have sent too many messages. Please try again later.",
      };
    } else {
      userRateData.count += 1;
      rateLimitMap.set(ip, userRateData);
    }
  } else {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  }

  // 1. Validate incoming form data with Zod
  const result = contactFormSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      error: "Invalid form data. Please check your inputs.",
    };
  }

  const { name, email, message } = result.data;

  try {
    // 2. Save submission to Supabase (source of truth)
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, message });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return {
        success: false,
        error: "Failed to save your message. Please try again.",
      };
    }

    // 3. Send email notification (fire-and-forget — won't block the success response)
    resend.emails
      .send({
        from: "Portfolio <onboarding@resend.dev>",
        to: process.env.RESEND_TARGET_EMAIL!,
        subject: `New contact from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>New Contact Request</title>
            </head>
            <body style="background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0; margin: 0;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #000000; padding: 32px 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">New Portfolio Inquiry</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">From</p>
                    <p style="margin: 0 0 24px 0; font-size: 18px; color: #18181b; font-weight: 500;">${name}</p>
                    
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #71717a; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Email Address</p>
                    <p style="margin: 0 0 32px 0; font-size: 16px;">
                      <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 0 0 32px 0;" />
                    
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #71717a; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Message</p>
                    <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #3f3f46; white-space: pre-wrap;">${message}</p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 40px; text-align: center;">
                    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">Sent securely from your Portfolio via Resend & Supabase.</p>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      })
      .catch((err) => {
        // Log but don't fail — data is already in the database
        console.error("Resend email error (non-critical):", err);
      });

    return {
      success: true,
      message: "Message sent successfully! I'll be in touch soon.",
    };
  } catch (error: any) {
    console.error("Unexpected contact form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
