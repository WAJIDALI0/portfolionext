"use client";

import { useActionState, useEffect, useState } from "react";
import { login, verifyTotp } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

function LoginForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginState, loginAction, isLoginPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (!executeRecaptcha) {
        return { error: "Security check is still loading. Please wait." };
      }
      
      try {
        const token = await executeRecaptcha("login");
        formData.append("g-recaptcha-response", token);
      } catch (err) {
        return { error: "Failed to generate security token." };
      }

      const res = await login(formData);
      return res;
    },
    null
  );

  const [totpState, totpAction, isTotpPending] = useActionState(verifyTotp, null);

  const mfaRequired = loginState?.mfaRequired || false;
  const activeError = mfaRequired ? totpState?.error : loginState?.error;
  const isPending = mfaRequired ? isTotpPending : isLoginPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6"
          >
            {mfaRequired ? <ShieldCheck className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {mfaRequired ? "Two-Factor Auth" : "Admin Portal"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mfaRequired ? "Enter the 6-digit code from your authenticator app" : "Secure access to your portfolio dashboard"}
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm"
        >
          {mfaRequired ? (
            <form action={totpAction} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    className="pl-10 h-12 bg-background/50 text-center tracking-[0.5em] text-lg font-bold"
                    placeholder="000000"
                  />
                </div>
              </div>

              <AnimatePresence>
                {activeError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{activeError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          ) : (
            <form action={loginAction} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 h-12 bg-background/50"
                    placeholder="Email address"
                  />
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pl-10 pr-10 h-12 bg-background/50"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {activeError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{activeError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "missing_key";
  
  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
}
