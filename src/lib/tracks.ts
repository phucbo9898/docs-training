/** Nhóm nội dung lớn nhất của site; mỗi module thuộc đúng một track. */
export type TrackId = "backend" | "aws";

export type Track = {
  id: TrackId;
  /** Trang chủ của track, không kèm locale. */
  home: string;
};

/** Thứ tự ở đây là thứ tự hiển thị trên màn chọn track. */
export const TRACKS: readonly Track[] = [
  { id: "backend", home: "/training" },
  { id: "aws", home: "/aws-saa-c03" },
];

export const DEFAULT_TRACK: TrackId = "backend";

/** Segment đã dùng cho route tĩnh, không được đặt làm tên module. */
export const RESERVED_SLUGS: readonly string[] = ["training"];

export function isTrackId(value: unknown): value is TrackId {
  return TRACKS.some((track) => track.id === value);
}

export function trackRank(id: TrackId): number {
  return TRACKS.findIndex((track) => track.id === id);
}
