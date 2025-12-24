import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ meal }) {
  const { idMeal, strMeal, strMealThumb, strCategory, strArea } = meal;

  return (
    <Link to={`/recipe/${idMeal}`} className="recipe-card">
      <div className="recipe-card-image-wrapper">
        <img
          src={strMealThumb}
          alt={strMeal}
          className="recipe-card-image"
          loading="lazy"
        />
        <span className="badge recipe-card-pill">
          <span className="recipe-card-category-dot" />
          {strCategory || 'Uncategorized'}
        </span>
      </div>
      <div className="recipe-card-body">
        <div className="recipe-card-title">{strMeal}</div>
        <div className="recipe-card-meta">
          <span className="recipe-card-category">
            {strArea && <span>{strArea}</span>}
          </span>
          <span className="recipe-card-chevron" aria-hidden="true">
            ⟶
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
