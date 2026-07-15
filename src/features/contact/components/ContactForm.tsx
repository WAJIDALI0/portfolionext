"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { contactFormSchema, ContactFormValues } from "../schema";
import { submitContactForm } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  useEffect(() => {
    if (state?.success) {
      form.reset();
    }
  }, [state, form]);

  return (
    <form action={formAction} className="space-y-6 w-full">
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
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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
              {state.error.includes("onboarding@resend.dev") && (
                 <p className="text-xs mt-2 opacity-80 border-t border-red-200/50 pt-2">
                   Developer Note: Resend's onboarding email only allows sending emails to the verified email address attached to the Resend account.
                 </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
