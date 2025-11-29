import { NoteRepository } from '../../domain/repositories/NoteRepository';

export class DeleteNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    await this.noteRepository.deleteNote(id);
  }
}
