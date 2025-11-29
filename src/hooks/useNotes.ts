'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NotesService, NotePayload, UpdateNotePayload } from '@/app/infrastructure/http/NotesService';
import { Note } from '@/core/domain/entities/Note';


export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchActiveNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const result = await NotesService.getActiveNotes(token);
      setNotes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchArchivedNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const result = await NotesService.getArchivedNotes(token);
      setNotes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch archived notes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createNote = useCallback(async (data: NotePayload) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      console.log('Creando nota, token:', token);
      console.log('Payload enviado:', data);
      const newNote = await NotesService.createNote(data, token);
      setNotes((prev) => [newNote, ...(Array.isArray(prev) ? prev : [])]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateNote = useCallback(async (id: string, data: UpdateNotePayload) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      const updatedNote = await NotesService.updateNote(id, data, token);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await NotesService.deleteNote(id, token);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const archiveNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await NotesService.archiveNote(id, token);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const unarchiveNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      await NotesService.unarchiveNote(id, token);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unarchive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    notes,
    loading,
    error,
    fetchActiveNotes,
    fetchArchivedNotes,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
  };
}
