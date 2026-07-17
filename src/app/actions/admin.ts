"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(id: string, formData?: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("contact_submissions")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Failed to mark as read", error);
    return;
  }

  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
}

export async function deleteMessage(id: string, formData?: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete message", error);
    return;
  }

  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
}
