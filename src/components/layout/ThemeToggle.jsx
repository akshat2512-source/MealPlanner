import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-toggle-inner">
        <span className="theme-toggle-icon" aria-hidden="true">
          {isDark ? '🌙' : '☀️'}
        </span>
        <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
      </div>
    </button>
  );
}

export default ThemeToggle;
