import React from "react";
import { Skeleton } from "../../_components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors pb-20 select-none">
      
      {/* Header skeleton */}
      <div className="border-b-3 border-black dark:border-cream bg-cream py-10 lg:py-16 transition-colors">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32 mb-6" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="flex items-center gap-4 pt-6 border-t-2 border-dashed border-black/25 dark:border-cream/25">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1.5" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Columns skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main skeleton (8cols) */}
          <div className="lg:col-span-8">
            <Skeleton className="h-[250px] sm:h-[400px] border-2 border-black rounded-md mb-10" />
            
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <Skeleton className="h-32 border-2 border-black rounded-md" />
              <Skeleton className="h-32 border-2 border-black rounded-md" />
            </div>
          </div>

          {/* Sidebar skeleton (4cols) */}
          <div className="lg:col-span-4 lg:border-l-3 lg:border-dashed lg:border-black/20 lg:pl-10 dark:lg:border-cream/20">
            <div className="flex flex-col gap-8">
              <Skeleton className="h-48 border-2 border-black rounded-md" />
              <Skeleton className="h-36 border-2 border-black rounded-md" />
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
