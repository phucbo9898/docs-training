import { Suspense } from "react";
import ExamLoading from "./ExamLoading";
import ExamPagePanel from "./ExamPagePanel";

type ExamPageContentProps = {
  params: PageProps<"/[locale]/aws-exams/[source]/[exam]">["params"];
  searchParams: PageProps<"/[locale]/aws-exams/[source]/[exam]">["searchParams"];
};

/**
 * Trang một đề render động: khung tĩnh chỉ có layout và dòng "đang tải", mọi
 * thứ phụ thuộc đề nằm sau Suspense và sau kiểm tra phiên.
 */
export default function ExamPageContent({
  params,
  searchParams,
}: ExamPageContentProps) {
  return (
    <Suspense fallback={<ExamLoading />}>
      <ExamPagePanel params={params} searchParams={searchParams} />
    </Suspense>
  );
}
