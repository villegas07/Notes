'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AuthService } from '@/app/infrastructure/http/AuthService';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Verificar si ya hay sesión activa

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!firstName || !lastName) {
      setError('You must enter first name and last name');
      return;
    }
    try {
      await AuthService.signUp({ email, password, firstName, lastName });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-teal-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xl font-bold text-teal-600">My Notes</span>
            </Link>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Sent</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <span className="font-semibold text-green-700">We have sent a verification link to:</span><br />
                <span className="font-bold text-green-700">{email}</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
                <span className="font-semibold">Next steps:</span>
                <ol className="list-decimal ml-5 mt-2 text-gray-700">
                  <li>Check your inbox</li>
                  <li>Click the verification link</li>
                  <li>Log in to your account</li>
                </ol>
                <p className="text-xs text-gray-500 mt-2">If you don't see the email, check your spam folder. The link will expire in 24 hours.</p>
              </div>
              <Link href="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">← Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 text-center mb-2">{error}</div>
              )}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  required
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-1 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-teal-600 hover:text-teal-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-teal-600 hover:text-teal-700">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
