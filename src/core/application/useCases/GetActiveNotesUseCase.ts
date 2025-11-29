import { Note } from '../../domain/entities/Note';
import { NoteRepository } from '../../domain/repositories/NoteRepository';

export class GetActiveNotesUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(): Promise<Note[]> {
    return await this.noteRepository.getActiveNotes();
  }
}
