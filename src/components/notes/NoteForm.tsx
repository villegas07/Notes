'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/core/domain/entities/Note';
import Swal from 'sweetalert2';

interface Note {
  id?: string;
  title: string;
  description?: string;
  categories?: Category[];
}

interface NoteFormProps {
  note?: Note;
  onSave: (data: { title: string; description: string }) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  onAddCategory?: (noteId: string, categoryId: string) => Promise<void>;
  onRemoveCategory?: (noteId: string, categoryId: string) => Promise<void>;
}

export function NoteForm({ 
  note, 
  onSave, 
  onCancel, 
  categories,
  onAddCategory,
  onRemoveCategory 
}: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [noteCategories, setNoteCategories] = useState<Category[]>(note?.categories || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isManagingCategory, setIsManagingCategory] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description || '');
      setNoteCategories(note.categories || []);
    }
  }, [note]);

  const handleAddCategory = async () => {
    // Debug logs
    console.log('=== DEBUG ADD CATEGORY ===');
    console.log('Selected category ID:', selectedCategoryId);
    console.log('Note ID:', note?.id);
    console.log('Has onAddCategory handler:', !!onAddCategory);
    console.log('Categories available:', categories);
    console.log('==========================');
    
    if (!selectedCategoryId || !note?.id || !onAddCategory) {
      console.log('❌ Cannot add category:', { selectedCategoryId, noteId: note?.id, hasHandler: !!onAddCategory });
      return;
    }
    
    // Verificar si la categoría ya está agregada
    if (noteCategories.some(c => c.id === selectedCategoryId)) {
      await Swal.fire({
        title: 'Categoría ya agregada',
        text: 'Esta categoría ya está asociada a la nota',
        icon: 'info',
        confirmButtonColor: '#0d9488',
      });
      return;
    }

    setIsManagingCategory(true);
    try {
      console.log('✅ Adding category to note:', { noteId: note.id, categoryId: selectedCategoryId });
      await onAddCategory(note.id, selectedCategoryId);
      
      console.log('✅ Category added successfully on backend');
      
      // Agregar la categoría al estado local
      const category = categories.find(c => c.id === selectedCategoryId);
      if (category) {
        console.log('✅ Found category in list:', category);
        setNoteCategories(prev => [...prev, category]);
      } else {
        console.log('⚠️ Category not found in categories list');
      }
      
      setSelectedCategoryId('');
      
      await Swal.fire({
        title: '¡Categoría agregada!',
        text: 'La categoría ha sido agregada a la nota.',
        icon: 'success',
        confirmButtonColor: '#0d9488',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding category:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo agregar la categoría',
        icon: 'error',
        confirmButtonColor: '#0d9488'
      });
    } finally {
      setIsManagingCategory(false);
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    if (!note?.id || !onRemoveCategory) return;
    
    const result = await Swal.fire({
      title: '¿Remover categoría?',
      text: "La categoría será removida de esta nota",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d9488',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setIsManagingCategory(true);
    try {
      await onRemoveCategory(note.id, categoryId);
      
      // Remover la categoría del estado local
      setNoteCategories(prev => prev.filter(c => c.id !== categoryId));
      
      await Swal.fire({
        title: '¡Categoría removida!',
        text: 'La categoría ha sido removida de la nota.',
        icon: 'success',
        confirmButtonColor: '#0d9488',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error removing category:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo remover la categoría',
        icon: 'error',
        confirmButtonColor: '#0d9488'
      });
    } finally {
      setIsManagingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSaving(true);
    try {
      await onSave({ title, description });
    } finally {
      setIsSaving(false);
    }
  };

  // Filtrar categorías disponibles (que no estén ya agregadas)
  const availableCategories = categories.filter(
    c => !noteCategories.some(nc => nc.id === c.id)
  );

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              required
              disabled={isSaving}
            />
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {description.length} characters
            </div>
          </div>

          {/* Gestión de categorías (solo en modo edición) */}
          {note?.id && (
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Categories
                </div>
              </label>
              
              {/* Categorías actuales */}
              {noteCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {noteCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: category.color + '20',
                        color: category.color,
                        border: `1px solid ${category.color}40`
                      }}
                    >
                      <span>{category.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.id)}
                        disabled={isManagingCategory}
                        className="hover:bg-black/10 rounded-full p-0.5 transition-colors disabled:opacity-50"
                        title="Remove category"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar nueva categoría */}
              {availableCategories.length > 0 ? (
                <div className="flex gap-2">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    disabled={isManagingCategory}
                  >
                    <option value="">Select a category to add...</option>
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!selectedCategoryId || isManagingCategory}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isManagingCategory ? 'Adding...' : 'Add'}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  {categories.length === 0
                    ? 'No categories available. Create categories first.'
                    : 'All available categories have been added'}
                </p>
              )}
            </div>
          )}

          {/* Nota informativa para nuevas notas */}
          {!note?.id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  <p className="text-sm text-blue-800">
                  You can add categories after creating the note by editing it.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || !title.trim() || !description.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}