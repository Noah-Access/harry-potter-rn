// hooks/useBookmarks.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Book = {
  cover: string;
  description: string;
  index: number;
  number: number;
  originalTitle: string;
  pages: number;
  releaseDate: string;
  title: string;
};

const BOOKMARKS_KEY = 'bookmarks';

function useAsyncStorage<T = string>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue != null) {
          setValue(JSON.parse(jsonValue));
        } else if (initialValue !== undefined) {
          setValue(initialValue);
          await AsyncStorage.setItem(key, JSON.stringify(initialValue));
        }
      } catch (e) {
        console.error('Failed to load from AsyncStorage:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [key]);

  const save = async (newValue: T) => {
    try {
      const jsonValue = JSON.stringify(newValue);
      await AsyncStorage.setItem(key, jsonValue);
      setValue(newValue);
    } catch (e) {
      console.error('Failed to save to AsyncStorage:', e);
    }
  };

  const remove = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setValue(null);
    } catch (e) {
      console.error('Failed to remove from AsyncStorage:', e);
    }
  };

  return { value, setValue: save, remove, loading };
}

// Custom bookmarks hook using the generic one
export function useBookmarks() {
  const {
    value: bookmarks = [],
    setValue,
    remove,
    loading,
  } = useAsyncStorage<Book[]>(BOOKMARKS_KEY, []);

  const addBookmark = useCallback(
    async (newBook: Book) => {
      const exists = bookmarks.some((b) => b.index === newBook.index);
      if (!exists) {
        await setValue([...bookmarks, newBook]);
      }
    },
    [bookmarks, setValue]
  );

  const removeBookmark = useCallback(
    async (indexToRemove: number) => {
      const updated = bookmarks.filter((b) => b.index !== indexToRemove);
      await setValue(updated);
    },
    [bookmarks, setValue]
  );

  const toggleBookmark = useCallback(
    async (book: Book) => {
      const exists = bookmarks.some((b) => b.index === book.index);
      if (exists) {
        await removeBookmark(book.index);
      } else {
        await addBookmark(book);
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  const reload = async () => {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_KEY);
    const parsed = jsonValue ? JSON.parse(jsonValue) : [];
    setValue(parsed);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks: remove,
    loading,reload
  };
}
