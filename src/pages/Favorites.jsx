import React from 'react';
import PageBanner from '../components/layout/PageBanner.jsx';
import RecipeGrid from '../components/recipes/RecipeGrid.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import plannerBanner from '../assets/images/planner-banner.jpg';
import { useFavorites } from '../context/FavoritesContext.jsx';

function Favorites() {
  const { favorites } = useFavorites();
  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div className="page">
      <PageBanner
        eyebrow="Saved for later"
        title="Your favorite recipes"
        subtitle="Keep a shortlist of recipes you love and drop them into your weekly plan whenever you're ready."
        image={plannerBanner}
      />

      {!hasFavorites && (
        <EmptyState
          title="No favorites yet"
          message="Browse recipes and use the save button on any card or recipe page to keep it here."
        />
      )}

      {hasFavorites && <RecipeGrid meals={favorites} />}
    </div>
  );
}

export default Favorites;
