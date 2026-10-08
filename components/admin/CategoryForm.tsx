"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/field";
import { galleryImages } from "@/data/site";
import type { Category, CategoryIcon } from "@/types";

const icons: CategoryIcon[] = ["beef", "pizza", "drumstick", "soup", "cup-soda", "cake", "utensils"];

export type CategoryDraft = {
  id: string;
  name: string;
  description: string;
  icon: CategoryIcon;
  image: string;
};

export function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Category | null;
  onSubmit: (value: CategoryDraft) => void;
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
      <Field label="Category name" htmlFor="category-name" error={error}>
        <TextInput
          id="category-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
        />
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
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initial ? "Save category" : "Add category"}</Button>
      </div>
    </form>
  );
}
