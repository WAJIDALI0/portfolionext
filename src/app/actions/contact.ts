"use server";

import { Resend } from "resend";
import { contactFormSchema } from "@/features/contact/schema";
import { ContactEmailTemplate } from "@/components/email/contact-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(prevState: any, formData: FormData) {
  const result = contactFormSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { success: false, error: "Invalid form data. Please check your inputs." };
  }

  const { name, email, message } = result.data;

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.RESEND_TARGET_EMAIL!,
      subject: `New message from ${name}`,
      react: ContactEmailTemplate({ name, email, message }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      // We explicitly pass back the Resend error message so the user knows if they hit the unverified sender wall.
      return { success: false, error: error.message || "Email rejected by provider." };
    }

    return { success: true, message: "Message sent successfully! I'll be in touch soon." };
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return { success: false, error: "An unexpected server error occurred." };
  }
}
