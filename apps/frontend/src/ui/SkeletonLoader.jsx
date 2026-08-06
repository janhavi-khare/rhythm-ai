export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#06030B] bg-mesh-atmosphere text-slate-100 p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 skeleton-box"></div>
          <div className="h-4 w-40 skeleton-box"></div>
        </div>
        <div className="h-10 w-32 skeleton-box rounded-full"></div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="h-64 w-full soft-surface-hero p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-4 w-32 skeleton-box"></div>
            <div className="h-10 w-72 skeleton-box"></div>
          </div>
          <div className="h-12 w-24 skeleton-box rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/[0.04]">
          <div className="h-14 skeleton-box rounded-2xl"></div>
          <div className="h-14 skeleton-box rounded-2xl"></div>
          <div className="h-14 skeleton-box rounded-2xl"></div>
          <div className="h-14 skeleton-box rounded-2xl"></div>
        </div>
      </div>

      {/* 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 soft-surface p-6 space-y-4">
          <div className="h-6 w-40 skeleton-box"></div>
          <div className="h-20 w-full skeleton-box rounded-2xl"></div>
        </div>
        <div className="h-48 soft-surface p-6 space-y-4">
          <div className="h-6 w-40 skeleton-box"></div>
          <div className="h-20 w-full skeleton-box rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
