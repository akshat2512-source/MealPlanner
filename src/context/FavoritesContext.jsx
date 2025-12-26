import React, { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

const FavoritesContext = createContext(undefined);

function normalizeMealForFavorite(meal) {
  if (!meal) {
    return null;
  }

  const idMeal = meal.idMeal;

  if (!idMeal) {
    return null;
  }

  return {
    idMeal,
    strMeal: meal.strMeal || '',
    strMealThumb: meal.strMealThumb || '',
    strCategory: meal.strCategory || '',
    strArea: meal.strArea || '',
  };
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);

  const isFavorite = useCallback(
    idMeal => {
      if (!idMeal) {
        return false;
      }
      return favorites.some(item => item.idMeal === idMeal);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    meal => {
      const normalized = normalizeMealForFavorite(meal);
      if (!normalized) {
        return;
      }
      setFavorites(previous => {
        if (previous.some(item => item.idMeal === normalized.idMeal)) {
          return previous;
        }
        return [normalized, ...previous];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    idMeal => {
      if (!idMeal) {
        return;
      }
      setFavorites(previous => previous.filter(item => item.idMeal !== idMeal));
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    meal => {
      const normalized = normalizeMealForFavorite(meal);
      if (!normalized) {
        return;
      }
      setFavorites(previous => {
        const exists = previous.some(item => item.idMeal === normalized.idMeal);
        if (exists) {
          return previous.filter(item => item.idMeal !== normalized.idMeal);
        }
        return [normalized, ...previous];
      });
    },
    [setFavorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [addFavorite, favorites, isFavorite, removeFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
