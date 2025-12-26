import React from 'react';
import { useMealPlan } from '../../context/MealPlanContext.jsx';
import { DAYS, DAY_FULL_LABELS } from '../../utils/constants.js';
import DayColumn from './DayColumn.jsx';

function WeeklyPlanner() {
  const { weeklyPlan, clearDay, clearAll } = useMealPlan();

  const allMeals = DAYS.reduce((accumulator, dayKey) => {
    const dayMeals = weeklyPlan[dayKey] || [];
    return accumulator.concat(dayMeals);
  }, []);

  const totalMeals = allMeals.length;

  const categoryCounts = {};
  allMeals.forEach(meal => {
    if (meal && meal.category) {
      const key = meal.category;
      categoryCounts[key] = (categoryCounts[key] || 0) + 1;
    }
  });

  const categorySummary = Object.entries(categoryCounts)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 3)
    .map(([name, count]) => `${name} (${count})`)
    .join(' • ');

  return (
    <div className="surface-card">
      <div className="surface-inner-tight">
        <div className="surface-header">
          <div>
            <div className="surface-title">This week at a glance</div>
            <div className="surface-subtitle">
              Drop meals onto each day and adjust the week as your plans change.
            </div>
          </div>
          <div className="shopping-controls">
            <button
              type="button"
              className="button button-sm button-ghost"
              onClick={clearAll}
            >
              Clear week
            </button>
          </div>
        </div>
        <div
          className="planner-summary"
          aria-label="This week's meal plan summary"
        >
          {totalMeals === 0 ? (
            <span className="planner-summary-text">
              Your plan is empty — open any recipe and add it to a day.
            </span>
          ) : (
            <>
              <span className="planner-summary-count">
                {totalMeals} meal{totalMeals > 1 ? 's' : ''} planned
              </span>
              {categorySummary && (
                <span className="planner-summary-breakdown">
                  {' · '}Top categories: {categorySummary}
                </span>
              )}
            </>
          )}
        </div>
        <div className="planner-grid">
          {DAYS.map(dayKey => (
            <DayColumn
              key={dayKey}
              dayKey={dayKey}
              label={DAY_FULL_LABELS[dayKey]}
              meals={weeklyPlan[dayKey] || []}
              onClearDay={() => clearDay(dayKey)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeeklyPlanner;
