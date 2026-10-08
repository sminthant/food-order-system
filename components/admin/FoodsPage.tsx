"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FoodForm } from "@/components/admin/FoodForm";
import { FoodImage } from "@/components/food/FoodImage";
import { SearchBar } from "@/components/food/SearchBar";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/Modal";
import { categoryName } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Food } from "@/types";

export function FoodsPage() {
  const { foods, categories, hydrated, saveFood, deleteFood } = useStore();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [editing, setEditing] = useState<Food | null | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Food | null>(null);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return foods.filter((food) => {
      const matchesCategory = categoryId === "all" || food.categoryId === categoryId;
      const matchesSearch =
        query.length === 0 ||
        `${food.name} ${food.description}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [foods, search, categoryId]);

  if (!hydrated) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Foods"
        description="Add, edit, or remove dishes. Changes appear on the storefront immediately."
        action={<Button onClick={() => setEditing(null)}>Add Food</Button>}
      />
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <SearchBar value={search} onChange={setSearch} placeholder="Search foods" />
        <SelectInput aria-label="Filter by category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Food</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No foods match this filter.
                </td>
              </tr>
            ) : (
              rows.map((food) => (
                <tr key={food.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        <FoodImage src={food.image} alt="" sizes="48px" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{food.name}</p>
                        <p className="line-clamp-1 max-w-xs text-xs text-muted">{food.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{categoryName(categories, food.categoryId)}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(food.price)}</td>
                  <td className="px-4 py-3">{food.rating.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={food.available ? "text-emerald-700" : "text-stone-500"}>
                      {food.available ? "Available" : "Sold out"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(food)} aria-label={`Edit ${food.name}`}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setPendingDelete(food)} aria-label={`Delete ${food.name}`}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={editing !== undefined}
        title={editing ? "Edit food" : "Add food"}
        onClose={() => setEditing(undefined)}
        wide
      >
        <FoodForm
          initial={editing}
          categories={categories}
          onCancel={() => setEditing(undefined)}
          onSubmit={(food) => {
            saveFood(food);
            setEditing(undefined);
          }}
        />
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        title="Delete food"
        onClose={() => setPendingDelete(null)}
      >
        <p className="text-sm leading-6 text-muted">
          Remove {pendingDelete?.name} from the menu? This only affects the preview stored in this browser.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (pendingDelete) deleteFood(pendingDelete.id);
              setPendingDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
