'use client';

import { Note } from '@/core/domain/entities/Note';
import { format } from 'date-fns';
import { useEffect } from 'react';

interface NoteDetailProps {
  note: Note;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
  isArchived?: boolean;
}

export default function NoteDetail({ note, onEdit, onArchive, onDelete, onClose, isArchived = false }: NoteDetailProps) {
  // Debug: verificar el valor de isArchived
  console.log('NoteDetail - isArchived:', isArchived);
  console.log('NoteDetail - note:', note);
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Función helper para formatear fecha de forma segura
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'No date';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;

      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }

      return format(dateObj, "d 'de' MMMM 'de' yyyy, HH:mm");
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Date error';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable content */}
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            {/* Header con botones de acción */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 pr-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{note.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                  </div>
                  {note.createdAt && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created: {formatDate(note.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                title="Close (Esc)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Categorías */}
            {note.categories && note.categories.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {note.categories
                    .filter((rel) => rel && rel.category && rel.category.id && rel.category.name)
                    .map((rel) => {
                      const cat = rel.category;
                      return (
                        <span
                          key={cat.id}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: cat.color ? cat.color + '20' : '#3b82f620',
                            color: cat.color || '#3b82f6',
                            border: `1px solid ${cat.color ? cat.color + '40' : '#3b82f640'}`
                          }}
                        >
                          {cat.name}
                        </span>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Contenido de la nota */}
            <div className="mb-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">

                  <p className="text-gray-900 whitespace-pre-wrap">{note.description}</p>

                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <button
                onClick={onArchive}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Archived
              </button>

              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors sm:ml-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}