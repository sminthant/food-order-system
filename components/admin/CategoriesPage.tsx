"use client";

import { Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryForm, type CategoryDraft } from "@/components/admin/CategoryForm";
import { CategoryGlyph } from "@/components/food/CategoryGlyph";
import { FoodImage } from "@/components/food/FoodImage";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import type { Category } from "@/types";

export function CategoriesPage() {
  const { categories, foods, hydrated, saveCategory, deleteCategory } = useStore();
  const [editing, setEditing] = useState<Category | null | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [message, setMessage] = useState("");

  if (!hydrated) return <PageSkeleton />;

  async function save(draft: CategoryDraft) {
    const base = draft.id || "category";
    let id = editing ? editing.id : base;
    if (!editing) {
      let suffix = 2;
      while (categories.some((category) => category.id === id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
    }
    const saved = await saveCategory({
      id,
      name: draft.name,
      slug: id,
      description: draft.description,
      icon: draft.icon,
      image: draft.image,
    });
    if (!saved) return;
    setEditing(undefined);
    setMessage("");
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Categories"
        description="Organize the menu. A category can be deleted only when no foods use it."
        action={<Button onClick={() => setEditing(null)}>Add category</Button>}
      />
      {message ? (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      ) : null}
      {categories.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="h-5 w-5" />}
          title="No categories yet."
          description="Add a category before organizing the menu."
        />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const count = foods.filter((food) => food.categoryId === category.id).length;
          return (
            <article key={category.id} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative h-32 bg-stone-100">
                <FoodImage src={category.image} alt="" sizes="320px" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
                    <CategoryGlyph icon={category.icon} className="h-4 w-4" />
                  </span>
                  <h2 className="font-semibold text-ink">{category.name}</h2>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{category.description}</p>
                <p className="mt-3 text-sm font-medium text-ink">
                  {count} {count === 1 ? "food" : "foods"}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setEditing(category)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setPendingDelete(category)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      )}

      <Modal
        open={editing !== undefined}
        title={editing ? "Edit category" : "Add category"}
        onClose={() => setEditing(undefined)}
      >
        <CategoryForm
          initial={editing}
          onCancel={() => setEditing(undefined)}
          onSubmit={save}
        />
      </Modal>

      <Modal open={Boolean(pendingDelete)} title="Delete category" onClose={() => setPendingDelete(null)}>
        <p className="text-sm leading-6 text-muted">
          Delete {pendingDelete?.name}? Foods in this category need to be moved first.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!pendingDelete) return;
              const category = pendingDelete;
              void deleteCategory(category.id).then((result) => {
                setMessage(result ?? "");
                setPendingDelete(null);
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
