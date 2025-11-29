import { Note, CreateNoteDto, UpdateNoteDto } from '../entities/Note';

export interface NoteRepository {
  createNote(data: CreateNoteDto): Promise<Note>;
  getActiveNotes(): Promise<Note[]>;
  getArchivedNotes(): Promise<Note[]>;
  updateNote(id: string, data: UpdateNoteDto): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  archiveNote(id: string): Promise<Note>;
  unarchiveNote(id: string): Promise<Note>;
}
