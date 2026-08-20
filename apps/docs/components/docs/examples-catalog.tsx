"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import type { ExampleCardItem } from "@/lib/catalog/examples";
import { matchesExamplesQuery } from "@/lib/catalog/examples";
import { ExampleCard } from "./example-card";

export function ExamplesCatalog({ items }: { items: ExampleCardItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => items.filter((item) => matchesExamplesQuery(item, query)),
    [items, query],
  );

  return (
    <section className="not-prose" aria-labelledby="examples-catalog-heading">
      <h2 id="examples-catalog-heading" className="sr-only">
        Examples and templates
      </h2>
      <label className="relative mb-8 block max-w-xl">
        <span className="sr-only">Search examples and templates</span>
        <SearchIcon
          aria-hidden="true"
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search examples and templates…"
          className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full rounded-md border py-2 pr-3 pl-10 text-sm outline-none focus-visible:ring-2"
        />
      </label>

      {filtered.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <ExampleCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <p
          role="status"
          className="text-muted-foreground py-12 text-center text-sm"
        >
          No examples or templates match “{query.trim()}”.
        </p>
      )}
    </section>
  );
}
