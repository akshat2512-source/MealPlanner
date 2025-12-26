import React from 'react';
import ShoppingList from '../components/shopping/ShoppingList.jsx';
import PageBanner from '../components/layout/PageBanner.jsx';
import shoppingBanner from '../assets/images/shopping-banner.jpg';

function Shopping() {
  return (
    <div className="page">
      <PageBanner
        eyebrow="Grocery game plan"
        title="Shopping list"
        subtitle="Turn your meal plan into one tidy list you can take to the store."
        image={shoppingBanner}
      />
      <ShoppingList />
    </div>
  );
}

export default Shopping;
