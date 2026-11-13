import type { Locale } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  getAllLessons,
  isIndexSlug,
  type LessonMeta,
  type LessonType,
} from "./content";
import { TRACKS, type TrackId } from "./tracks";

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

export type NavTrack = {
  id: TrackId;
  /** Trang chủ của track, không kèm locale. */
  home: string;
  phases: NavPhase[];
};

export type NavLink = { href: string; title: string };

type PhaseCopy = { label: string; title: string };

function toItem(lesson: LessonMeta): NavItem {
  return {
    href: lesson.href,
    title: lesson.title,
    type: lesson.type,
    summary: lesson.summary,
  };
}

/** Cây phase → module → bài của một track; `lessons` đã sắp theo phase → module → order. */
function buildPhases(
  lessons: LessonMeta[],
  phaseCopy: readonly PhaseCopy[],
): NavPhase[] {
  const phases = new Map<number, NavPhase>();
  const modules = new Map<string, NavModule>();

  for (const lesson of lessons) {
    let phase = phases.get(lesson.phase);
    if (!phase) {
      const copy = phaseCopy[lesson.phase - 1];
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

/** Cây track → phase → module → bài, sinh từ `content/<locale>`. Track chưa có nội dung bị bỏ. */
export async function getNavTree(locale: Locale): Promise<NavTrack[]> {
  const [lessons, messages] = await Promise.all([
    getAllLessons(locale),
    getMessages({ locale }),
  ]);
  const phaseCopy: Record<TrackId, readonly PhaseCopy[]> = {
    backend: messages.Home.roadmap.phases,
    aws: messages.Tracks.aws.phases,
  };

  return TRACKS.map((track) => ({
    id: track.id,
    home: track.home,
    phases: buildPhases(
      lessons.filter((lesson) => lesson.track === track.id),
      phaseCopy[track.id],
    ),
  })).filter((track) => track.phases.length > 0);
}

export function getTrack(
  tracks: NavTrack[],
  id: TrackId,
): NavTrack | undefined {
  return tracks.find((track) => track.id === id);
}

/** Track chứa module có slug `module`. */
export function findTrackByModule(
  tracks: NavTrack[],
  module: string,
): NavTrack | undefined {
  return tracks.find((track) =>
    track.phases.some((phase) =>
      phase.modules.some((navModule) => navModule.slug === module),
    ),
  );
}

/** Track ứng với pathname (không kèm locale); `undefined` ở màn chọn track. */
export function findTrackByPath(
  tracks: NavTrack[],
  pathname: string,
): NavTrack | undefined {
  const segment = pathname.split("/")[1] ?? "";
  if (!segment) return undefined;
  return (
    tracks.find((track) => track.home === `/${segment}`) ??
    findTrackByModule(tracks, segment)
  );
}

export function countPages(track: NavTrack): {
  modules: number;
  pages: number;
} {
  const modules = track.phases.flatMap((phase) => phase.modules);
  return {
    modules: modules.length,
    pages: modules.reduce(
      (sum, navModule) => sum + 1 + navModule.items.length,
      0,
    ),
  };
}

/** Toàn bộ trang của track theo thứ tự đọc: tổng quan module, rồi các bài của module đó. */
export function flattenNav(track: NavTrack): NavLink[] {
  return track.phases.flatMap((phase) =>
    phase.modules.flatMap((navModule) => [
      { href: navModule.href, title: navModule.title },
      ...navModule.items.map(({ href, title }) => ({ href, title })),
    ]),
  );
}

export function findNeighbors(
  track: NavTrack,
  href: string,
): { prev: NavLink | null; next: NavLink | null } {
  const links = flattenNav(track);
  const index = links.findIndex((link) => link.href === href);
  if (index === -1) return { prev: null, next: null };
  return { prev: links[index - 1] ?? null, next: links[index + 1] ?? null };
}
