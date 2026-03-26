const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Timeout de 30 secondes pour les requêtes
const REQUEST_TIMEOUT = 30000;

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Créer un AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          error: `Erreur HTTP ${response.status}`,
          details: response.statusText 
        }));
        throw new Error(error.error || error.details || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      // Gestion des erreurs spécifiques
      if (error.name === 'AbortError') {
        throw new Error('La requête a pris trop de temps. Vérifiez que le serveur backend est démarré et accessible.');
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend API est démarré sur http://localhost:3000');
      }
      
      // Si c'est déjà une Error avec un message, la relancer
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Erreur inconnue lors de la requête');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any, isFormData: boolean = false): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
    };

    if (isFormData) {
      options.body = data;
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, options);
  }

  async put<T>(endpoint: string, data: any, isFormData: boolean = false): Promise<T> {
    const options: RequestInit = {
      method: 'PUT',
    };

    if (isFormData) {
      options.body = data;
    } else {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, options);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Méthode pour vérifier si le serveur est accessible
  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl.replace('/api', '')}/`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
