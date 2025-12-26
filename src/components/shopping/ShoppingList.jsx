import React, { useState } from 'react';
import { useMealPlan } from '../../context/MealPlanContext.jsx';
import EmptyState from '../common/EmptyState.jsx';

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
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopyList = async () => {
    if (!hasItems) {
      return;
    }

    const lines = shoppingList.map(item => {
      const parts = [];
      if (item.name) {
        parts.push(String(item.name));
      }

      const quantityLabel =
        item.quantity != null
          ? `${Number(item.quantity.toFixed(2))} ${item.unit || ''}`.trim()
          : item.measures && item.measures.length > 0
          ? item.measures.join(' + ')
          : '';

      const recipeCountLabel =
        item.recipeCount && item.recipeCount > 0
          ? `used in ${item.recipeCount} meal${
              item.recipeCount > 1 ? 's' : ''
            }`
          : '';

      const metaParts = [];
      if (quantityLabel) {
        metaParts.push(quantityLabel);
      }
      if (recipeCountLabel) {
        metaParts.push(recipeCountLabel);
      }
      const metaText = metaParts.join(', ');

      if (metaText) {
        parts.push(`- ${metaText}`);
      }

      return parts.length > 0 ? `• ${parts.join(' ')}` : null;
    });

    const filteredLines = lines.filter(Boolean);
    if (filteredLines.length === 0) {
      return;
    }

    const text = filteredLines.join('\n');

    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('Copied to clipboard');
        setTimeout(() => {
          setCopyStatus('');
        }, 2000);
      }
    } catch (error) {
      setCopyStatus('Unable to copy list');
      setTimeout(() => {
        setCopyStatus('');
      }, 2500);
    }
  };

  return (
    <div className="surface-card">
      <div className="surface-inner">
        <div className="surface-header">
          <div>
            <div className="surface-title">Your shopping list</div>
            <div className="surface-subtitle">
              Pull ingredients from your weekly plan into one simple list you can shop from.
            </div>
            {copyStatus && (
              <div
                className="surface-subtitle"
                aria-live="polite"
                style={{ marginTop: '0.15rem' }}
              >
                {copyStatus}
              </div>
            )}
          </div>
          <div className="shopping-controls">
            <button
              type="button"
              className="button button-sm button-primary"
              onClick={regenerateShoppingList}
              disabled={!hasPlan}
            >
              Build list from plan
            </button>
            {hasItems && (
              <button
                type="button"
                className="button button-sm button-ghost"
                onClick={handleCopyList}
              >
                Copy list
              </button>
            )}
            {hasItems && (
              <button
                type="button"
                className="button button-sm button-danger"
                onClick={clearShoppingList}
              >
                Clear this list
              </button>
            )}
          </div>
        </div>

        {!hasItems && (
          <EmptyState
            title="Your shopping list is empty"
            message="Add a few meals to your week, then generate a list when you're ready to shop."
          />
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

              const recipeCountLabel =
                item.recipeCount && item.recipeCount > 0
                  ? `Used in ${item.recipeCount} meal${
                      item.recipeCount > 1 ? 's' : ''
                    }`
                  : '';

              const metaParts = [];
              if (quantityLabel) {
                metaParts.push(quantityLabel);
              }
              if (recipeCountLabel) {
                metaParts.push(recipeCountLabel);
              }
              const metaText = metaParts.join(' • ');

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
                    {metaText && (
                      <span className="shopping-item-meta">{metaText}</span>
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
