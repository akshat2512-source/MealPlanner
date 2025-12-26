import React from 'react';

function Error({ title = 'We ran into an issue', message, onRetry, retryLabel = 'Try again' }) {
  return (
    <div className="error-root" role="alert">
      <div className="error-icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="error-title">{title}</div>
      {message && <div className="error-message">{message}</div>}
      {onRetry && (
        <div className="error-actions">
          <button
            type="button"
            className="button button-sm button-ghost"
            onClick={onRetry}
          >
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default Error;
