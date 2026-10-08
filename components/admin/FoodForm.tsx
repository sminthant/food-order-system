"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { galleryImages } from "@/data/site";
import { createId } from "@/lib/cart";
import type { Category, CategoryIcon, Food } from "@/types";

const icons: CategoryIcon[] = ["beef", "pizza", "drumstick", "soup", "cup-soda", "cake", "utensils"];

export function FoodForm({
  initial,
  categories,
  onSubmit,
  onCancel,
}: {
  initial?: Food | null;
  categories: Category[];
  onSubmit: (food: Food) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [image, setImage] = useState(initial?.image ?? galleryImages[0] ?? "");
  const [available, setAvailable] = useState(initial?.available ?? true);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedPrice = Number(price);
    if (name.trim().length < 2) {
      setError("Enter a food name.");
      return;
    }
    if (description.trim().length < 8) {
      setError("Add a short description.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a price greater than 0.");
      return;
    }
    if (!categoryId) {
      setError("Choose a category.");
      return;
    }
    if (!image.trim()) {
      setError("Add an image.");
      return;
    }

    onSubmit({
      id: initial?.id ?? createId("food"),
      name: name.trim(),
      description: description.trim(),
      price: Math.round(parsedPrice),
      categoryId,
      rating: initial?.rating ?? 5,
      reviewCount: initial?.reviewCount ?? 0,
      image,
      available,
      popular: initial?.popular ?? false,
      prepMinutes: initial?.prepMinutes ?? 15,
      highlights: initial?.highlights ?? [],
    });
  }

  function onFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Food name" htmlFor="food-name">
        <TextInput id="food-name" value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field label="Description" htmlFor="food-description">
        <TextArea
          id="food-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (THB)" htmlFor="food-price">
          <TextInput
            id="food-price"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </Field>
        <Field label="Category" htmlFor="food-category">
          <SelectInput
            id="food-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Field label="Image" htmlFor="food-image" hint="Pick a gallery photo or upload one for this preview.">
        <SelectInput id="food-image" value={image.startsWith("data:") ? "" : image} onChange={(event) => setImage(event.target.value)}>
          {image.startsWith("data:") ? <option value="">Uploaded image</option> : null}
          {galleryImages.map((src) => (
            <option key={src} value={src}>
              {src.replace("/images/", "")}
            </option>
          ))}
        </SelectInput>
        <input
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm text-muted"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </Field>
      {image ? (
        <div className="relative h-36 overflow-hidden rounded-xl bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={available}
          onChange={(event) => setAvailable(event.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        Available for order
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Save changes" : "Add food"}</Button>
      </div>
    </form>
  );
}

export function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { id: string; name: string; description: string; icon: CategoryIcon; image: string } | null;
  onSubmit: (value: { id: string; name: string; description: string; icon: CategoryIcon; image: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState<CategoryIcon>(initial?.icon ?? "utensils");
  const [image, setImage] = useState(initial?.image ?? galleryImages[0] ?? "");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter a category name.");
      return;
    }
    const slug =
      initial?.id ??
      (name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "category");
    onSubmit({
      id: initial?.id ?? slug,
      name: name.trim(),
      description: description.trim() || `${name.trim()} dishes.`,
      icon,
      image,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Category name" htmlFor="category-name">
        <TextInput id="category-name" value={name} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field label="Description" htmlFor="category-description">
        <TextArea
          id="category-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Icon" htmlFor="category-icon">
          <SelectInput
            id="category-icon"
            value={icon}
            onChange={(event) => setIcon(event.target.value as CategoryIcon)}
          >
            {icons.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Image" htmlFor="category-image">
          <SelectInput id="category-image" value={image} onChange={(event) => setImage(event.target.value)}>
            {galleryImages.map((src) => (
              <option key={src} value={src}>
                {src.replace("/images/", "")}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Save category" : "Add category"}</Button>
      </div>
    </form>
  );
}
