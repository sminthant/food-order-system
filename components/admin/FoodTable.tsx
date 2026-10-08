"use client";

import { Pencil, Trash2 } from "lucide-react";
import { DataTable, DataTableMessage } from "@/components/admin/DataTable";
import { FoodImage } from "@/components/food/FoodImage";
import { Button } from "@/components/ui/button";
import { categoryName } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { Category, Food } from "@/types";

const columns = ["Food", "Category", "Price", "Rating", "Availability", "Actions"];

export function FoodTable({
  foods,
  categories,
  onEdit,
  onDelete,
}: {
  foods: Food[];
  categories: Category[];
  onEdit: (food: Food) => void;
  onDelete: (food: Food) => void;
}) {
  return (
    <DataTable caption="Foods" minWidth="860px" columns={columns}>
      {foods.length === 0 ? (
        <DataTableMessage colSpan={columns.length}>No foods match this filter.</DataTableMessage>
      ) : (
        foods.map((food) => (
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
                <Button size="sm" variant="ghost" onClick={() => onEdit(food)} aria-label={`Edit ${food.name}`}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(food)}
                  aria-label={`Delete ${food.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))
      )}
    </DataTable>
  );
}
