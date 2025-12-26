import React, { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/recipes/SearchBar.jsx';
import RecipeGrid from '../components/recipes/RecipeGrid.jsx';
import PopularRecipes from '../components/recipes/PopularRecipes.jsx';
import RecipeGridSkeleton from '../components/recipes/RecipeGridSkeleton.jsx';
import Loader from '../components/common/Loader.jsx';
import Error from '../components/common/Error.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import HeroCarousel from '../components/layout/HeroCarousel.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { searchMeals } from '../api/mealdb.js';
import useNetworkStatus from '../hooks/useNetworkStatus.js';
import { STORAGE_KEYS } from '../utils/constants.js';

function Home() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [lastSearchLabel, setLastSearchLabel] = useState('');
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (isOnline) {
      return;
    }
    try {
      const storedResults = window.localStorage.getItem(
        STORAGE_KEYS.LAST_SEARCH_RESULTS
      );
      const storedQuery = window.localStorage.getItem(
        STORAGE_KEYS.LAST_SEARCH_QUERY
      );
      if (storedResults) {
        const parsed = JSON.parse(storedResults);
        if (Array.isArray(parsed)) {
          setRecipes(parsed);
          setHasSearched(Boolean(storedQuery));
          setLastSearchLabel(storedQuery || '');
        }
      }
    } catch (storageError) {
    }
  }, [isOnline]);

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
        setLastSearchLabel(trimmed);
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              STORAGE_KEYS.LAST_SEARCH_RESULTS,
              JSON.stringify(meals || [])
            );
            window.localStorage.setItem(
              STORAGE_KEYS.LAST_SEARCH_QUERY,
              trimmed
            );
          } catch (storageError) {
          }
        }
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
        setLastSearchLabel(trimmed);
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              STORAGE_KEYS.LAST_SEARCH_RESULTS,
              JSON.stringify(meals || [])
            );
            window.localStorage.setItem(
              STORAGE_KEYS.LAST_SEARCH_QUERY,
              trimmed
            );
          } catch (storageError) {
          }
        }
      })
      .catch(errorValue => {
        setError(errorValue.message || 'Unable to fetch recipes');
      })
      .finally(() => setLoading(false));
  };

  const categories = useMemo(() => {
    const set = new Set();
    (recipes || []).forEach(meal => {
      if (meal && meal.strCategory) {
        set.add(meal.strCategory);
      }
    });
    return Array.from(set).sort();
  }, [recipes]);

  const cuisines = useMemo(() => {
    const set = new Set();
    (recipes || []).forEach(meal => {
      if (meal && meal.strArea) {
        set.add(meal.strArea);
      }
    });
    return Array.from(set).sort();
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    return (recipes || []).filter(meal => {
      if (!meal) {
        return false;
      }
      if (selectedCategory && meal.strCategory !== selectedCategory) {
        return false;
      }
      if (selectedCuisine && meal.strArea !== selectedCuisine) {
        return false;
      }
      return true;
    });
  }, [recipes, selectedCategory, selectedCuisine]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedCuisine('');
  };

  return (
    <div className="page">
      <HeroCarousel>
        <div className="hero-content">
          <div className="hero-eyebrow">Plan a delicious week</div>
          <h1 className="hero-title">Discover recipes you'll actually cook</h1>
          <p className="hero-subtitle">
            Search across thousands of meals from TheMealDB, then send your
            favorites straight into a balanced weekly plan.
          </p>
          <div className="hero-search-row">
            <SearchBar value={query} onChange={setQuery} />
            <span className="hero-powered-pill">Powered by TheMealDB</span>
          </div>
        </div>
      </HeroCarousel>

      {loading && <RecipeGridSkeleton />}

      {!loading && error && (
        <Error message={error} onRetry={performRetry} />
      )}

      {!loading && !error && !isOnline && recipes.length > 0 && (
        <div className="surface-card">
          <div className="surface-inner">
            <div className="surface-subtitle">
              You are offline. Showing last saved results
              {lastSearchLabel ? ` for "${lastSearchLabel}"` : ''}.
            </div>
          </div>
        </div>
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
        <>
          <section aria-label="Filter recipes">
            <div className="surface-card" style={{ marginBottom: '1rem' }}>
              <div className="surface-inner">
                <div className="filters-row">
                  <div className="filters-field">
                    <label htmlFor="filter-category" className="filters-label">
                      Category
                    </label>
                    <select
                      id="filter-category"
                      className="filters-select"
                      value={selectedCategory}
                      onChange={event => setSelectedCategory(event.target.value)}
                    >
                      <option value="">All categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filters-field">
                    <label htmlFor="filter-cuisine" className="filters-label">
                      Cuisine
                    </label>
                    <select
                      id="filter-cuisine"
                      className="filters-select"
                      value={selectedCuisine}
                      onChange={event => setSelectedCuisine(event.target.value)}
                    >
                      <option value="">All cuisines</option>
                      {cuisines.map(area => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(selectedCategory || selectedCuisine) && (
                    <button
                      type="button"
                      className="button button-sm button-ghost"
                      onClick={handleClearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <RecipeGrid meals={filteredRecipes} />
        </>
      )}

      <PopularRecipes />
    </div>
  );
}

export default Home;
