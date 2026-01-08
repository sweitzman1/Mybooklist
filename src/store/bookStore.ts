import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Book, BookState } from '@/types';

export const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      books: [],

      addBook: (book) => {
        const newBook: Book = {
          ...book,
          id: uuidv4(),
          dateAdded: new Date().toISOString(),
        };
        set((state) => ({
          books: [newBook, ...state.books],
        }));
      },

      updateBook: (id, updates) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id ? { ...book, ...updates } : book
          ),
        }));
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
      },

      importBooks: (books) => {
        const newBooks: Book[] = books.map((book) => ({
          ...book,
          id: uuidv4(),
          dateAdded: new Date().toISOString(),
        }));
        set((state) => ({
          books: [...newBooks, ...state.books],
        }));
      },
    }),
    {
      name: 'books-storage',
    }
  )
);
