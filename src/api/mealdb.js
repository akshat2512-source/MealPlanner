const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

async function toJson(response) {
  if (!response.ok) {
    throw new Error('Request failed with status ' + response.status);
  }
  return response.json();
}

export async function searchMeals(query) {
  const trimmed = query ? query.trim() : '';
  if (!trimmed) {
    return [];
  }
  const url = `${API_BASE}/search.php?s=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);
  const data = await toJson(response);
  return data.meals || [];
}

export async function lookupMealById(id) {
  const url = `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`;
  const response = await fetch(url);
  const data = await toJson(response);
  return data.meals && data.meals.length > 0 ? data.meals[0] : null;
}

export default {
  searchMeals,
  lookupMealById,
};
