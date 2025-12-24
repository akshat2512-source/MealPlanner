import React from 'react';
import { useMealPlan } from '../../context/MealPlanContext.jsx';

function ShoppingList() {
  const {
    shoppingList,
    regenerateShoppingList,
    toggleShoppingItem,
    clearShoppingList,
    weeklyPlan,
  } = useMealPlan();

  const hasPlan = Object.values(weeklyPlan || {}).some(
    dayMeals => (dayMeals || []).length > 0
  );

  const hasItems = shoppingList && shoppingList.length > 0;

  return (
    <div className="surface-card">
      <div className="surface-inner">
        <div className="surface-header">
          <div>
            <div className="surface-title">Shopping list</div>
            <div className="surface-subtitle">
              Generate a consolidated list from your current weekly plan and
              tick items off while you shop.
            </div>
          </div>
          <div className="shopping-controls">
            <button
              type="button"
              className="button button-sm button-primary"
              onClick={regenerateShoppingList}
              disabled={!hasPlan}
            >
              Generate from plan
            </button>
            {hasItems && (
              <button
                type="button"
                className="button button-sm button-danger"
                onClick={clearShoppingList}
              >
                Clear list
              </button>
            )}
          </div>
        </div>

        {!hasItems && (
          <div className="empty-root">
            <div className="empty-message">
              No shopping items yet. Build your weekly plan and generate a
              shopping list when you are ready.
            </div>
          </div>
        )}

        {hasItems && (
          <ul className="shopping-list" aria-label="Shopping items">
            {shoppingList.map(item => {
              const quantityLabel =
                item.quantity != null
                  ? `${Number(item.quantity.toFixed(2))} ${
                      item.unit || ''
                    }`.trim()
                  : item.measures && item.measures.length > 0
                  ? item.measures.join(' + ')
                  : '';
              return (
                <li
                  key={item.id}
                  className={
                    item.purchased ? 'shopping-item purchased' : 'shopping-item'
                  }
                >
                  <input
                    type="checkbox"
                    className="shopping-checkbox"
                    checked={Boolean(item.purchased)}
                    onChange={() => toggleShoppingItem(item.id)}
                    aria-label={`Mark ${item.name} as purchased`}
                  />
                  <div className="shopping-item-label">
                    <span className="shopping-item-name">{item.name}</span>
                    {quantityLabel && (
                      <span className="shopping-item-meta">
                        {quantityLabel}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShoppingList;
