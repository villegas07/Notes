'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CategoriesService, CategoryPayload } from '@/app/infrastructure/http/CategoriesService';
import { Category } from '@/core/domain/entities/Note';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCategories = useCallback(async () => {
    if (!token) {
      console.log('No token available, skipping categories fetch');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching categories...');
      const result: any = await CategoriesService.getCategories(token);
      console.log('Categories fetched:', result);

      // Ajuste robusto para extraer el array de categorías
      let categoriesArray: Category[] = [];
      if (Array.isArray(result)) {
        categoriesArray = result;
      } else if (result?.data?.categories && Array.isArray(result.data.categories)) {
        categoriesArray = result.data.categories;
      } else if (result?.categories && Array.isArray(result.categories)) {
        categoriesArray = result.categories;
      } else if (result?.data && Array.isArray(result.data)) {
        categoriesArray = result.data;
      }

      console.log('Categories array:', categoriesArray);
      setCategories(categoriesArray);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Solo cargar categorías si hay un token disponible
    if (token) {
      fetchCategories();
    }
  }, [token, fetchCategories]);

  const createCategory = useCallback(async (name: string, color: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      console.log('Creating category:', { name, color });
      await CategoriesService.createCategory({ name, color }, token);
      await fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCategories]);

  const addCategoryToNote = useCallback(async (noteId: string, categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        console.error('❌ NO TOKEN AVAILABLE');
        throw new Error('No auth token');
      }

      console.log('🔵 useCategories.addCategoryToNote - Starting');
      console.log('📝 Note ID:', noteId);
      console.log('🏷️  Category ID:', categoryId);
      console.log('🔑 Token present:', !!token);
      console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');

      const result = await CategoriesService.addCategoryToNote(noteId, categoryId, token);
      console.log('✅ Category added to note successfully:', result);

      return result;
    } catch (err) {
      console.error('❌ Error in useCategories.addCategoryToNote:', err);
      if (err instanceof Error) {
        console.error('❌ Error message:', err.message);
        console.error('❌ Error stack:', err.stack);
      }
      setError(err instanceof Error ? err.message : 'Failed to add category to note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const removeCategoryFromNote = useCallback(
    async (noteId: string, categoryId: string) => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error('No auth token');
        console.log('Removing category from note:', { noteId, categoryId });
        await CategoriesService.removeCategoryFromNote(noteId, categoryId, token);
        console.log('Category removed from note successfully');
      } catch (err) {
        console.error('Error removing category from note:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove category from note');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const filterNotesByCategory = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error('No auth token');
      console.log('Filtering notes by category:', categoryId);
      const notes = await CategoriesService.getNotesByCategory(categoryId, token);
      console.log('Filtered notes:', notes);
      return notes;
    } catch (err) {
      console.error('Error filtering notes by category:', err);
      setError(err instanceof Error ? err.message : 'Failed to filter notes by category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

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