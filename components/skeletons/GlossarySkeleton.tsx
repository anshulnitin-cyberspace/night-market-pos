import { Skeleton } from "@/components/ui/Skeleton";

export function GlossarySkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-5 pt-3 pb-32">
      <span className="sr-only">{label}</span>

      <div className="space-y-2 px-1">
        <Skeleton className="h-2.5 w-32" />
        <Skeleton className="h-7 w-52 rounded-lg" />
        <Skeleton className="h-2.5 w-40" />
      </div>

      {Array.from({ length: 3 }).map((_, section) => (
        <div
          key={section}
          className="overflow-hidden rounded-[24px] border border-line bg-panel shadow-card"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <div className="divide-y divide-line px-4">
            {Array.from({ length: 4 }).map((__, row) => (
              <div key={row} className="flex items-start justify-between gap-6 py-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
                <Skeleton className="mt-1 h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
