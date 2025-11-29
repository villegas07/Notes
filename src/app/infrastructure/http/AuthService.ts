import { HttpClient } from './HttpClient';

const BASE_URL = 'https://notes-back-a53g.onrender.com';

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
  };
}

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  static async signUp(payload: SignUpPayload): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return response.json();
  }

  /**
   * Iniciar sesión
   * La API retorna: { statusCode: 201, message: 'Success', data: { accessToken: '...' } }
   */
  static async signIn(payload: SignInPayload): Promise<string> {
    console.log('AuthService.signIn - Iniciando login...');
    
    const response = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    console.log('Login response:', result);

    // La API retorna: { statusCode: 201, message: 'Success', data: { accessToken: '...' } }
    const token = result.data?.accessToken;
    
    if (!token) {
      console.error('No token found in response:', result);
      throw new Error('No access token received');
    }

    console.log('Token extracted successfully');
    return token;
  }

  /**
   * Verificar email
   */
  static async verifyEmail(token: string): Promise<any> {
    return HttpClient.post(`${BASE_URL}/auth/verify-email`, { verificationToken: token });
  }

  /**
   * Reenviar código de verificación
   */
  static async resendVerification(email: string): Promise<any> {
    return HttpClient.post(`${BASE_URL}/auth/resend-verification`, { email });
  }

  /**
   * Solicitar recuperación de contraseña
   */
  static async forgotPassword(email: string): Promise<any> {
    return HttpClient.post(`${BASE_URL}/auth/forgot-password`, { email });
  }

  /**
   * Restablecer contraseña
   */
  static async resetPassword(resetToken: string, newPassword: string): Promise<any> {
    return HttpClient.post(`${BASE_URL}/auth/reset-password`, {
      resetToken,
      newPassword
    });
  }
}