import { requireExamUser } from "@/lib/auth/session";
import { getExamIndex } from "@/lib/exams/load";
import ExamSetupForm from "./ExamSetupForm";
import ExamsAccountBar from "./ExamsAccountBar";

type ExamsHomePanelProps = {
  locale: string;
};

/** Phần động của trang chọn đề: kiểm tra phiên rồi mới đọc dữ liệu. */
export default async function ExamsHomePanel({ locale }: ExamsHomePanelProps) {
  const user = await requireExamUser(locale, `/${locale}/aws-exams`);
  const index = await getExamIndex();

  return (
    <>
      <ExamsAccountBar user={user} locale={locale} />
      <div className="mx-auto w-full max-w-4xl px-4 pb-8 md:px-8 md:pb-12">
        <ExamSetupForm sources={index.sources} />
      </div>
    </>
  );
}
