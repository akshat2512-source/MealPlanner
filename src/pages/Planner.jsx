import React from 'react';
import WeeklyPlanner from '../components/planner/WeeklyPlanner.jsx';
import PageBanner from '../components/layout/PageBanner.jsx';
import plannerBanner from '../assets/images/planner-banner.jpg';

function Planner() {
  return (
    <div className="page">
      <PageBanner
        eyebrow="Plan the week"
        title="See your week of meals in one place"
        subtitle="Spread recipes across the week, stay flexible, and make dinner decisions easy."
        image={plannerBanner}
      />
      <WeeklyPlanner />
    </div>
  );
}

export default Planner;
