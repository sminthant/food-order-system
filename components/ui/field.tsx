import {
  cloneElement,
  isValidElement,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor && hint && !error ? `${htmlFor}-hint` : undefined;
  const describedBy = errorId ?? hintId;
  const control = isValidElement<ControlProps>(children)
    ? cloneElement(children, {
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })
    : children;

  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {control}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type ControlProps = {
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(inputClass, "h-auto min-h-24 resize-y py-2.5", className)}
      {...props}
    />
  );
}

export function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputClass, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}
