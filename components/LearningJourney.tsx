import Link from "next/link";

type JourneyStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
type JourneyAction = { kind: "pretest" | "material" | "posttest" | "network-lab" | "troubleshooting"; href: string; slug?: string };

export type LearningJourneyState = {
  pretestStatus: JourneyStatus;
  materialsStatus: JourneyStatus;
  completedMaterials: number;
  posttestStatus: JourneyStatus;
  labsStatus: JourneyStatus;
  networkLabSaved: boolean;
  nextAction: JourneyAction;
};

type Props = {
  journey: LearningJourneyState;
  title: string;
  intro: string;
  nextStepLabel: string;
  nextActionLabel: string;
  completedLabel: string;
  inProgressLabel: string;
  notStartedLabel: string;
  materialsProgressLabel: string;
  stages: [
    { title: string; description: string; href: string },
    { title: string; description: string; href: string },
    { title: string; description: string; href: string },
    { title: string; description: string; href: string },
  ];
};

export default function LearningJourney({
  journey,
  title,
  intro,
  nextStepLabel,
  nextActionLabel,
  completedLabel,
  inProgressLabel,
  notStartedLabel,
  materialsProgressLabel,
  stages,
}: Props) {
  const stagesWithState: { title: string; description: string; href: string; status: JourneyStatus; step: string }[] = [
    { ...stages[0], status: journey.pretestStatus, step: "01" },
    { ...stages[1], status: journey.materialsStatus, step: "02" },
    { ...stages[2], status: journey.posttestStatus, step: "03" },
    { ...stages[3], status: journey.labsStatus, step: "04" },
  ];
  const statusLabel = (status: JourneyStatus) => status === "COMPLETED"
    ? completedLabel
    : status === "IN_PROGRESS" ? inProgressLabel : notStartedLabel;

  return (
    <section className="learning-journey" aria-labelledby="learning-journey-title">
      <div className="learning-journey-heading">
        <div>
          <h2 id="learning-journey-title">{title}</h2>
          <p>{intro}</p>
        </div>
        <div className="learning-journey-material-count" aria-label={`${journey.completedMaterials} ${materialsProgressLabel}`}>
          <b>{journey.completedMaterials}/6</b>
          <span>{materialsProgressLabel}</span>
        </div>
      </div>
      <div className="learning-journey-track" aria-label={title}>
        {stagesWithState.map((stage, index) => {
          const status = stage.status;
          const description = index === 3 && journey.networkLabSaved
            ? stages[3].description
            : stage.description;
          return (
            <article className={`learning-journey-stage ${status.toLowerCase()}`} key={stage.step}>
              <span className="learning-journey-step">{stage.step}</span>
              <div className="learning-journey-stage-copy">
                <b>{stage.title}</b>
                <p>{description}</p>
                {index === 1 && <progress max={6} value={journey.completedMaterials} aria-label={`${journey.completedMaterials} / 6`} />}
                <span className="learning-journey-status">{statusLabel(status)}</span>
              </div>
              <Link href={stage.href} aria-label={`${stage.title}: ${statusLabel(status)}`}>
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          );
        })}
      </div>
      <div className="learning-journey-next">
        <span>{nextStepLabel}</span>
        <Link className="button button-dark" href={journey.nextAction.href}>
          {nextActionLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
