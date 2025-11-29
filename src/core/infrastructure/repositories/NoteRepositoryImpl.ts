import { Note, CreateNoteDto, UpdateNoteDto } from '../../domain/entities/Note';
import { NoteRepository } from '../../domain/repositories/NoteRepository';
import { HttpClient } from '../http/HttpClient';

export class NoteRepositoryImpl implements NoteRepository {
  constructor(private httpClient: HttpClient) {}

  async createNote(data: CreateNoteDto): Promise<Note> {
    const response = await this.httpClient.post<Note>('/notes', data);
    return this.mapToNote(response);
  }

  async getActiveNotes(): Promise<Note[]> {
    const response = await this.httpClient.get<Note[]>('/notes/active');
    return response.map(this.mapToNote);
  }

  async getArchivedNotes(): Promise<Note[]> {
    const response = await this.httpClient.get<Note[]>('/notes/archived');
    return response.map(this.mapToNote);
  }

  async updateNote(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await this.httpClient.put<Note>(`/notes/${id}`, data);
    return this.mapToNote(response);
  }

  async deleteNote(id: string): Promise<void> {
    await this.httpClient.delete(`/notes/${id}`);
  }

  async archiveNote(id: string): Promise<Note> {
    const response = await this.httpClient.post<Note>(`/notes/${id}/archive`);
    return this.mapToNote(response);
  }

  async unarchiveNote(id: string): Promise<Note> {
    const response = await this.httpClient.post<Note>(`/notes/${id}/unarchive`);
    return this.mapToNote(response);
  }

  private mapToNote(data: any): Note {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
