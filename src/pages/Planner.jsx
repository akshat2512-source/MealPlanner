import React from 'react';
import WeeklyPlanner from '../components/planner/WeeklyPlanner.jsx';

function Planner() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <div className="page-title">Weekly planner</div>
            <div className="page-subtitle">
              See your meals for the whole week at a glance and keep days
              balanced.
            </div>
          </div>
        </div>
      </div>
      <WeeklyPlanner />
    </div>
  );
}

export default Planner;
