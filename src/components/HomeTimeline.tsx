import { getMessages, getTranslations } from "next-intl/server";

export default async function HomeTimeline() {
  const [t, messages] = await Promise.all([
    getTranslations("Home"),
    getMessages(),
  ]);
  const { phases } = messages.Home.roadmap;

  return (
    <section aria-labelledby="roadmap-heading">
      <h2 id="roadmap-heading" className="text-2xl font-bold">
        {t("roadmap.heading")}
      </h2>
      <ol className="mt-6 border-l-2 border-border">
        {phases.map((phase) => (
          <li key={phase.label} className="relative pb-8 pl-6 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[9px] size-4 rounded-full border-2 border-primary bg-bg"
            />
            <p className="text-sm font-bold tracking-wide text-primary uppercase">
              {phase.label}
            </p>
            <h3 className="text-xl font-semibold">{phase.title}</h3>
            {"summary" in phase ? (
              <p className="mt-2 text-text-muted">{phase.summary}</p>
            ) : null}
            {phase.topics.length > 0 ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {phase.topics.map((topic) => (
                  <div
                    key={topic.title}
                    className="rounded-lg border border-border bg-bg-subtle p-4"
                  >
                    <h4 className="font-semibold">{topic.title}</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-muted">
                      {topic.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
