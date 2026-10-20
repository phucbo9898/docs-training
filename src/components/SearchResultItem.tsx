import { useTranslations } from "next-intl";
import type { SearchHit } from "@/lib/search";
import HighlightedText from "./HighlightedText";

type SearchResultItemProps = {
  id: string;
  hit: SearchHit;
  tokens: string[];
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export default function SearchResultItem({
  id,
  hit,
  tokens,
  active,
  onSelect,
  onHover,
}: SearchResultItemProps) {
  const t = useTranslations("Search");
  const { entry, snippet } = hit;
  const showHeading = entry.heading !== entry.title;

  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onClick={onSelect}
      onMouseMove={onHover}
      className="cursor-pointer rounded-lg px-3 py-2.5 aria-selected:bg-bg-subtle aria-selected:ring-2 aria-selected:ring-primary aria-selected:ring-inset"
    >
      <p className="text-xs text-text-muted">
        <span>{entry.module}</span>
        {entry.phase > 0 ? (
          <span> · {t("phase", { phase: entry.phase })}</span>
        ) : null}
      </p>
      <p className="font-semibold text-text">
        <HighlightedText text={entry.title} tokens={tokens} />
        {showHeading ? (
          <span className="font-medium text-text-muted">
            {" › "}
            <HighlightedText text={entry.heading} tokens={tokens} />
          </span>
        ) : null}
      </p>
      {snippet ? (
        <p className="mt-0.5 text-sm leading-relaxed text-text-muted">
          <HighlightedText text={snippet} tokens={tokens} />
        </p>
      ) : null}
    </li>
  );
}
