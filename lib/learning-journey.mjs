export const LEARNING_MATERIAL_SEQUENCE = [
  "dasar-jaringan-komputer",
  "osi-layer",
  "tcp-ip",
  "ipv4-addressing",
  "ipv4-subnetting",
  "troubleshooting-jaringan",
];

/**
 * Build the suggested study sequence from records already saved for a learner.
 * Troubleshooting Lab has no persisted completion record, so the lab stage is
 * never marked complete from a local-only interaction.
 * @param {{ pretestComplete?: boolean, materials?: { slug: string, status: string }[], posttestComplete?: boolean, networkLabSaved?: boolean }} [input]
 */
export function buildLearningJourney({
  pretestComplete = false,
  materials = [],
  posttestComplete = false,
  networkLabSaved = false,
} = {}) {
  const statusBySlug = new Map(materials.map(({ slug, status }) => [slug, status]));
  const completedMaterials = LEARNING_MATERIAL_SEQUENCE.filter(
    (slug) => statusBySlug.get(slug) === "COMPLETED",
  ).length;
  const hasMaterialProgress = LEARNING_MATERIAL_SEQUENCE.some((slug) => {
    const status = statusBySlug.get(slug);
    return status === "IN_PROGRESS" || status === "COMPLETED";
  });

  const materialsStatus = completedMaterials === LEARNING_MATERIAL_SEQUENCE.length
    ? "COMPLETED"
    : hasMaterialProgress ? "IN_PROGRESS" : "NOT_STARTED";

  let nextAction;
  if (!pretestComplete) {
    nextAction = { kind: "pretest", href: "/quizzes/pretest-jaringan-dasar" };
  } else {
    const nextMaterial = LEARNING_MATERIAL_SEQUENCE.find((slug) => statusBySlug.get(slug) !== "COMPLETED");
    if (nextMaterial) {
      nextAction = { kind: "material", href: `/materials/${nextMaterial}`, slug: nextMaterial };
    } else if (!posttestComplete) {
      nextAction = { kind: "posttest", href: "/quizzes/posttest-jaringan-dasar" };
    } else if (!networkLabSaved) {
      nextAction = { kind: "network-lab", href: "/network-lab" };
    } else {
      nextAction = { kind: "troubleshooting", href: "/troubleshooting" };
    }
  }

  return {
    pretestStatus: pretestComplete ? "COMPLETED" : "NOT_STARTED",
    materialsStatus,
    completedMaterials,
    posttestStatus: posttestComplete ? "COMPLETED" : "NOT_STARTED",
    labsStatus: networkLabSaved ? "IN_PROGRESS" : "NOT_STARTED",
    networkLabSaved,
    nextAction,
  };
}
