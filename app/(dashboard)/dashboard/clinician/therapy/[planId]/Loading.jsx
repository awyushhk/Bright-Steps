function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-40 rounded-3xl" />
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );
}