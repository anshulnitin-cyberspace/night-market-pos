import { Skeleton } from "@/components/ui/Skeleton";

export function CartSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-5 pt-3 pb-40">
      <span className="sr-only">{label}</span>

      <div className="flex items-end justify-between px-1">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-14" />
      </div>

      <div className="rounded-[24px] border border-line bg-panel px-4 shadow-card">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-line py-4 last:border-0"
          >
            <Skeleton className="h-[54px] w-[54px] shrink-0 rounded-[14px]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2 w-10" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-line bg-panel p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2 w-32" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="mt-4 h-11 w-full rounded-[15px]" />
      </div>
    </div>
  );
}
