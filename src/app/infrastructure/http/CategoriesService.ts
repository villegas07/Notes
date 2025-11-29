import { Category, Note } from '@/core/domain/entities/Note';

const API_BASE_URL = 'https://notes-back-a53g.onrender.com';

export interface CategoryPayload {
  name: string;
  color: string;
}

export class CategoriesService {
  /**
   * Obtener todas las categorías del usuario
   */
  static async getCategories(token: string): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  /**
   * Crear una nueva categoría
   */
  static async createCategory(payload: CategoryPayload, token: string): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    return response.json();
  }

  /**
   * Agregar una categoría a una nota
   * POST /categories/:noteId/add/:categoryId
   */
  static async addCategoryToNote(
    noteId: string,
    categoryId: string,
    token: string
  ): Promise<void> {
    console.log('CategoriesService.addCategoryToNote called with:', {
      noteId,
      categoryId,
      hasToken: !!token
    });

    const url = `${API_BASE_URL}/categories/${noteId}/add/${categoryId}`;
    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to add category to note: ${errorText}`);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;
  }

  /**
   * Remover una categoría de una nota
   * DELETE /categories/:noteId/remove/:categoryId
   */
  static async removeCategoryFromNote(
    noteId: string,
    categoryId: string,
    token: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/categories/${noteId}/remove/${categoryId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to remove category from note: ${error}`);
    }

    return response.json();
  }

  /**
   * Obtener categorías de una nota específica
   * GET /categories/note/:noteId
   */
  static async getCategoriesByNote(noteId: string, token: string): Promise<Category[]> {
    const response = await fetch(
      `${API_BASE_URL}/categories/note/${noteId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories for note');
    }

    return response.json();
  }

  /**
   * Filtrar notas por categoría
   * GET /categories/filter/:categoryId
   */
  static async getNotesByCategory(categoryId: string, token: string): Promise<Note[]> {
    const response = await fetch(
      `${API_BASE_URL}/categories/filter/${categoryId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch notes by category');
    }

    return response.json();
  }
}