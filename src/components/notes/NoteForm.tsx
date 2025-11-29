'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id?: string;
  title: string;
  description?: string;
  categories?: Category[];
}

interface NoteFormProps {
  note?: Note;
  onSave: (data: { title: string; description: string; categoryId?: string }) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  onAddCategory?: (noteId: string, categoryId: string) => Promise<void>;
}

export function NoteForm({ note, onSave, onCancel, categories, onAddCategory }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [description, setDescription] = useState(note?.description || '');
  const [selectedCategory, setSelectedCategory] = useState(note?.categories?.[0]?.id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [removingCategory, setRemovingCategory] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description || '');
      setSelectedCategory(note.categories?.[0]?.id || '');
    }
  }, [note]);

  const handleRemoveCategory = async () => {
    if (!note || !selectedCategory || !note.id) return;
    setRemovingCategory(true);
    try {
      if (note && note.id && selectedCategory && typeof onAddCategory === 'function') {
        // Usar removeCategoryFromNote si está disponible
        if (typeof (note as any).removeCategoryFromNote === 'function') {
          await (note as any).removeCategoryFromNote(note.id, selectedCategory);
        } else if (typeof (window as any).removeCategoryFromNote === 'function') {
          await (window as any).removeCategoryFromNote(note.id, selectedCategory);
        }
      }
      setSelectedCategory('');
    } finally {
      setRemovingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSaving(true);
    try {
      let categoryId: string | undefined = undefined;
      if (typeof selectedCategory === 'string' && selectedCategory.trim() !== '' && selectedCategory !== 'undefined') {
        categoryId = selectedCategory;
      }
      await onSave({ title, description, categoryId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4">
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
            />
            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {description.length} characters
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected:</span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: categories.find(c => c.id === selectedCategory)?.color + '30',
                    color: categories.find(c => c.id === selectedCategory)?.color 
                  }}
                >
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  onClick={handleRemoveCategory}
                  disabled={removingCategory}
                >
                  {removingCategory ? 'Removing...' : 'Remove category'}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
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