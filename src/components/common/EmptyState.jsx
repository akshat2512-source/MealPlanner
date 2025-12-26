import React from 'react';
import { Link } from 'react-router-dom';
import emptyIllustration from '../../assets/images/recipe-fallback-1.jpg';

export const EMPTY_SUGGESTIONS = [
  {
    id: '52930',
    title: 'Pate Chinois',
    category: 'Beef',
    area: 'Canadian',
    thumb: 'https://www.themealdb.com/images/media/meals/yyrrxr1511816289.jpg',
  },
  {
    id: '52795',
    title: 'Chicken Handi',
    category: 'Chicken',
    area: 'Indian',
    thumb: 'https://www.themealdb.com/images/media/meals/wyxwsp1486979827.jpg',
  },
  {
    id: '52956',
    title: 'Chicken Congee',
    category: 'Chicken',
    area: 'Chinese',
    thumb: 'https://www.themealdb.com/images/media/meals/1529446352.jpg',
  },
  {
    id: '52803',
    title: 'Beef Wellington',
    category: 'Beef',
    area: 'British',
    thumb: 'https://www.themealdb.com/images/media/meals/vvpprx1487325699.jpg',
  },
  {
    id: '53191',
    title: 'Pad Thai',
    category: 'Seafood',
    area: 'Thai',
    thumb: 'https://www.themealdb.com/images/media/meals/rg9ze01763479093.jpg',
  },
  {
    id: '52806',
    title: 'Tandoori chicken',
    category: 'Chicken',
    area: 'Indian',
    thumb: 'https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg',
  },
];

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-root" role="status">
      <div className="empty-icon" aria-hidden="true">
        <img
          src={emptyIllustration}
          alt="No content yet"
          className="empty-image"
          loading="lazy"
        />
      </div>
      {title && <div className="page-title empty-title">{title}</div>}
      {message && <div className="empty-message">{message}</div>}
      <div className="empty-steps">
        {EMPTY_SUGGESTIONS.map(suggestion => (
          <Link
            key={suggestion.id}
            to={`/recipe/${suggestion.id}`}
            className="empty-suggestion-card-link"
          >
            <article className="empty-suggestion-card">
              <div className="empty-suggestion-image-wrapper">
                <img
                  src={suggestion.thumb}
                  alt={suggestion.title}
                  className="empty-suggestion-image"
                  loading="lazy"
                />
                <span className="badge empty-suggestion-pill">
                  <span className="recipe-card-category-dot" />
                  {suggestion.category}
                </span>
              </div>
              <div className="empty-suggestion-body">
                <div className="empty-suggestion-title">{suggestion.title}</div>
                <div className="empty-suggestion-meta">{suggestion.area}</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
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
