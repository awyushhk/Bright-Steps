function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="border rounded-xl p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        {[1,2,3].map(i => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4 ml-6">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 flex-1 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}