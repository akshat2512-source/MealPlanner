import React from 'react';
import RecipeCard from './RecipeCard.jsx';

function RecipeGrid({ meals }) {
  if (!meals || meals.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-recipes" aria-label="Recipe results">
      {meals.map(meal => (
        <RecipeCard key={meal.idMeal} meal={meal} />
      ))}
    </div>
  );
}

export default RecipeGrid;
