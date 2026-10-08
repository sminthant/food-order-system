"use client";

import { useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { FoodForm } from "@/components/admin/FoodForm";
import { FoodTable } from "@/components/admin/FoodTable";
import { SearchBar } from "@/components/food/SearchBar";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/Modal";
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
      <FoodTable
        foods={rows}
        categories={categories}
        onEdit={setEditing}
        onDelete={setPendingDelete}
      />

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
            void saveFood(food).then((saved) => {
              if (saved) setEditing(undefined);
            });
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
              if (!pendingDelete) return;
              const food = pendingDelete;
              void deleteFood(food.id).then((deleted) => {
                if (deleted) setPendingDelete(null);
              });
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
