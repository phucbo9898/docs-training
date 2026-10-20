export default function PageSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-4xl animate-pulse space-y-4 px-4 py-8 md:px-8"
    >
      <div className="h-8 w-2/3 rounded-md bg-bg-subtle" />
      <div className="h-4 w-full rounded-md bg-bg-subtle" />
      <div className="h-4 w-5/6 rounded-md bg-bg-subtle" />
    </div>
  );
}
