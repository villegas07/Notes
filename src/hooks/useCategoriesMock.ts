'use client';

import { useState, useCallback, useEffect } from 'react';
import { Category, Note } from '@/core/domain/entities/Note';

export function useCategoriesMock() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (name: string, color: string) => {
    setLoading(true);
    setError(null);
    try {
      const savedCategories = localStorage.getItem('categories');
      const allCategories: Category[] = savedCategories ? JSON.parse(savedCategories) : [];

      const newCategory: Category = {
        id: Date.now().toString(),
        name,
        color,
      };

      const updatedCategories = [...allCategories, newCategory];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategoryToNote = useCallback(async (noteId: string, categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      const savedCategories = localStorage.getItem('categories');
      
      if (!savedNotes || !savedCategories) return;

      const allNotes: Note[] = JSON.parse(savedNotes);
      const allCategories: Category[] = JSON.parse(savedCategories);

      const category = allCategories.find(c => c.id === categoryId);
      if (!category) throw new Error('Category not found');

      const updatedNotes = allNotes.map((note: any) => {
        if (note.id === noteId) {
          const existingCategories = note.categories || [];
          const categoryExists = existingCategories.some((c: any) => c.id === categoryId);
          
          if (!categoryExists) {
            return { ...note, categories: [...existingCategories, category] };
          }
        }
        return note;
      });

      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category to note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCategoryFromNote = useCallback(
    async (noteId: string, categoryId: string) => {
      setLoading(true);
      setError(null);
      try {
        const savedNotes = localStorage.getItem('notes');
        if (!savedNotes) return;

        const allNotes: Note[] = JSON.parse(savedNotes);

        const updatedNotes = allNotes.map((note: any) => {
          if (note.id === noteId && note.categories) {
            return {
              ...note,
              categories: note.categories.filter((c: any) => c.id !== categoryId)
            };
          }
          return note;
        });

        localStorage.setItem('notes', JSON.stringify(updatedNotes));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove category from note');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const filterNotesByCategory = useCallback(async (categoryId: string): Promise<Note[]> => {
    setLoading(true);
    setError(null);
    try {
      const savedNotes = localStorage.getItem('notes');
      if (!savedNotes) return [];

      const allNotes: Note[] = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));

      // Filtrar solo notas activas (no archivadas) que tengan la categoría
      return allNotes.filter((note: any) => 
        !note.isArchived && note.categories && note.categories.some((c: any) => c.id === categoryId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter notes by category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    addCategoryToNote,
    removeCategoryFromNote,
    filterNotesByCategory,
  };
}
