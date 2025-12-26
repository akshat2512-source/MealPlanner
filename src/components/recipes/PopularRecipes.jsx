import React, { useMemo } from 'react';
import RecipeGrid from './RecipeGrid.jsx';
import { EMPTY_SUGGESTIONS } from '../common/EmptyState.jsx';

function PopularRecipes() {
  const meals = useMemo(
    () =>
      EMPTY_SUGGESTIONS.map(item => ({
        idMeal: item.id,
        strMeal: item.title,
        strMealThumb: item.thumb,
        strCategory: item.category,
        strArea: item.area,
      })),
    []
  );

  if (!meals || meals.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="popular-heading"
      className="popular-section"
      style={{ marginTop: '1.5rem' }}
    >
      <div className="surface-card">
        <div className="surface-inner">
          <div className="page-header" style={{ marginBottom: '0.75rem' }}>
            <div className="page-title">Popular this week</div>
            <p className="page-subtitle">
              A few tried-and-true meals people often start with. Tap any recipe to
              learn more.
            </p>
          </div>
          <RecipeGrid meals={meals.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}

export default PopularRecipes;
