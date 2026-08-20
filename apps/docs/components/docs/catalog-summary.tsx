import type { CatalogItem } from "@/lib/catalog/schema";

export function CatalogSummary({ item }: { item: CatalogItem }) {
  return (
    <section className="not-prose mt-8 space-y-6 border-t pt-8">
      {item.intent?.goodFor?.length ? (
        <div>
          <h2 className="font-medium">Good for</h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
            {item.intent.goodFor.map((useCase) => <li key={useCase}>{useCase}</li>)}
          </ul>
        </div>
      ) : null}
      <div>
        <h2 className="font-medium">Built with</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {item.tech.framework} · {item.tech.runtime} · {item.tech.frontendPattern}
        </p>
      </div>
    </section>
  );
}
