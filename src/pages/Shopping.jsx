import React from 'react';
import ShoppingList from '../components/shopping/ShoppingList.jsx';

function Shopping() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <div className="page-title">Shopping list</div>
            <div className="page-subtitle">
              Consolidated ingredients from your weekly plan, ready for the
              store.
            </div>
          </div>
        </div>
      </div>
      <ShoppingList />
    </div>
  );
}

export default Shopping;
