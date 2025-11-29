import { Note } from '../../domain/entities/Note';
import { NoteRepository } from '../../domain/repositories/NoteRepository';

export class UnarchiveNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(id: string): Promise<Note> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    return await this.noteRepository.unarchiveNote(id);
  }
}
