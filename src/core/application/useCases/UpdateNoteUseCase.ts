import { Note, UpdateNoteDto } from '../../domain/entities/Note';
import { NoteRepository } from '../../domain/repositories/NoteRepository';

export class UpdateNoteUseCase {
  constructor(private noteRepository: NoteRepository) {}

  async execute(id: string, data: UpdateNoteDto): Promise<Note> {
    if (!id) {
      throw new Error('Note ID is required');
    }

    if (data.title !== undefined && data.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    if (data.content !== undefined && data.content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    return await this.noteRepository.updateNote(id, data);
  }
}
