"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/app/infrastructure/http/AuthService";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetToken = searchParams.get("token") || searchParams.get("resetToken") || "";

  useEffect(() => {
    if (!resetToken) {
      setError("Falta el token en la URL");
    }
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await AuthService.resetPassword(resetToken, newPassword);
      setSuccess(true);
      setStatus("¡Contraseña restablecida correctamente!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err?.message || "Error al restablecer la contraseña");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Restablecer contraseña</h2>
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <span className="font-semibold text-green-700">¡Contraseña restablecida correctamente!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Nueva contraseña
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Restablecer contraseña
            </button>
          </form>
        )}
        <Link href="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold mt-6">
          ← Volver al Login
        </Link>
      </div>
    </div>
  );
}
