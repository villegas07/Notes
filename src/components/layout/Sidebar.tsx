'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/core/domain/entities/Note';

interface SidebarProps {
  activeView: 'active' | 'archived';
  onViewChange: (view: 'active' | 'archived') => void;
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onCreateCategory: () => void;
}

export function Sidebar({
  activeView,
  onViewChange,
  categories,
  selectedCategory,
  onCategorySelect,
  onCreateCategory,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          My Notes
        </h1>
      </div>

      <div className="space-y-2 mb-8">
        <button
          onClick={() => onViewChange('active')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'active'
              ? 'bg-teal-100 text-teal-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Active Notes</span>
        </button>

        <button
          onClick={() => onViewChange('archived')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeView === 'archived'
              ? 'bg-teal-100 text-teal-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span>Archived</span>
        </button>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-900">Categories</h2>
          <button
            onClick={onCreateCategory}
            className="text-teal-600 hover:text-teal-700 text-xl"
            title="Create category"
          >
            +
          </button>
        </div>

        {activeView === 'archived' && (
          <p className="text-xs text-gray-500 mb-2 px-3">
            Category filter only works with active notes
          </p>
        )}

        <div className="space-y-1">
          <button
            onClick={() => onCategorySelect(null)}
            disabled={activeView === 'archived'}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-700 hover:bg-gray-100'
            } ${activeView === 'archived' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span>All notes</span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              disabled={activeView === 'archived'}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${activeView === 'archived' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: category.color || '#d1d5db' }}
              ></span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout button */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
