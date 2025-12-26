import React, { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { DAYS, STORAGE_KEYS } from '../utils/constants.js';
import { aggregateIngredientsFromPlan } from '../utils/ingredientParser.js';

const MealPlanContext = createContext(undefined);

const initialWeeklyPlan = DAYS.reduce((accumulator, day) => {
  accumulator[day] = [];
  return accumulator;
}, {});

export function MealPlanProvider({ children }) {
  const [weeklyPlan, setWeeklyPlan] = useLocalStorage(
    STORAGE_KEYS.WEEKLY_PLAN,
    initialWeeklyPlan
  );
  const [shoppingList, setShoppingList] = useLocalStorage(
    STORAGE_KEYS.SHOPPING_LIST,
    []
  );

  const ensureStructure = useCallback(previous => {
    return { ...initialWeeklyPlan, ...(previous || {}) };
  }, []);

  const addMealToDay = useCallback(
    (dayKey, meal) => {
      if (!dayKey || !meal) {
        return;
      }
      setWeeklyPlan(previous => {
        const base = ensureStructure(previous);
        const currentDayMeals = base[dayKey] || [];
        const exists = currentDayMeals.some(entry => entry.id === meal.id);
        const updatedDayMeals = exists
          ? currentDayMeals
          : [...currentDayMeals, meal];
        return {
          ...base,
          [dayKey]: updatedDayMeals,
        };
      });
    },
    [ensureStructure, setWeeklyPlan]
  );

  const clearDay = useCallback(
    dayKey => {
      if (!dayKey) {
        return;
      }
      setWeeklyPlan(previous => {
        const base = ensureStructure(previous);
        return {
          ...base,
          [dayKey]: [],
        };
      });
    },
    [ensureStructure, setWeeklyPlan]
  );

  const clearAll = useCallback(() => {
    setWeeklyPlan({ ...initialWeeklyPlan });
  }, [setWeeklyPlan]);

  const removeMealFromDay = useCallback(
    (dayKey, mealId) => {
      if (!dayKey || !mealId) {
        return;
      }
      setWeeklyPlan(previous => {
        const base = ensureStructure(previous);
        return {
          ...base,
          [dayKey]: (base[dayKey] || []).filter(meal => meal.id !== mealId),
        };
      });
    },
    [ensureStructure, setWeeklyPlan]
  );

  const moveMeal = useCallback(
    (sourceDayKey, sourceIndex, targetDayKey, targetIndex) => {
      if (!sourceDayKey || !targetDayKey) {
        return;
      }
      setWeeklyPlan(previous => {
        const base = ensureStructure(previous);
        const sourceMeals = base[sourceDayKey] || [];
        const targetMeals = base[targetDayKey] || [];

        if (
          !Array.isArray(sourceMeals) ||
          sourceIndex == null ||
          sourceIndex < 0 ||
          sourceIndex >= sourceMeals.length
        ) {
          return base;
        }

        const nextSource = [...sourceMeals];
        const [moved] = nextSource.splice(sourceIndex, 1);

        if (!moved) {
          return base;
        }

        if (sourceDayKey === targetDayKey) {
          const nextTarget = nextSource;
          const maxIndex = nextTarget.length;
          const safeIndex =
            typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= maxIndex
              ? targetIndex
              : maxIndex;
          nextTarget.splice(safeIndex, 0, moved);
          return {
            ...base,
            [sourceDayKey]: nextTarget,
          };
        }

        const nextTarget = [...targetMeals];
        const maxIndex = nextTarget.length;
        const safeIndex =
          typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= maxIndex
            ? targetIndex
            : maxIndex;
        nextTarget.splice(safeIndex, 0, moved);

        return {
          ...base,
          [sourceDayKey]: nextSource,
          [targetDayKey]: nextTarget,
        };
      });
    },
    [ensureStructure, setWeeklyPlan]
  );

  const regenerateShoppingList = useCallback(() => {
    const baseItems = aggregateIngredientsFromPlan(ensureStructure(weeklyPlan));
    setShoppingList(previousItems => {
      const previousMap = new Map(
        previousItems.map(item => [item.id, item])
      );
      return baseItems.map(item => {
        const previous = previousMap.get(item.id);
        if (previous) {
          return {
            ...item,
            purchased: Boolean(previous.purchased),
          };
        }
        return {
          ...item,
          purchased: false,
        };
      });
    });
  }, [ensureStructure, setShoppingList, weeklyPlan]);

  const toggleShoppingItem = useCallback(
    itemId => {
      setShoppingList(previous =>
        previous.map(item =>
          item.id === itemId
            ? { ...item, purchased: !item.purchased }
            : item
        )
      );
    },
    [setShoppingList]
  );

  const clearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, [setShoppingList]);

  const value = useMemo(
    () => ({
      weeklyPlan: ensureStructure(weeklyPlan),
      shoppingList,
      addMealToDay,
      removeMealFromDay,
      moveMeal,
      clearDay,
      clearAll,
      regenerateShoppingList,
      toggleShoppingItem,
      clearShoppingList,
    }),
    [
      addMealToDay,
      clearAll,
      clearDay,
      clearShoppingList,
      ensureStructure,
      moveMeal,
      regenerateShoppingList,
      removeMealFromDay,
      shoppingList,
      toggleShoppingItem,
      weeklyPlan,
    ]
  );

  return (
    <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
