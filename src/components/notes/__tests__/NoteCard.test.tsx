import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteCard } from '../NoteCard';
import { Note } from '@/core/domain/entities/Note';

describe('NoteCard', () => {
  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    description: 'Test Content',
    isArchived: false,
    createdAt: new Date('2025-11-27T10:00:00'),
    updatedAt: new Date('2025-11-27T17:15:00'),
    categories: [],
  };

  const mockOnClick = jest.fn();
  const mockOnArchive = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render note title and content', () => {
    render(
      <NoteCard
        note={mockNote}
        onClick={mockOnClick}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    render(
      <NoteCard
        note={mockNote}
        onClick={mockOnClick}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Test Note'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show action buttons on hover', () => {
    const { container } = render(
      <NoteCard
        note={mockNote}
        onClick={mockOnClick}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(card);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should call onArchive without triggering onClick', () => {
    const { container } = render(
      <NoteCard
        note={mockNote}
        onClick={mockOnClick}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(card);

    const archiveButton = screen.getByTitle('Archive');
    fireEvent.click(archiveButton);

    expect(mockOnArchive).toHaveBeenCalledWith('1');
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should call onDelete without triggering onClick', () => {
    const { container } = render(
      <NoteCard
        note={mockNote}
        onClick={mockOnClick}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(card);

    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should render categories when present', () => {
    const noteWithCategories: Note = {
      ...mockNote,
      categories: [
        { category: { id: '1', name: 'Work', color: '#3b82f6' } },
        { category: { id: '2', name: 'Personal', color: '#10b981' } },
      ],
    };

    render(
      <NoteCard
        note={noteWithCategories}
        onClick={mockOnClick}
        onArchive={mockOnArchive}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
  });
});
