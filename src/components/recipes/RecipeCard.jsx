import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import fallback1 from '../../assets/images/recipe-fallback-1.jpg';
import fallback2 from '../../assets/images/recipe-fallback-2.jpg';
import fallback3 from '../../assets/images/recipe-fallback-3.jpg';

function RecipeCard({ meal }) {
  const { idMeal, strMeal, strMealThumb, strCategory, strArea } = meal;

  const fallbackImages = useMemo(
    () => [fallback1, fallback2, fallback3],
    []
  );

  const [imageSrc, setImageSrc] = useState(strMealThumb || fallbackImages[0]);

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(idMeal);

  const handleImageError = () => {
    const index = Number(idMeal) % fallbackImages.length || 0;
    setImageSrc(fallbackImages[index]);
  };

  const handleFavoriteClick = event => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(meal);
  };

  return (
    <Link
      to={`/recipe/${idMeal}`}
      className="recipe-card"
      aria-label={`${strMeal} recipe details`}
    >
      <div className="recipe-card-image-wrapper">
        <button
          type="button"
          className={
            favorite
              ? 'button button-sm button-icon-only button-ghost recipe-card-favorite recipe-card-favorite-active'
              : 'button button-sm button-icon-only button-ghost recipe-card-favorite'
          }
          onClick={handleFavoriteClick}
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <span aria-hidden="true">{favorite ? '★' : '☆'}</span>
        </button>
        <img
          src={imageSrc}
          alt={strMeal}
          className="recipe-card-image"
          loading="lazy"
          onError={handleImageError}
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
