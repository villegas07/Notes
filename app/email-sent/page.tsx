"use client";

import Link from "next/link";

export default function EmailSentPage({ email }: { email?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Correo Enviado</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <span className="font-semibold text-green-700">Hemos enviado un enlace de recuperación a:</span><br />
          <span className="font-bold text-green-700">{email || "(correo)"}</span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
          <span className="font-semibold">Pasos a seguir:</span>
          <ol className="list-decimal ml-5 mt-2 text-gray-700">
            <li>Revisa tu bandeja de entrada</li>
            <li>Haz clic en el enlace de recuperación</li>
            <li>Crea una nueva contraseña</li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">Si no ves el correo, revisa tu carpeta de spam. El enlace expirará en 24 horas.</p>
        </div>
        <Link href="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
          ← Volver al Login
        </Link>
      </div>
    </div>
  );
}
