import Link from "next/link";
import { DownloadIcon, MessageSquareIcon } from "lucide-react";
import type { CatalogItem } from "@/lib/catalog/schema";
import { getCatalogDetailActions } from "@/lib/catalog/detail-actions";
import { Button } from "@/components/ui/button";

export function CatalogDetailActions({ item }: { item: CatalogItem }) {
  const actions = getCatalogDetailActions(item);
  if (!actions.openInChatUrl && !actions.downloadUrl) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.openInChatUrl && (
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href={actions.openInChatUrl} />}
        >
          <MessageSquareIcon className="size-3.5" />
          Open in playground
        </Button>
      )}
      {actions.downloadUrl && (
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<a href={actions.downloadUrl} download />}
        >
          <DownloadIcon className="size-3.5" />
          Download code
        </Button>
      )}
    </div>
  );
}
