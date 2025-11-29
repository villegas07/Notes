'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string) => Promise<any>;
}

const PRESET_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export function CategoryModal({ isOpen, onClose, onCreate }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await onCreate(name, color);
      setName('');
      setColor(PRESET_COLORS[0]);
      onClose();
      await Swal.fire({
        title: 'Created!',
        text: 'Category has been created successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error('Failed to create category:', error);
      let errorMsg = 'Failed to create category';
      if (error?.message === 'Category already exists' || error?.message?.includes('Category already exists')) {
        errorMsg = 'A category with that name already exists. Please choose another name.';
      }
      await Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-900 mb-1">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work, Personal, Ideas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    color === presetColor ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
