import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import Error from '../components/common/Error.jsx';
import { lookupMealById } from '../api/mealdb.js';
import { parseIngredientsFromMeal } from '../utils/ingredientParser.js';
import { useMealPlan } from '../context/MealPlanContext.jsx';
import { DAYS, DAY_FULL_LABELS } from '../utils/constants.js';

function RecipeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const { addMealToDay } = useMealPlan();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    lookupMealById(id)
      .then(result => {
        if (!active) {
          return;
        }
        if (!result) {
          setError('Recipe not found');
          setMeal(null);
          setIngredients([]);
          return;
        }
        setMeal(result);
        setIngredients(parseIngredientsFromMeal(result));
      })
      .catch(errorValue => {
        if (!active) {
          return;
        }
        setError(errorValue.message || 'Unable to load recipe');
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
  }, [id]);

  const instructionsParagraphs = useMemo(() => {
    if (!meal || !meal.strInstructions) {
      return [];
    }
    return meal.strInstructions
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);
  }, [meal]);

  const handleAddToPlan = () => {
    if (!meal || !selectedDay) {
      return;
    }
    const mealForPlan = {
      id: meal.idMeal,
      title: meal.strMeal,
      thumbnail: meal.strMealThumb,
      category: meal.strCategory || '',
      area: meal.strArea || '',
      ingredients,
    };
    addMealToDay(selectedDay, mealForPlan);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={() => {
          setLoading(true);
          setError(null);
          lookupMealById(id)
            .then(result => {
              if (!result) {
                setError('Recipe not found');
                setMeal(null);
                setIngredients([]);
                return;
              }
              setMeal(result);
              setIngredients(parseIngredientsFromMeal(result));
            })
            .catch(errorValue => {
              setError(errorValue.message || 'Unable to load recipe');
            })
            .finally(() => setLoading(false));
        }}
      />
    );
  }

  if (!meal) {
    return (
      <Error
        message="Recipe not found."
        onRetry={() => navigate('/')}
        retryLabel="Back to search"
      />
    );
  }

  return (
    <div className="page">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(-1)}
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>

      <div className="surface-card">
        <div className="surface-inner">
          <div className="detail-hero">
            <div className="detail-image-wrapper">
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="detail-image"
              />
            </div>
            <div>
              <div className="detail-badges">
                {meal.strCategory && (
                  <span className="badge">
                    Category
                    <span>{meal.strCategory}</span>
                  </span>
                )}
                {meal.strArea && (
                  <span className="badge">
                    Cuisine
                    <span>{meal.strArea}</span>
                  </span>
                )}
              </div>
              <h1 className="detail-title">{meal.strMeal}</h1>
              <div className="detail-meta">
                {meal.strTags && (
                  <span>Tags: {meal.strTags.split(',').join(', ')}</span>
                )}
              </div>
              <div className="detail-actions">
                <label htmlFor="day-select" className="page-subtitle">
                  Add to day
                </label>
                <select
                  id="day-select"
                  value={selectedDay}
                  onChange={event => setSelectedDay(event.target.value)}
                  className="input-field"
                  style={{ maxWidth: '11rem', boxShadow: 'none' }}
                >
                  {DAYS.map(key => (
                    <option key={key} value={key}>
                      {DAY_FULL_LABELS[key]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleAddToPlan}
                >
                  Add to meal plan
                </button>
              </div>
            </div>
          </div>

          <div className="detail-columns" style={{ marginTop: '1.5rem' }}>
            <section>
              <h2 className="detail-section-title">Ingredients</h2>
              <ul className="ingredients-list">
                {ingredients.map(ingredient => (
                  <li key={ingredient.name} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-amount">
                      {ingredient.measure || ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="detail-section-title">Instructions</h2>
              <div className="instructions-text">
                {instructionsParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
