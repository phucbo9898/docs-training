/**
 * Khung chờ cùng bố cục với LessonView (breadcrumb, tiêu đề, đoạn văn, cột TOC)
 * và có chiều cao tối thiểu để vùng nội dung không co lại khi đổi trang.
 */
export default function PageSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-6xl gap-10 px-4 py-6 md:px-8 md:py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem]"
    >
      <div className="w-full max-w-[75ch] min-w-0 animate-pulse space-y-4">
        <div className="h-4 w-1/3 rounded-md bg-bg-subtle" />
        <div className="h-10 w-2/3 rounded-md bg-bg-subtle" />
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full rounded-md bg-bg-subtle" />
          <div className="h-4 w-full rounded-md bg-bg-subtle" />
          <div className="h-4 w-5/6 rounded-md bg-bg-subtle" />
          <div className="h-4 w-full rounded-md bg-bg-subtle" />
          <div className="h-4 w-2/3 rounded-md bg-bg-subtle" />
        </div>
      </div>
      <div className="hidden space-y-3 lg:block">
        <div className="h-4 w-1/2 rounded-md bg-bg-subtle" />
        <div className="h-3 w-full rounded-md bg-bg-subtle" />
        <div className="h-3 w-5/6 rounded-md bg-bg-subtle" />
      </div>
    </div>
  );
}
