'use client';

import { Note } from '@/core/domain/entities/Note';
import { format } from 'date-fns';
import { useState } from 'react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isArchived?: boolean;
}

export function NoteCard({ note, onClick, onArchive, onDelete, isArchived = false }: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'Sin fecha';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Fecha inválida';
      return format(dateObj, 'd MMM, HH:mm');
    } catch {
      return 'Error en fecha';
    }
  };

  return (
    <div
      className="relative bg-white border border-teal-200 rounded-lg p-4 cursor-pointer hover:border-teal-400 hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Botones hover */}
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note.id);
            }}
            className="p-1.5 bg-white hover:bg-gray-100 rounded-full shadow-sm transition-colors"
            title={isArchived ? 'Unarchive' : 'Archive'}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isArchived ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              )}
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1.5 bg-white hover:bg-red-50 rounded-full shadow-sm transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Título */}
      <h3 className="font-semibold text-gray-900 mb-2 pr-16 line-clamp-2">
        {note.title}
      </h3>

      {/* Descripción */}
      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
        {note.description || 'No content'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">

        {/* Fecha */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(note.updatedAt)}
        </div>

        {/* Categorías + archived */}
        <div className="flex items-center gap-2">

          {/* CATEGORÍAS CORREGIDAS */}
{Array.isArray(note.categories) && note.categories.length > 0 && (
  <div className="flex gap-2 flex-wrap">
    {note.categories.map((rel, index) => {
      const cat = rel?.category;
      if (!cat) return null;
      const safeColor = cat.color || "#3b82f6";
      const safeName = cat.name || "Sin categoría";
      return (
        <span
          key={`${cat.id}-${index}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
          style={{
            backgroundColor: `${safeColor}20`,
            color: safeColor,
            border: `1px solid ${safeColor}`,
          }}
        >
          {safeName}
        </span>
      );
    })}
  </div>
)}

          {/* Label Archived */}
          {isArchived && (
            <div className="flex items-center gap-1 text-xs text-amber-600 font-medium whitespace-nowrap">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Archived
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
