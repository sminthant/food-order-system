import { Container } from "@/components/layout/Container";

export function PageSkeleton() {
  return (
    <Container className="py-12">
      <div className="h-8 w-48 animate-pulse rounded-full bg-stone-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    </Container>
  );
}
