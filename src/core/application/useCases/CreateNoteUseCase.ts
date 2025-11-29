import { Note, CreateNoteDto } from '../../domain/entities/Note';
import { NoteRepository } from '../../domain/repositories/NoteRepository';

export class CreateNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(data: CreateNoteDto): Promise<Note> {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error('Description is required');
    }

    return await this.noteRepository.createNote(data);
  }
}
