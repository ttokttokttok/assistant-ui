import { getCatalog } from "./index";

export type ExampleCardItem = {
  id: string;
  title: string;
  description?: string | undefined;
  image?: string | undefined;
  gradient?: string | undefined;
  link: string;
  external?: boolean | undefined;
  searchText?: string | undefined;
  githubLink?: string | undefined;
};

function sourceUrl(sourcePath: string | undefined) {
  if (!sourcePath) return undefined;
  if (/^https?:\/\//i.test(sourcePath)) return sourcePath;
  const kind = /\.[a-z0-9]+$/i.test(sourcePath) ? "blob" : "tree";
  return `https://github.com/assistant-ui/assistant-ui/${kind}/main/${sourcePath}`;
}

export function getExamplesPageItems(): ExampleCardItem[] {
  const items = getCatalog().items;
  const byOrder = (a: (typeof items)[number], b: (typeof items)[number]) =>
    (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);

  return [
    ...items.filter((item) => item.kind === "example").sort(byOrder),
    ...items.filter((item) => item.kind === "template").sort(byOrder),
  ].map((item) => {
    const title = item.examplesCard?.title ?? item.title;
    const description = item.examplesCard?.description ?? item.description;
    const image = item.examplesCard?.image ?? item.image;

    return {
      id: item.id,
      title,
      description,
      ...(image ? { image } : {}),
      gradient: item.gradient,
      link: item.url,
      ...(sourceUrl(item.sourcePath)
        ? { githubLink: sourceUrl(item.sourcePath) }
        : {}),
      searchText: [title, description, item.category.name, ...item.tags]
        .join(" ")
        .toLocaleLowerCase(),
    };
  });
}

export function getExamplesPageItemByUrl(url: string) {
  return getExamplesPageItems().find((item) => item.link === url);
}

export function getExamplesPageNeighbors(url: string) {
  const items = getExamplesPageItems();
  const index = items.findIndex((item) => item.link === url);
  if (index < 0) return {};
  const previous = items[index - 1];
  const next = items[index + 1];
  return {
    ...(previous ? { previous } : {}),
    ...(next ? { next } : {}),
  };
}

export function matchesExamplesQuery(item: ExampleCardItem, query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  return (
    normalized.length === 0 || item.searchText?.includes(normalized) === true
  );
}

export function getExamplePreview(slug: string) {
  const item = getCatalog().items.find(
    (candidate) => candidate.kind === "example" && candidate.id === slug,
  );
  if (!item?.image || !item.examplesCard) return null;

  return {
    slug,
    title: item.examplesCard.title,
    description: item.examplesCard.description ?? item.description,
    screenshotUrl: item.image,
  };
}
