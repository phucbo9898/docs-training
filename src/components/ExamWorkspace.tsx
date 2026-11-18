"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { questionStatus } from "@/lib/exams/score";
import {
  clearProgress,
  loadProgress,
  newProgress,
  progressKey,
  saveProgress,
  type ExamProgress,
} from "@/lib/exams/session";
import type { Exam, ExamMode, ExamQuestion } from "@/lib/exams/types";
import ExamDialog from "./ExamDialog";
import ExamQuestionList from "./ExamQuestionList";
import ExamQuestionView from "./ExamQuestionView";
import ExamResult from "./ExamResult";
import ExamReview from "./ExamReview";
import type { ExamItemStatus } from "./ExamStatusIcon";
import ExamTimer from "./ExamTimer";
import ExamToolbar from "./ExamToolbar";

type ExamWorkspaceProps = {
  exam: Exam;
  mode: ExamMode;
};

type Phase = "doing" | "result" | "review";

/** Đã nộp: giữ lại bài làm để chấm và chữa. */
type Finished = ExamProgress & { finishedAt: number };

const MINUTE_MS = 60_000;

/** Ô nhập chữ: phím tắt không được chiếm phím của người đang gõ. */
function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  if (target instanceof HTMLInputElement) {
    return !["radio", "checkbox", "button", "submit", "reset"].includes(
      target.type,
    );
  }
  return false;
}

function isRevealed(
  mode: ExamMode,
  question: ExamQuestion,
  selected: readonly string[] | undefined,
): boolean {
  return (
    mode === "practice" && (selected?.length ?? 0) >= question.correct.length
  );
}

const buttonPrimary =
  "inline-flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90";
const buttonSecondary =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-text hover:bg-bg-subtle";

export default function ExamWorkspace({ exam, mode }: ExamWorkspaceProps) {
  const t = useTranslations("Exams");
  const key = progressKey(exam.source, exam.number, mode);
  const total = exam.questions.length;

  const [progress, setProgress] = useState<ExamProgress>(
    () => loadProgress(key) ?? newProgress(),
  );
  const [phase, setPhase] = useState<Phase>("doing");
  const [finished, setFinished] = useState<Finished | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  const listTitleId = useId();
  const submitTitleId = useId();

  const current = Math.min(progress.current, total - 1);
  const question = exam.questions[current];
  const selected = question ? (progress.answers[question.id] ?? []) : [];
  const marked = useMemo(() => new Set(progress.marked), [progress.marked]);
  const answeredCount = exam.questions.filter(
    (q) => (progress.answers[q.id]?.length ?? 0) > 0,
  ).length;

  // Lưu bài làm dở sau mỗi thay đổi; đã nộp thì thôi.
  useEffect(() => {
    if (phase === "doing") saveProgress(key, progress);
  }, [key, progress, phase]);

  // Nhảy câu từ danh sách thì đưa focus về tiêu đề câu mới.
  useEffect(() => {
    if (!focusHeading.current) return;
    focusHeading.current = false;
    headingRef.current?.focus();
  }, [current]);

  const goTo = useCallback(
    (index: number, focus = false) => {
      if (index < 0 || index >= total) return;
      focusHeading.current = focus;
      setProgress((prev) => ({ ...prev, current: index }));
    },
    [total],
  );

  const toggleOption = useCallback(
    (target: ExamQuestion, optionId: string) => {
      setProgress((prev) => {
        const picked = prev.answers[target.id] ?? [];
        if (isRevealed(mode, target, picked)) return prev;
        let next: string[];
        if (target.correct.length === 1) {
          next = [optionId];
        } else if (picked.includes(optionId)) {
          next = picked.filter((id) => id !== optionId);
        } else if (picked.length >= target.correct.length) {
          return prev;
        } else {
          next = [...picked, optionId];
        }
        return { ...prev, answers: { ...prev.answers, [target.id]: next } };
      });
    },
    [mode],
  );

  const toggleMark = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      marked: prev.marked.includes(id)
        ? prev.marked.filter((item) => item !== id)
        : [...prev.marked, id],
    }));
  }, []);

  const submit = useCallback(() => {
    clearProgress(key);
    setSubmitOpen(false);
    setListOpen(false);
    setFinished({ ...progress, finishedAt: Date.now() });
    setPhase("result");
    window.scrollTo({ top: 0 });
  }, [key, progress]);

  function restart() {
    clearProgress(key);
    setProgress(newProgress());
    setFinished(null);
    setPhase("doing");
    window.scrollTo({ top: 0 });
  }

  // Phím tắt: ←/→ chuyển câu, 1–9 chọn đáp án.
  useEffect(() => {
    if (phase !== "doing") return;
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      const target = event.target;
      if (isTextEntry(target)) return;
      if (target instanceof Element && target.closest("dialog[open]")) return;
      if (!question) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        // Trong nhóm radio, mũi tên là phím chọn gốc của trình duyệt.
        if (target instanceof HTMLInputElement && target.type === "radio")
          return;
        event.preventDefault();
        goTo(current + (event.key === "ArrowLeft" ? -1 : 1));
        return;
      }
      const digit = Number(event.key);
      if (
        Number.isInteger(digit) &&
        digit >= 1 &&
        digit <= question.options.length
      ) {
        event.preventDefault();
        const option = question.options[digit - 1];
        if (option) toggleOption(question, option.id);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase, question, current, goTo, toggleOption]);

  const statusOf = useCallback(
    (q: ExamQuestion): ExamItemStatus => {
      const picked = progress.answers[q.id];
      if (!picked || picked.length === 0) return "unanswered";
      if (isRevealed(mode, q, picked)) {
        return questionStatus(q, picked) === "correct"
          ? "correct"
          : "incorrect";
      }
      return "answered";
    },
    [mode, progress.answers],
  );

  if (phase !== "doing" && finished) {
    return (
      <div className="page-fade mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        {phase === "result" ? (
          <ExamResult
            exam={exam}
            mode={mode}
            answers={finished.answers}
            startedAt={finished.startedAt}
            finishedAt={finished.finishedAt}
            onReview={() => {
              setPhase("review");
              window.scrollTo({ top: 0 });
            }}
            onRestart={restart}
          />
        ) : (
          <ExamReview
            exam={exam}
            answers={finished.answers}
            marked={finished.marked}
            onBack={() => {
              setPhase("result");
              window.scrollTo({ top: 0 });
            }}
          />
        )}
      </div>
    );
  }

  if (!question) return null;
  const unanswered = total - answeredCount;
  const revealed = isRevealed(mode, question, selected);

  const list = (
    <ExamQuestionList
      questions={exam.questions}
      current={current}
      statusOf={statusOf}
      marked={marked}
      onSelect={(index) => {
        setListOpen(false);
        goTo(index, true);
      }}
    />
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
      <header className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <div className="mr-auto min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-text">
            {exam.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold text-primary-text">
              {t(`mode.${mode}`)}
            </span>
            {exam.mock ? (
              <span className="rounded-md border border-warning px-2 py-0.5 font-semibold text-warning">
                {t("mockBadge")}
              </span>
            ) : null}
            <span className="text-text-muted">
              {t("answered", { count: answeredCount, total })}
            </span>
          </div>
        </div>
        {mode === "exam" ? (
          <ExamTimer
            deadline={progress.startedAt + exam.durationMinutes * MINUTE_MS}
            onExpire={submit}
          />
        ) : null}
        <button
          type="button"
          onClick={() => setListOpen(true)}
          className={`${buttonSecondary} lg:hidden`}
        >
          {t("questionList")}
        </button>
        <button
          type="button"
          onClick={() => (unanswered > 0 ? setSubmitOpen(true) : submit())}
          className={buttonPrimary}
        >
          {t("submit")}
        </button>
      </header>

      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <ExamToolbar
            number={current + 1}
            total={total}
            marked={marked.has(question.id)}
            onPrev={() => goTo(current - 1)}
            onNext={() => goTo(current + 1)}
            onToggleMark={() => toggleMark(question.id)}
          />
          <ExamQuestionView
            key={question.id}
            question={question}
            number={current + 1}
            selected={selected}
            onToggle={(optionId) => toggleOption(question, optionId)}
            revealed={revealed}
            showHint={mode === "practice" && !revealed}
            headingRef={headingRef}
          />
          <p className="text-sm text-text-muted">{t("shortcuts")}</p>
        </div>
        <aside aria-label={t("questionList")} className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-border p-2">
            {list}
          </div>
        </aside>
      </div>

      <ExamDialog
        open={listOpen}
        onClose={() => setListOpen(false)}
        labelledBy={listTitleId}
        variant="drawer"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-3">
            <h2 id={listTitleId} className="font-bold">
              {t("questionList")}
            </h2>
            <button
              type="button"
              onClick={() => setListOpen(false)}
              aria-label={t("close")}
              className="inline-flex size-11 items-center justify-center rounded-md hover:bg-bg-subtle"
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">{list}</div>
        </div>
      </ExamDialog>

      <ExamDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        labelledBy={submitTitleId}
      >
        <div className="space-y-4 p-6">
          <h2 id={submitTitleId} className="text-lg font-bold">
            {t("submitConfirm.title")}
          </h2>
          <p className="text-text-muted">
            {t("submitConfirm.body", { count: unanswered })}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setSubmitOpen(false)}
              className={buttonSecondary}
            >
              {t("submitConfirm.cancel")}
            </button>
            <button type="button" onClick={submit} className={buttonPrimary}>
              {t("submitConfirm.confirm")}
            </button>
          </div>
        </div>
      </ExamDialog>
    </div>
  );
}
