import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton animate-pulse bg-bg-tertiary rounded-lg", className)}
      {...props}
    />
  );
}

// Pre-built skeleton components
export function SkeletonCard() {
  return (
    <div className="bg-bg-secondary rounded-2xl border border-border-default p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function SkeletonAssetRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border-default last:border-0">
      <Skeleton className="w-6 h-6" />
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-8 w-12 rounded-lg" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-bg-secondary rounded-2xl border border-border-default p-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-12 rounded-lg" />
          <Skeleton className="h-8 w-12 rounded-lg" />
          <Skeleton className="h-8 w-12 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
