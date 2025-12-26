import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = 'mealplanner-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    // ignore storage errors and fall back to default
  }

  return 'light';
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  };

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export { ThemeProvider, useTheme };
