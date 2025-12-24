import React from 'react';
import { useMealPlan } from '../../context/MealPlanContext.jsx';
import { DAYS, DAY_FULL_LABELS } from '../../utils/constants.js';
import DayColumn from './DayColumn.jsx';

function WeeklyPlanner() {
  const { weeklyPlan, clearDay, clearAll } = useMealPlan();

  return (
    <div className="surface-card">
      <div className="surface-inner-tight">
        <div className="surface-header">
          <div>
            <div className="surface-title">Weekly overview</div>
            <div className="surface-subtitle">
              Assign meals across the week and keep your cooking balanced.
            </div>
          </div>
          <div className="shopping-controls">
            <button
              type="button"
              className="button button-sm button-ghost"
              onClick={clearAll}
            >
              Clear all
            </button>
          </div>
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
