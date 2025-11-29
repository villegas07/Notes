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
      const result = await CategoriesService.getCategories(token);
      console.log('Categories fetched:', result);
      
      // Ajuste: extraer el array real de categorías
      const categoriesArray = Array.isArray(result)
        ? result
        : result?.data?.categories || result?.data || [];
      
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
        throw new Error('No auth token');
      }
      
      console.log('useCategories.addCategoryToNote - Starting');
      console.log('noteId:', noteId);
      console.log('categoryId:', categoryId);
      console.log('token present:', !!token);
      
      const result = await CategoriesService.addCategoryToNote(noteId, categoryId, token);
      console.log('Category added to note successfully:', result);
      
      return result;
    } catch (err) {
      console.error('Error in useCategories.addCategoryToNote:', err);
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