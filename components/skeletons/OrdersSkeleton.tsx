import { Skeleton } from "@/components/ui/Skeleton";

export function OrdersSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-5 pt-3 pb-32">
      <span className="sr-only">{label}</span>

      <div className="flex items-start justify-between gap-3 px-1">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-2 w-52" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[24px] border border-line bg-panel p-4 shadow-card"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2 w-36" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="my-4 h-px bg-line" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((__, row) => (
              <div key={row} className="flex items-center justify-between gap-4">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-line pt-3">
            <Skeleton className="h-2 w-10" />
            <Skeleton className="mt-2 h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
