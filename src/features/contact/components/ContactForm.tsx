"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { contactFormSchema, ContactFormValues } from "../schema";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";

export function ContactForm() {
  const [state, setState] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  // Auto-dismiss the success/error message after 5 seconds
  useEffect(() => {
    if (state?.success || state?.error) {
      const timer = setTimeout(() => {
        setState(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Submit via react-hook-form → call server action programmatically
  const onSubmit = async (data: ContactFormValues) => {
    setIsPending(true);
    setState(null);

    // Build FormData so the server action receives it correctly
    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("email", data.email);
    formData.set("message", data.message);

    try {
      const result = await submitContactForm(null, formData);
      setState(result);
      if (result.success) {
        form.reset();
      }
    } catch {
      setState({ success: false, error: "An unexpected error occurred. Please try again." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Input
            {...form.register("name")}
            placeholder="Full Name"
            className="h-12 bg-background/50 backdrop-blur-sm transition-all focus:bg-background"
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-500 font-medium ml-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...form.register("email")}
            placeholder="Email Address"
            className="h-12 bg-background/50 backdrop-blur-sm transition-all focus:bg-background"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500 font-medium ml-1">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          {...form.register("message")}
          placeholder="Tell me about your project or inquiry..."
          rows={5}
          className="resize-none bg-background/50 backdrop-blur-sm transition-all focus:bg-background"
        />
        {form.formState.errors.message && (
          <p className="text-xs text-red-500 font-medium ml-1">{form.formState.errors.message.message}</p>
        )}
      </div>

      <Button
        disabled={isPending}
        type="submit"
        size="lg"
        className="w-full sm:w-auto h-12 px-8 font-medium shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Send Message <Send className="h-4 w-4" />
          </span>
        )}
      </Button>

      <AnimatePresence mode="wait">
        {state?.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center p-4 mt-4 text-green-700 bg-green-100 dark:bg-green-500/10 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20"
          >
            <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
            <p className="font-medium text-sm">{state.message}</p>
          </motion.div>
        )}

        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-start p-4 mt-4 text-red-700 bg-red-100 dark:bg-red-500/10 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-500/20"
          >
            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div className="font-medium text-sm flex-1">
              <p className="mb-1 font-bold">Delivery Failed</p>
              <p className="opacity-90">{state.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
