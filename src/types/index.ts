export interface Book {
  id: string;
  title: string;
  author: string;
  yearRead: number;
  coverImage: string; // base64 or local path
  dateAdded: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string; // simple hash for demo
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
}

export interface BookState {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  importBooks: (books: Omit<Book, 'id' | 'dateAdded'>[]) => void;
}
