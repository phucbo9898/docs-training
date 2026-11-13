import type { NavTrack } from "./navigation";

/**
 * Hàm thuần, không đọc file: dùng được cả ở Client Component (khác với
 * `navigation.ts` kéo theo loader nội dung).
 */

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
