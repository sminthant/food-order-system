"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { galleryImages } from "@/data/site";
import { createId } from "@/lib/cart";
import type { Category, Food } from "@/types";

type FoodErrors = Partial<Record<"name" | "description" | "price" | "category" | "image", string>>;

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
  const [errors, setErrors] = useState<FoodErrors>({});

  function clear(key: keyof FoodErrors) {
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedPrice = Number(price);
    const next: FoodErrors = {};
    if (name.trim().length < 2) next.name = "Enter a food name.";
    if (description.trim().length < 8) next.description = "Add a short description.";
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) next.price = "Enter a price greater than 0.";
    if (!categoryId) next.category = "Choose a category.";
    if (!image.trim()) next.image = "Add an image.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

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
      setErrors((current) => ({ ...current, image: "Choose an image file." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
        clear("image");
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Food name" htmlFor="food-name" error={errors.name}>
        <TextInput
          id="food-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clear("name");
          }}
        />
      </Field>
      <Field label="Description" htmlFor="food-description" error={errors.description}>
        <TextArea
          id="food-description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            clear("description");
          }}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (THB)" htmlFor="food-price" error={errors.price}>
          <TextInput
            id="food-price"
            inputMode="decimal"
            value={price}
            onChange={(event) => {
              setPrice(event.target.value);
              clear("price");
            }}
          />
        </Field>
        <Field label="Category" htmlFor="food-category" error={errors.category}>
          <SelectInput
            id="food-category"
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              clear("category");
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Field
        label="Image"
        htmlFor="food-image"
        hint="Pick a gallery photo or upload one for this preview."
        error={errors.image}
      >
        <SelectInput
          id="food-image"
          value={image.startsWith("data:") ? "" : image}
          onChange={(event) => {
            setImage(event.target.value);
            clear("image");
          }}
        >
          {image.startsWith("data:") ? <option value="">Uploaded image</option> : null}
          {galleryImages.map((src) => (
            <option key={src} value={src}>
              {src.replace("/images/", "")}
            </option>
          ))}
        </SelectInput>
      </Field>
      <label htmlFor="food-upload" className="block text-sm font-medium text-ink">
        Upload image
        <input
          id="food-upload"
          type="file"
          accept="image/*"
          className="mt-1.5 block w-full text-sm font-normal text-muted"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </label>
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
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Save changes" : "Add food"}</Button>
      </div>
    </form>
  );
}
