"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/mdx";

type TocProps = {
  title: string;
  headings: Heading[];
};

export default function Toc({ title, headings }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    // Heading nằm trong dải đầu màn hình (dưới header) được coi là đang đọc.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto lg:block"
    >
      <p className="mb-2 text-sm font-semibold text-text">{title}</p>
      <ul className="border-l border-border text-sm">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px flex min-h-11 items-center border-l-2 py-1 leading-snug ${
                  heading.depth === 3 ? "pl-6" : "pl-3"
                } ${
                  active
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
