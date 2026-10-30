import { cn } from "@/lib/format";

interface SkeletonProps {
  className?: string;
}

/** Shimmering placeholder used by every data-bound surface. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}
