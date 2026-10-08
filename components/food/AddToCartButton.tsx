"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  foodId,
  quantity = 1,
  size = "sm",
  className,
  label = "Add to Cart",
}: {
  foodId: string;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const { foods, addToCart } = useStore();
  const food = foods.find((item) => item.id === foodId);
  const [added, setAdded] = useState(false);

  if (!food) return null;

  const disabled = !food.available;

  return (
    <Button
      size={size}
      className={className}
      disabled={disabled}
      onClick={() => {
        addToCart(foodId, quantity);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {disabled ? (
        "Sold out"
      ) : added ? (
        "Added"
      ) : (
        <>
          <Plus className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
