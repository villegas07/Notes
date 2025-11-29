'use client';

import { useState, useCallback, useEffect } from 'react';
import { Note, CreateNoteDto, UpdateNoteDto } from '@/core/domain/entities/Note';

export function useNotesMock() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar notas desde localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Guardar notas en localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const fetchActiveNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes.filter(note => !note.isArchived));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArchivedNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes.filter(note => note.isArchived));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch archived notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data: CreateNoteDto) => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })) : [];

      const newNote: Note = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [],
      };

      const updatedNotes = [newNote, ...allNotes];
      saveNotes(updatedNotes);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNote = useCallback(async (id: string, data: UpdateNoteDto) => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })) : [];

      const updatedNotes = allNotes.map((note) =>
        note.id === id
          ? { ...note, ...data, updatedAt: new Date() }
          : note
      );

      saveNotes(updatedNotes);
      
      const updatedNote = updatedNotes.find(n => n.id === id)!;
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
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];

      const updatedNotes = allNotes.filter((note: any) => note.id !== id);
      saveNotes(updatedNotes);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })) : [];

      const updatedNotes = allNotes.map((note) =>
        note.id === id ? { ...note, isArchived: true, updatedAt: new Date() } : note
      );

      saveNotes(updatedNotes);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unarchiveNote = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      })) : [];

      const updatedNotes = allNotes.map((note) =>
        note.id === id ? { ...note, isArchived: false, updatedAt: new Date() } : note
      );

      saveNotes(updatedNotes);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unarchive note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
