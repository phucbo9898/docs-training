import type { Locale } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  getAllLessons,
  isIndexSlug,
  type LessonMeta,
  type LessonType,
} from "./content";

export type NavItem = {
  href: string;
  title: string;
  type: LessonType;
  summary: string;
};

export type NavModule = {
  slug: string;
  title: string;
  href: string;
  summary: string;
  /** Bài học và bài tập của module, không gồm trang tổng quan. */
  items: NavItem[];
};

export type NavPhase = {
  phase: number;
  /** Ví dụ "Phase 1". */
  label: string;
  /** Ví dụ "Nền tảng". */
  title: string;
  modules: NavModule[];
};

export type NavLink = { href: string; title: string };

function toItem(lesson: LessonMeta): NavItem {
  return {
    href: lesson.href,
    title: lesson.title,
    type: lesson.type,
    summary: lesson.summary,
  };
}

/** Cây phase → module → bài, sinh từ `content/<locale>`. */
export async function getNavTree(locale: Locale): Promise<NavPhase[]> {
  const [lessons, messages] = await Promise.all([
    getAllLessons(locale),
    getMessages({ locale }),
  ]);
  const phaseMessages = messages.Home.roadmap.phases;

  const phases = new Map<number, NavPhase>();
  const modules = new Map<string, NavModule>();

  // `lessons` đã sắp theo phase → module → order nên chỉ cần gom theo thứ tự gặp.
  for (const lesson of lessons) {
    let phase = phases.get(lesson.phase);
    if (!phase) {
      const copy = phaseMessages[lesson.phase - 1];
      phase = {
        phase: lesson.phase,
        label: copy?.label ?? `Phase ${lesson.phase}`,
        title: copy?.title ?? "",
        modules: [],
      };
      phases.set(lesson.phase, phase);
    }

    let navModule = modules.get(lesson.module);
    if (!navModule) {
      navModule = {
        slug: lesson.module,
        title: lesson.module,
        href: `/${lesson.module}`,
        summary: "",
        items: [],
      };
      modules.set(lesson.module, navModule);
      phase.modules.push(navModule);
    }

    if (isIndexSlug(lesson.slug)) {
      navModule.title = lesson.title;
      navModule.summary = lesson.summary;
    } else {
      navModule.items.push(toItem(lesson));
    }
  }

  return [...phases.values()];
}

/** Toàn bộ trang theo thứ tự đọc: tổng quan module, rồi các bài của module đó. */
export function flattenNav(tree: NavPhase[]): NavLink[] {
  return tree.flatMap((phase) =>
    phase.modules.flatMap((navModule) => [
      { href: navModule.href, title: navModule.title },
      ...navModule.items.map(({ href, title }) => ({ href, title })),
    ]),
  );
}

export function findNeighbors(
  tree: NavPhase[],
  href: string,
): { prev: NavLink | null; next: NavLink | null } {
  const links = flattenNav(tree);
  const index = links.findIndex((link) => link.href === href);
  if (index === -1) return { prev: null, next: null };
  return { prev: links[index - 1] ?? null, next: links[index + 1] ?? null };
}
