export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded-xl ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-16 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-24 h-8 rounded-lg mb-2" />
      <Skeleton className="w-32 h-4 rounded-lg" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-12 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-28 h-8 rounded-lg mb-2" />
      <Skeleton className="w-24 h-4 rounded-lg" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="w-40 h-6 rounded-lg" />
        <Skeleton className="w-20 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-full h-64 rounded-xl" />
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div>
          <Skeleton className="w-32 h-4 rounded-lg mb-2" />
          <Skeleton className="w-20 h-3 rounded-lg" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-16 h-4 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonSection({ children, className = "" }) {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-apple ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <Skeleton className="w-48 h-6 rounded-lg" />
      </div>
      {children}
    </div>
  );
}

export function SkeletonInput({ label }) {
  return (
    <div className="space-y-2">
      {label && <Skeleton className="w-24 h-4 rounded-lg" />}
      <Skeleton className="w-full h-12 rounded-2xl" />
    </div>
  );
}

export function SkeletonText({ lines = 1, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 rounded-lg ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}
