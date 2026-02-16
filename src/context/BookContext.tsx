import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { EpubBook, epubBooks as initialBooks } from '@/data/mockEpubData';

interface BookContextType {
  books: EpubBook[];
  addBook: (book: EpubBook) => void;
  removeBook: (bookId: string) => void;
  updateBook: (bookId: string, updates: Partial<EpubBook>) => void;
  getBook: (bookId: string) => EpubBook | undefined;
  totalBooks: number;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<EpubBook[]>(initialBooks);

  const addBook = useCallback((book: EpubBook) => {
    setBooks(prev => [...prev, book]);
  }, []);

  const removeBook = useCallback((bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId));
  }, []);

  const updateBook = useCallback((bookId: string, updates: Partial<EpubBook>) => {
    setBooks(prev => prev.map(b => 
      b.id === bookId ? { ...b, ...updates } : b
    ));
  }, []);

  const getBook = useCallback((bookId: string) => {
    return books.find(b => b.id === bookId);
  }, [books]);

  return (
    <BookContext.Provider value={{ 
      books, 
      addBook, 
      removeBook, 
      updateBook, 
      getBook,
      totalBooks: books.length 
    }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
