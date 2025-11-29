export interface Note {
  id: string;
  title: string;
  description: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CreateNoteDto {
  title: string;
  description: string;
}

export interface UpdateNoteDto {
  title?: string;
  description?: string;
}
