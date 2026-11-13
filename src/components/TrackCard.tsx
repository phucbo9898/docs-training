import { Link } from "@/i18n/navigation";

type TrackCardProps = {
  title: string;
  description: string;
  meta: string;
  href: string;
  cta: string;
};

/** Cả thẻ là một link để bấm/Tab vào được ở mọi vị trí. */
export default function TrackCard({
  title,
  description,
  meta,
  href,
  cta,
}: TrackCardProps) {
  return (
    <li className="flex">
      <Link
        href={href}
        className="group flex w-full flex-col rounded-xl border border-border bg-bg-subtle p-6 transition-colors hover:border-primary focus-visible:border-primary"
      >
        <h2 className="text-xl font-bold text-text">{title}</h2>
        <p className="mt-2 flex-1 text-text-muted">{description}</p>
        <p className="mt-4 text-sm text-text-muted">{meta}</p>
        <span className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-primary-text">
          {cta}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </Link>
    </li>
  );
}
