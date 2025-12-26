export function parseIngredientsFromMeal(meal) {
  const ingredients = [];
  if (!meal) {
    return ingredients;
  }
  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`];
    const measure = meal[`strMeasure${index}`];
    if (name && String(name).trim()) {
      ingredients.push({
        name: String(name).trim(),
        measure: measure ? String(measure).trim() : '',
      });
    }
  }
  return ingredients;
}

function normalizeIngredientName(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumberToken(token) {
  if (!token) {
    return null;
  }
  const trimmed = token.trim();
  if (/^\d+\/\d+$/.test(trimmed)) {
    const [top, bottom] = trimmed.split('/');
    const numerator = Number(top);
    const denominator = Number(bottom);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
      return null;
    }
    return numerator / denominator;
  }
  const asNumber = Number(trimmed.replace(',', '.'));
  return Number.isFinite(asNumber) ? asNumber : null;
}

function parseMeasurement(measure) {
  const trimmed = String(measure || '').trim();
  if (!trimmed) {
    return { quantity: null, unit: '' };
  }
  const tokens = trimmed.split(/\s+/);
  let index = 0;
  let quantity = 0;
  let foundNumeric = false;

  while (index < tokens.length) {
    const numeric = parseNumberToken(tokens[index]);
    if (numeric == null) {
      break;
    }
    quantity += numeric;
    foundNumeric = true;
    index += 1;
  }

  if (!foundNumeric) {
    return { quantity: null, unit: trimmed };
  }

  const unit = tokens.slice(index).join(' ').trim();
  return { quantity, unit };
}

export function aggregateIngredientsFromPlan(weeklyPlan) {
  const map = new Map();
  if (!weeklyPlan) {
    return [];
  }

  Object.values(weeklyPlan).forEach(dayMeals => {
    (dayMeals || []).forEach(meal => {
      const mealId = meal && meal.id;
      (meal.ingredients || []).forEach(ingredient => {
        const baseName = ingredient.name;
        const normalizedName = normalizeIngredientName(baseName);
        if (!normalizedName) {
          return;
        }
        const measurement = parseMeasurement(ingredient.measure || '');
        const key = `${normalizedName}__${measurement.unit || ''}`;
        const existing = map.get(key);
        if (!existing) {
          map.set(key, {
            id: key,
            name: baseName,
            quantity: measurement.quantity,
            unit: measurement.unit,
            measures: ingredient.measure ? [ingredient.measure] : [],
            _recipeIds: mealId != null ? new Set([mealId]) : new Set(),
          });
        } else {
          if (measurement.quantity != null && existing.quantity != null) {
            existing.quantity += measurement.quantity;
          }
          if (ingredient.measure && !existing.measures.includes(ingredient.measure)) {
            existing.measures.push(ingredient.measure);
          }
          if (mealId != null && existing._recipeIds) {
            existing._recipeIds.add(mealId);
          }
        }
      });
    });
  });

  return Array.from(map.values()).map(item => {
    const recipeCount =
      item._recipeIds && typeof item._recipeIds.size === 'number'
        ? item._recipeIds.size
        : null;
    const { _recipeIds, ...rest } = item;
    return {
      ...rest,
      recipeCount,
    };
  });
}
