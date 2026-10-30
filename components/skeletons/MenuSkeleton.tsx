import { Skeleton } from "@/components/ui/Skeleton";

export function MenuSkeleton({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-5 pt-3">
      <span className="sr-only">{label}</span>

      <Skeleton className="h-[184px] w-full rounded-[28px]" />

      <div className="flex items-end justify-between px-1">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-6 w-36 rounded-lg" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-stretch gap-3 rounded-[22px] border border-line bg-panel p-3 shadow-card"
          >
            <Skeleton className="h-[72px] w-[72px] shrink-0 rounded-[15px]" />
            <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-3.5 w-14" />
                <Skeleton className="h-2 w-16" />
              </div>
              <div className="space-y-2 pb-0.5">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-4/5" />
              </div>
            </div>
            <div className="flex w-[84px] flex-col items-end justify-between py-1">
              <Skeleton className="h-3 w-9" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
