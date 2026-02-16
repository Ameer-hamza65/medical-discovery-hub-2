import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserSubscriptionType = 'none' | 'individual' | 'subscriber';

export interface UserState {
  isLoggedIn: boolean;
  subscriptionType: UserSubscriptionType;
  ownedBooks: string[]; // Book IDs
  name?: string;
  email?: string;
}

interface UserContextType {
  user: UserState;
  login: (email: string, subscriptionType?: UserSubscriptionType, ownedBooks?: string[]) => void;
  logout: () => void;
  purchaseBook: (bookId: string) => void;
  subscribe: () => void;
  ownsBook: (bookId: string) => boolean;
  hasFullAccess: (bookId: string) => boolean;
}

const defaultUser: UserState = {
  isLoggedIn: false,
  subscriptionType: 'none',
  ownedBooks: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUser);

  const login = useCallback((email: string, subscriptionType: UserSubscriptionType = 'none', ownedBooks: string[] = []) => {
    setUser({
      isLoggedIn: true,
      subscriptionType,
      ownedBooks,
      email,
      name: email.split('@')[0],
    });
  }, []);

  const logout = useCallback(() => {
    setUser(defaultUser);
  }, []);

  const purchaseBook = useCallback((bookId: string) => {
    setUser(prev => ({
      ...prev,
      ownedBooks: prev.ownedBooks.includes(bookId) 
        ? prev.ownedBooks 
        : [...prev.ownedBooks, bookId],
      subscriptionType: prev.subscriptionType === 'none' ? 'individual' : prev.subscriptionType,
    }));
  }, []);

  const subscribe = useCallback(() => {
    setUser(prev => ({
      ...prev,
      subscriptionType: 'subscriber',
    }));
  }, []);

  const ownsBook = useCallback((bookId: string) => {
    return user.ownedBooks.includes(bookId);
  }, [user.ownedBooks]);

  const hasFullAccess = useCallback((bookId: string) => {
    return user.subscriptionType === 'subscriber' || user.ownedBooks.includes(bookId);
  }, [user.subscriptionType, user.ownedBooks]);

  return (
    <UserContext.Provider value={{ user, login, logout, purchaseBook, subscribe, ownsBook, hasFullAccess }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
