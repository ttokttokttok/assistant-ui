import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ExampleCardItem } from "@/lib/catalog/examples";
import { cn } from "@/lib/utils";

export function ExampleCard({
  title,
  image,
  gradient,
  description,
  link,
  external = false,
}: ExampleCardItem) {
  return (
    <Link
      href={link}
      className="not-prose group border-border/60 hover:border-foreground/20 block overflow-hidden rounded-lg border transition-colors"
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <div className="overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden="true"
            className={cn(
              "aspect-video w-full bg-gradient-to-br transition-transform duration-300 group-hover:scale-[1.02]",
              gradient,
            )}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          {external && (
            <ArrowUpRight className="text-muted-foreground size-4" />
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
