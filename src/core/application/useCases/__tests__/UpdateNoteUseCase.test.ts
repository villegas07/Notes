import { UpdateNoteUseCase } from '../UpdateNoteUseCase';
import { NoteRepository } from '../../../domain/repositories/NoteRepository';
import { Note, UpdateNoteDto } from '../../../domain/entities/Note';

describe('UpdateNoteUseCase', () => {
  let mockNoteRepository: jest.Mocked<NoteRepository>;
  let updateNoteUseCase: UpdateNoteUseCase;

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

    updateNoteUseCase = new UpdateNoteUseCase(mockNoteRepository);
  });

  it('should update a note with valid data', async () => {
    const noteId = '1';
    const updateData: UpdateNoteDto = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    const expectedNote: Note = {
      id: noteId,
      title: updateData.title!,
      content: updateData.content!,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockNoteRepository.updateNote.mockResolvedValue(expectedNote);

    const result = await updateNoteUseCase.execute(noteId, updateData);

    expect(result).toEqual(expectedNote);
    expect(mockNoteRepository.updateNote).toHaveBeenCalledWith(noteId, updateData);
  });

  it('should throw error when note ID is not provided', async () => {
    const updateData: UpdateNoteDto = {
      title: 'Updated Title',
    };

    await expect(updateNoteUseCase.execute('', updateData)).rejects.toThrow(
      'Note ID is required'
    );
  });

  it('should throw error when title is empty string', async () => {
    const updateData: UpdateNoteDto = {
      title: '',
    };

    await expect(updateNoteUseCase.execute('1', updateData)).rejects.toThrow(
      'Title cannot be empty'
    );
  });

  it('should throw error when content is empty string', async () => {
    const updateData: UpdateNoteDto = {
      content: '',
    };

    await expect(updateNoteUseCase.execute('1', updateData)).rejects.toThrow(
      'Content cannot be empty'
    );
  });

  it('should allow partial updates', async () => {
    const noteId = '1';
    const updateData: UpdateNoteDto = {
      title: 'Updated Title Only',
    };

    const expectedNote: Note = {
      id: noteId,
      title: updateData.title!,
      content: 'Original Content',
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockNoteRepository.updateNote.mockResolvedValue(expectedNote);

    const result = await updateNoteUseCase.execute(noteId, updateData);

    expect(result).toEqual(expectedNote);
  });
});
