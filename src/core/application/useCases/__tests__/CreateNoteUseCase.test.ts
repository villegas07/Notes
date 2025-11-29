import { CreateNoteUseCase } from '../CreateNoteUseCase';
import { NoteRepository } from '../../../domain/repositories/NoteRepository';
import { Note, CreateNoteDto } from '../../../domain/entities/Note';

describe('CreateNoteUseCase', () => {
  let mockNoteRepository: jest.Mocked<NoteRepository>;
  let createNoteUseCase: CreateNoteUseCase;

  beforeEach(() => {
    mockNoteRepository = {
      createNote: jest.fn(),
      getActiveNotes: jest.fn(),
      getArchivedNotes: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
      archiveNote: jest.fn(),
      unarchiveNote: jest.fn(),
    };

    createNoteUseCase = new CreateNoteUseCase(mockNoteRepository);
  });

  it('should create a note with valid data', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test Note',
      content: 'Test Content',
    };

    const expectedNote: Note = {
      id: '1',
      ...noteData,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockNoteRepository.createNote.mockResolvedValue(expectedNote);

    const result = await createNoteUseCase.execute(noteData);

    expect(result).toEqual(expectedNote);
    expect(mockNoteRepository.createNote).toHaveBeenCalledWith(noteData);
  });

  it('should throw error when title is empty', async () => {
    const noteData: CreateNoteDto = {
      title: '',
      content: 'Test Content',
    };

    await expect(createNoteUseCase.execute(noteData)).rejects.toThrow('Title is required');
  });

  it('should throw error when content is empty', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test Note',
      content: '',
    };

    await expect(createNoteUseCase.execute(noteData)).rejects.toThrow('Content is required');
  });

  it('should throw error when title contains only whitespace', async () => {
    const noteData: CreateNoteDto = {
      title: '   ',
      content: 'Test Content',
    };

    await expect(createNoteUseCase.execute(noteData)).rejects.toThrow('Title is required');
  });

  it('should throw error when content contains only whitespace', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test Note',
      content: '   ',
    };

    await expect(createNoteUseCase.execute(noteData)).rejects.toThrow('Content is required');
  });
});
