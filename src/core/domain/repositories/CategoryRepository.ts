import { Category, Note } from '../entities/Note';

export interface CategoryRepository {
  createCategory(name: string, color: string): Promise<Category>;
  getCategories(): Promise<Category[]>;
  addCategoryToNote(noteId: string, categoryId: string): Promise<void>;
  removeCategoryFromNote(noteId: string, categoryId: string): Promise<void>;
  getNoteCategories(noteId: string): Promise<Category[]>;
  filterNotesByCategory(categoryId: string): Promise<Note[]>;
  deleteCategory(categoryId: string): Promise<void>;
}
