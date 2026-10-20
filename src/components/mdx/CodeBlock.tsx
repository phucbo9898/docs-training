"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { useTranslations } from "next-intl";

type CodeBlockProps = ComponentProps<"pre"> & { "data-language"?: string };

const COPIED_MS = 2000;

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export default function CodeBlock({
  children,
  "data-language": language,
  ...rest
}: CodeBlockProps) {
  const t = useTranslations("CodeBlock");
  const preRef = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  }

  const label = language && language !== "plaintext" ? language : "";

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-bg-subtle">
      <div className="flex min-h-11 items-center justify-between border-b border-border pl-4 text-sm text-text-muted">
        <span className="font-mono uppercase">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? t("copied") : t("copy")}
          title={copied ? t("copied") : t("copy")}
          className="inline-flex size-11 items-center justify-center hover:text-text"
        >
          {copied ? (
            <svg {...iconProps}>
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg {...iconProps}>
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
        <span className="sr-only" role="status">
          {copied ? t("copied") : ""}
        </span>
      </div>
      <pre ref={preRef} {...rest}>
        {children}
      </pre>
    </div>
  );
}
