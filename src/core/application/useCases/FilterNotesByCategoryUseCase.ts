import { Note } from '../../domain/entities/Note';
import { CategoryRepository } from '../../domain/repositories/CategoryRepository';

export class FilterNotesByCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(categoryId: string): Promise<Note[]> {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    return await this.categoryRepository.filterNotesByCategory(categoryId);
  }
}
