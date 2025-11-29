import { CategoryRepository } from '../../domain/repositories/CategoryRepository';

export class AddCategoryToNoteUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(noteId: string, categoryId: string): Promise<void> {
    if (!noteId) {
      throw new Error('Note ID is required');
    }

    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    await this.categoryRepository.addCategoryToNote(noteId, categoryId);
  }
}
