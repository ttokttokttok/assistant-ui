import { getCatalog } from "./index";

export type ExampleCardItem = {
  title: string;
  description?: string | undefined;
  image: string;
  link: string;
  external?: boolean | undefined;
};

export function getExamplesPageItems(): ExampleCardItem[] {
  return [...getCatalog().items]
    .sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER),
    )
    .flatMap((item) => {
      if (item.kind !== "example" || !item.examplesCard) return [];
      return [{
        title: item.examplesCard.title,
        ...(item.examplesCard.description
          ? { description: item.examplesCard.description }
          : {}),
        image: item.examplesCard.image,
        link: item.url,
      }];
    });
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
