import { Category, Note } from '../../domain/entities/Note';
import { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { HttpClient } from '../http/HttpClient';

export class CategoryRepositoryImpl implements CategoryRepository {
    async deleteCategory(categoryId: string): Promise<void> {
      await this.httpClient.delete(`/categories/${categoryId}`);
    }
  constructor(private httpClient: HttpClient) {}

  async createCategory(name: string, color: string): Promise<Category> {
    return await this.httpClient.post<Category>('/categories', { name, color });
  }

  async getCategories(): Promise<Category[]> {
    return await this.httpClient.get<Category[]>('/categories');
  }

  async addCategoryToNote(noteId: string, categoryId: string): Promise<void> {
    await this.httpClient.post(`/categories/${noteId}/add/${categoryId}`);
  }

  async removeCategoryFromNote(noteId: string, categoryId: string): Promise<void> {
    await this.httpClient.delete(`/categories/${noteId}/remove/${categoryId}`);
  }

  async getNoteCategories(noteId: string): Promise<Category[]> {
    return await this.httpClient.get<Category[]>(`/categories/note/${noteId}`);
  }

  async filterNotesByCategory(categoryId: string): Promise<Note[]> {
    const response = await this.httpClient.get<Note[]>(`/categories/filter/${categoryId}`);
    return response.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  }
}
