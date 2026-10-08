import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">404</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">This page is not on the menu.</h1>
      <p className="mt-3 max-w-md text-muted">The link may be outdated, or the dish may have been removed.</p>
      <ButtonLink href="/" className="mt-6">
        Back home
      </ButtonLink>
    </div>
  );
}
