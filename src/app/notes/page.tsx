'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useCategories } from '@/hooks/useCategories';
import { Sidebar } from '@/components/layout/Sidebar';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteForm } from '@/components/notes/NoteForm';
import { NoteDetail } from '@/components/notes/NoteDetail';
import { CategoryModal } from '@/components/ui/CategoryModal';
import { Note } from '@/core/domain/entities/Note';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

export default function NotesPage() {
  const [activeView, setActiveView] = useState<'active' | 'archived'>('active');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    notes,
    loading,
    error,
    fetchActiveNotes,
    fetchArchivedNotes,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
  } = useNotes();

  const { categories, createCategory, filterNotesByCategory, addCategoryToNote } = useCategories();

  useEffect(() => {
    if (selectedCategory) {
      filterNotesByCategory(selectedCategory).then(setFilteredNotes);
    } else {
      setFilteredNotes(notes);
    }
  }, [selectedCategory, notes, filterNotesByCategory]);

  const handleCreateNote = async (data: { title: string; description: string; categoryId?: string }) => {
    const payload: { title: string; description: string } = {
      title: data.title,
      description: data.description
    };
    const newNote = await createNote(payload);
    if (
      typeof data.categoryId === 'string' &&
      data.categoryId !== undefined &&
      data.categoryId !== null &&
      data.categoryId.trim() !== '' &&
      newNote?.id
    ) {
      await addCategoryToNote(newNote.id, data.categoryId);
    }
    setViewMode('list');
  };

  const handleUpdateNote = async (data: { title: string; description: string }) => {
    if (selectedNote) {
      await updateNote(selectedNote.id, { title: data.title, description: data.description });
      setViewMode('list');
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      setViewMode('list');
      setSelectedNote(null);
    }
  };

  const handleArchiveNote = async (id: string) => {
    await archiveNote(id);
    setViewMode('list');
    setSelectedNote(null);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setViewMode('detail');
  };

  const handleEditNote = () => {
    setViewMode('edit');
  };

  const renderContent = () => {
    if (viewMode === 'create') {
      return (
        <div className="flex items-center justify-center h-full">
          <NoteForm
            onSave={handleCreateNote}
            onCancel={() => setViewMode('list')}
            categories={categories}
          />
        </div>
      );
    }

    if (viewMode === 'edit' && selectedNote) {
      return (
        <div className="flex items-center justify-center h-full">
          <NoteForm
            note={selectedNote}
            onSave={handleUpdateNote}
            onCancel={() => setViewMode('detail')}
            categories={categories}
          />
        </div>
      );
    }

    if (viewMode === 'detail' && selectedNote) {
      return (
        <div className="flex items-center justify-center h-full">
          <NoteDetail
            note={selectedNote}
            onEdit={handleEditNote}
            onArchive={() => handleArchiveNote(selectedNote.id)}
            onDelete={() => handleDeleteNote(selectedNote.id)}
            onClose={() => {
              setViewMode('list');
              setSelectedNote(null);
            }}
          />
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {activeView === 'active' ? 'Active Notes' : 'Archived Notes'}
          </h2>
          {activeView === 'active' && (
            <button
              onClick={() => setViewMode('create')}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              + New
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-500">Loading notes...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">Error: {error}</div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {activeView === 'active' ? 'Welcome to My Notes' : 'No archived notes'}
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {activeView === 'active'
                ? 'Organize your ideas, tasks and thoughts in one place. Create categories, archive notes and keep everything organized.'
                : 'You don\'t have any archived notes yet.'}
            </p>
            {activeView === 'active' && (
              <button
                onClick={() => setViewMode('create')}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                + Create my first note
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredNotes.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note, idx) => (
                <NoteCard
                  key={note.id || `${note.title}-${note.description}-${idx}`}
                  note={note}
                  onClick={() => handleNoteClick(note)}
                  onArchive={handleArchiveNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onCreateCategory={() => setIsCategoryModalOpen(true)}
      />
      <div className="flex-1 overflow-auto">{renderContent()}</div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreate={createCategory}
      />
    </div>
  );
}