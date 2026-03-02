function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-10 w-64 rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
      </div>
    </div>
  );
}