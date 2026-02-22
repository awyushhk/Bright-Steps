function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-48 w-full rounded-3xl" />
      <div className="border rounded-xl p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
    </div>
  );
}