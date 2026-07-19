"use client";

import { useState } from "react";
import { enrollMfa, verifyEnrollment } from "@/app/login/actions";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ShieldCheck, Loader2, QrCode } from "lucide-react";

export default function Setup2FAPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const startSetup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await enrollMfa();
      if (res.error) {
        setError(res.error);
      } else {
        setFactorId(res.id!);
        setSecret(res.secret!);
        // Generate QR Code data URL from the authenticater URI
        const url = await QRCode.toDataURL(res.uri!);
        setQrCodeUrl(url);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start 2FA setup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId || !code) return;
    
    setIsVerifying(true);
    setError(null);
    try {
      const res = await verifyEnrollment(factorId, code);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-primary" />
          Two-Factor Authentication
        </h1>
        <p className="text-muted-foreground mt-2">
          Secure your admin dashboard by requiring a 6-digit code from an authenticator app (like Google Authenticator or Authy) when logging in.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-8 shadow-sm">
        {success ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">2FA is successfully enabled!</h2>
            <p className="text-muted-foreground">
              Your account is now secured. The next time you log in, you will be required to enter a code from your authenticator app.
            </p>
          </div>
        ) : !qrCodeUrl ? (
          <div className="text-center space-y-6 py-8">
            <QrCode className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-xl font-medium">Ready to secure your account?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You will need an authenticator app installed on your smartphone to complete this setup.
            </p>
            <Button onClick={startSetup} disabled={isLoading} className="mt-4">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Begin 2FA Setup
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="space-y-4 max-w-xs">
                <h3 className="font-bold text-lg">1. Scan the QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Open your authenticator app and scan this QR code.
                </p>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Manual entry code:</p>
                  <code className="text-xs bg-muted p-1.5 rounded select-all break-all block">
                    {secret}
                  </code>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 pt-8">
              <h3 className="font-bold text-lg mb-4 text-center">2. Verify the Code</h3>
              <form onSubmit={handleVerify} className="max-w-xs mx-auto space-y-4">
                <Input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                  className="text-center tracking-[0.5em] text-lg font-bold h-12"
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" disabled={isVerifying || code.length !== 6} className="w-full">
                  {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify and Enable
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
