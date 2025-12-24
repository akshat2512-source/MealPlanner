import React, { useEffect, useState } from 'react';
import SearchBar from '../components/recipes/SearchBar.jsx';
import RecipeGrid from '../components/recipes/RecipeGrid.jsx';
import Loader from '../components/common/Loader.jsx';
import Error from '../components/common/Error.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { searchMeals } from '../api/mealdb.js';

function Home() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    let active = true;

    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setRecipes([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);

    searchMeals(trimmed)
      .then(meals => {
        if (!active) {
          return;
        }
        setRecipes(meals || []);
        setHasSearched(true);
      })
      .catch(errorValue => {
        if (!active) {
          return;
        }
        setError(errorValue.message || 'Unable to fetch recipes');
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const performRetry = () => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      return;
    }
    setLoading(true);
    setError(null);
    searchMeals(trimmed)
      .then(meals => {
        setRecipes(meals || []);
        setHasSearched(true);
      })
      .catch(errorValue => {
        setError(errorValue.message || 'Unable to fetch recipes');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <div className="page-title">Discover recipes</div>
            <div className="page-subtitle">
              Search across thousands of meals from TheMealDB and send
              favorites to your weekly planner.
            </div>
          </div>
          <span className="primary-pill">Powered by TheMealDB</span>
        </div>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {loading && <Loader />}

      {!loading && error && (
        <Error message={error} onRetry={performRetry} />
      )}

      {!loading && !error && recipes.length === 0 && hasSearched && (
        <EmptyState
          title="No recipes found"
          message="Try adjusting your search or using more general keywords."
        />
      )}

      {!loading && !error && recipes.length === 0 && !hasSearched && (
        <EmptyState
          title="Start by searching"
          message="Look up ingredients, cuisines, or specific dishes to plan your week."
        />
      )}

      {!loading && !error && recipes.length > 0 && (
        <RecipeGrid meals={recipes} />
      )}
    </div>
  );
}

export default Home;
