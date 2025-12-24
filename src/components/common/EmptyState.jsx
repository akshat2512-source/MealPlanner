import React from 'react';

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-root">
      {title && <div className="page-title">{title}</div>}
      {message && <div className="empty-message">{message}</div>}
      {onAction && actionLabel && (
        <div className="empty-actions">
          <button
            type="button"
            className="button button-sm button-ghost"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
