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

  // Función helper para formatear fecha de forma segura
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'Sin fecha';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Verificar si la fecha es válida
      if (isNaN(dateObj.getTime())) {
        return 'Fecha inválida';
      }
      
      return format(dateObj, 'd MMM, HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Error en fecha';
    }
  };

  return (
    <div
      className="relative bg-white border border-teal-200 rounded-lg p-4 cursor-pointer hover:border-teal-400 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note.id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title={isArchived ? "Unarchive" : "Archive"}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isArchived ? (
                // Icono de desarchivar (flecha hacia arriba)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                // Icono de archivar
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              )}
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete"
          >
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      <h3 className="font-semibold text-gray-900 mb-2 pr-16">{note.title}</h3>
      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
        {note.description || note.content || ''}
      </p>
      <div className="text-xs text-gray-500">
        {formatDate(note.updatedAt)}
      </div>

      {note.categories && note.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.categories
            .filter((category) => category && category.id && category.name && category.color)
            .map((category) => (
              <span
                key={category.id}
                className="px-2 py-1 rounded text-xs font-medium"
                style={{ backgroundColor: category.color + '30', color: category.color }}
              >
                {category.name}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}