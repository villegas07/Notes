export class HttpClient {
  static async request(url: string, options: RequestInit) {
    console.log('HttpClient.request:', {
      url,
      method: options.method,
      headers: options.headers
    });

    const response = await fetch(url, options);
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      // Si es 401 Unauthorized, el token está expirado o es inválido
      if (response.status === 401) {
        console.error('❌ Token inválido o expirado (401 Unauthorized)');
        
        // Limpiar token del localStorage
        localStorage.removeItem('token');
        
        // Redirigir al login
        if (typeof window !== 'undefined') {
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          window.location.href = '/login'; // Cambia '/login' por tu ruta de login
        }
      }

      let error;
      try {
        error = await response.json();
      } catch {
        error = { message: await response.text() };
      }
      console.error('Request failed:', {
        status: response.status,
        error
      });
      throw { status: response.status, ...error };
    }
    
    return response.json();
  }

  static async get(url: string, token?: string) {
    return this.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  static async post(url: string, body: any, token?: string) {
    return this.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  }

  static async put(url: string, body: any, token?: string) {
    return this.request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  }

  static async delete(url: string, token?: string) {
    return this.request(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
}