import { Container } from "@/components/layout/Container";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-line bg-white">
      <Container className="py-10 sm:py-14">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </header>
  );
}
