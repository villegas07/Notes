"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/app/infrastructure/http/AuthService";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verificando...");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Token is missing in the URL");
      setStatus("");
      return;
    }
    AuthService.verifyEmail({ verificationToken: token })
      .then(() => {
        setSuccess(true);
        setStatus("Email verified successfully!");
      })
      .catch((err) => {
        setError(err?.message || "Error verifying email");
        setStatus("");
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Verificación de correo</h2>
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <span className="font-semibold text-green-700">¡Correo verificado correctamente!</span>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
            <span className="font-semibold">Estado:</span>
            <p className="mt-2 text-gray-700">{status}</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        )}
        <Link href="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
          ← Volver al Login
        </Link>
      </div>
    </div>
  );
}
