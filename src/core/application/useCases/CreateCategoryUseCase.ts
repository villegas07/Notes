import { Category } from '../../domain/entities/Note';
import { CategoryRepository } from '../../domain/repositories/CategoryRepository';

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(name: string, color: string): Promise<Category> {
    if (!name || name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (!color || color.trim().length === 0) {
      throw new Error('Category color is required');
    }

    return await this.categoryRepository.createCategory(name, color);
  }
}
