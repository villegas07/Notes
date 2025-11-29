import { HttpClient } from './HttpClient';
import { Note } from '@/core/domain/entities/Note';

const BASE_URL = 'https://notes-back-a53g.onrender.com';

export interface CreateNotePayload {
  title: string;
  description: string;
}

export interface UpdateNotePayload {
  title: string;
  description: string;
}

export type NotePayload = {
  title: string;
  description: string;
  categoryId?: string;
};

export class NotesService {
  /**
   * Crear una nueva nota
   * POST /notes
   */
  static async createNote(payload: CreateNotePayload, token: string): Promise<Note> {
    console.log('NotesService.createNote - Creating note:', payload);
    
    const response = await HttpClient.post(`${BASE_URL}/notes`, payload, token);
    console.log('Note created successfully:', response);
    
    // La API puede retornar { statusCode, message, data: {...} } o directamente la nota
    const note = response.data || response;
    
    if (!note.id) {
      console.error('Created note has no ID:', note);
      throw new Error('Created note has no ID');
    }
    
    return note;
  }

  /**
   * Obtener notas activas
   * GET /notes/active
   */
  static async getActiveNotes(token: string): Promise<Note[]> {
    console.log('NotesService.getActiveNotes - Fetching active notes');
    
    const response = await HttpClient.get(`${BASE_URL}/notes/active`, token);
    console.log('Active notes fetched:', response);
    
    // La API puede retornar { statusCode, message, data: [...] } o directamente el array
    const notes = Array.isArray(response) ? response : (response.data || []);
    
    return notes;
  }

  /**
   * Obtener notas archivadas
   * GET /notes/archived
   */
  static async getArchivedNotes(token: string): Promise<Note[]> {
    console.log('NotesService.getArchivedNotes - Fetching archived notes');
    
    const response = await HttpClient.get(`${BASE_URL}/notes/archived`, token);
    console.log('Archived notes fetched:', response);
    
    const notes = Array.isArray(response) ? response : (response.data || []);
    
    return notes;
  }

  /**
   * Actualizar una nota
   * PUT /notes/:id
   */
  static async updateNote(id: string, payload: UpdateNotePayload, token: string): Promise<Note> {
    console.log('NotesService.updateNote - Updating note:', id, payload);
    
    const response = await HttpClient.put(`${BASE_URL}/notes/${id}`, payload, token);
    console.log('Note updated successfully:', response);
    
    const note = response.data || response;
    return note;
  }

  /**
   * Archivar una nota
   * POST /notes/:id/archive
   */
  static async archiveNote(id: string, token: string): Promise<void> {
    console.log('NotesService.archiveNote - Archiving note:', id);
    
    await HttpClient.post(`${BASE_URL}/notes/${id}/archive`, {}, token);
    console.log('Note archived successfully');
  }

  /**
   * Desarchivar una nota
   * POST /notes/:id/unarchive
   */
  static async unarchiveNote(id: string, token: string): Promise<void> {
    console.log('NotesService.unarchiveNote - Unarchiving note:', id);
    
    await HttpClient.post(`${BASE_URL}/notes/${id}/unarchive`, {}, token);
    console.log('Note unarchived successfully');
  }

  /**
   * Eliminar una nota
   * DELETE /notes/:id
   */
  static async deleteNote(id: string, token: string): Promise<void> {
    console.log('NotesService.deleteNote - Deleting note:', id);
    
    await HttpClient.delete(`${BASE_URL}/notes/${id}`, token);
    console.log('Note deleted successfully');
  }
}