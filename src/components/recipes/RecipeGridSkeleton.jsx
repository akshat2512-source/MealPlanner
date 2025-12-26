import React from 'react';

function RecipeGridSkeleton() {
  const items = Array.from({ length: 6 });

  return (
    <div
      className="grid grid-recipes"
      aria-label="Loading recipes"
      aria-busy="true"
    >
      {items.map((_, index) => (
        <div key={index} className="recipe-card skeleton-card" aria-hidden="true">
          <div className="skeleton-image" />
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line-lg" />
            <div className="skeleton-line skeleton-line-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecipeGridSkeleton;
