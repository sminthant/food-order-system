"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FoodCard } from "@/components/food/FoodCard";
import { SearchBar } from "@/components/food/SearchBar";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChip } from "@/components/ui/FilterChip";
import { SelectInput } from "@/components/ui/field";
import { filterFoods, type FoodSort } from "@/lib/catalog";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const sorts: { value: FoodSort; label: string }[] = [
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

export function MenuPage() {
  const { foods, categories, hydrated } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const categoryParam = params.get("category") ?? "all";
  const categoryId =
    categories.find((category) => category.slug === categoryParam || category.id === categoryParam)
      ?.id ?? "all";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<FoodSort>("rating");

  const results = useMemo(
    () => filterFoods(foods, categories, { search, categoryId, sort }),
    [foods, categories, search, categoryId, sort],
  );

  function selectCategory(id: string) {
    const category = categories.find((item) => item.id === id);
    const query = new URLSearchParams(params.toString());
    if (!category) query.delete("category");
    else query.set("category", category.slug);
    const next = query.toString();
    router.replace(next ? `/menu?${next}` : "/menu", { scroll: false });
  }

  if (!hydrated) return <PageSkeleton />;

  return (
    <>
      <PageHeader
        eyebrow="Menu"
        title="Explore Our Menu"
        description="Search by dish, filter by category, and add anything that looks good."
      />
      <Container className="py-8 sm:py-10">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search burgers, noodles, drinks..." />
          <SelectInput
            aria-label="Sort menu"
            value={sort}
            onChange={(event) => setSort(event.target.value as FoodSort)}
          >
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="toolbar" aria-label="Filter by category">
          <FilterChip active={categoryId === "all"} onClick={() => selectCategory("all")}>
            All
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              active={categoryId === category.id}
              onClick={() => selectCategory(category.id)}
            >
              {category.name}
            </FilterChip>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted">
          {results.length} {results.length === 1 ? "dish" : "dishes"}
        </p>
        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<Search className="h-5 w-5" />}
              title="No dishes match that search."
              description="Try another name, or clear the category filter."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    selectCategory("all");
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
