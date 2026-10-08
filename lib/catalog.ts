import type { Category, Food } from "@/types";

export type FoodSort = "rating" | "price-asc" | "price-desc" | "name";

export function categoryById(categories: Category[], id: string) {
  return categories.find((category) => category.id === id);
}

export function categoryName(categories: Category[], id: string) {
  return categoryById(categories, id)?.name ?? "Menu";
}

export function filterFoods(
  foods: Food[],
  categories: Category[],
  options: { search: string; categoryId: string; sort: FoodSort },
) {
  const query = options.search.trim().toLowerCase();

  const filtered = foods.filter((food) => {
    const category = categoryName(categories, food.categoryId);
    const matchesCategory =
      options.categoryId === "all" || food.categoryId === options.categoryId;
    const haystack = `${food.name} ${food.description} ${category}`.toLowerCase();
    const matchesSearch = query.length === 0 || haystack.includes(query);
    return matchesCategory && matchesSearch;
  });

  return filtered.sort((a, b) => {
    if (options.sort === "price-asc") return a.price - b.price;
    if (options.sort === "price-desc") return b.price - a.price;
    if (options.sort === "name") return a.name.localeCompare(b.name);
    return b.rating - a.rating || a.name.localeCompare(b.name);
  });
}

export function relatedFoods(foods: Food[], food: Food, limit = 4) {
  const sameCategory = foods.filter(
    (item) => item.id !== food.id && item.categoryId === food.categoryId,
  );
  const others = foods.filter(
    (item) => item.id !== food.id && item.categoryId !== food.categoryId,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
