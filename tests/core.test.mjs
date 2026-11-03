import test from "node:test";
import assert from "node:assert/strict";
import { isValidIPv4, subnetInfo, isSameSubnet } from "../lib/network.mjs";
import { scoreAnswers } from "../lib/quiz-scoring.mjs";
import { hasRole } from "../lib/authorization.mjs";
import { recommendNext } from "../lib/recommendations.mjs";
import { selectAiProvider } from "../lib/ai-provider.mjs";
import { buildLearningJourney, LEARNING_MATERIAL_SEQUENCE } from "../lib/learning-journey.mjs";
import { safePostLoginPath } from "../lib/auth-redirect.mjs";
import { materials } from "../prisma/materials.mjs";

test("IPv4 validation accepts four decimal octets and rejects malformed addresses", () => {
  assert.equal(isValidIPv4("192.168.1.10"), true);
  assert.equal(isValidIPv4("255.255.255.255"), true);
  assert.equal(isValidIPv4("192.168.1.256"), false);
  assert.equal(isValidIPv4("192.168.1"), false);
  assert.equal(isValidIPv4("192.168.-1.2"), false);
});

test("subnet calculation returns network, broadcast, and usable host count", () => {
  assert.deepEqual(subnetInfo("192.168.1.42", 24), { address:"192.168.1.42", prefix:24, network:"192.168.1.0", broadcast:"192.168.1.255", subnetMask:"255.255.255.0", usableHosts:254 });
  assert.equal(subnetInfo("10.0.0.9", 30)?.usableHosts, 2);
  assert.equal(subnetInfo("10.0.0.9", 33), null);
});

test("same-subnet connectivity uses the prefix mask", () => {
  assert.equal(isSameSubnet("192.168.2.10", "192.168.2.240", 24), true);
  assert.equal(isSameSubnet("192.168.2.10", "192.168.3.10", 24), false);
});

test("quiz scoring validates answer count and returns a percentage", () => {
  assert.deepEqual(scoreAnswers([0, 2, 1], [0, 1, 1]), { score:67, correct:2, total:3 });
  assert.throws(() => scoreAnswers([], []));
  assert.throws(() => scoreAnswers([0], [0, 1]));
});

test("authorization requires a server-resolved role", () => {
  assert.equal(hasRole({ role:"ADMIN" }, "ADMIN"), true);
  assert.equal(hasRole({ role:"STUDENT" }, "ADMIN"), false);
  assert.equal(hasRole(null, "ADMIN"), false);
});

test("recommendations favor an incomplete weak category", () => {
  const materials=[{slug:"osi",category:"OSI"},{slug:"subnet",category:"Subnetting"}];
  assert.equal(recommendNext(materials,[],["Subnetting"])?.slug,"subnet");
  assert.equal(recommendNext(materials,["osi","subnet"]),null);
});

test("AI provider selects explicit mock mode and errors on unavailable providers", () => {
  const mock={mode:"mock"};
  assert.equal(selectAiProvider("mock",mock),mock);
  assert.equal(selectAiProvider(undefined,mock),mock);
  assert.throws(()=>selectAiProvider("openai",mock),/no server adapter installed/);
});

test("learning journey starts with the pretest and moves to the first unfinished material", () => {
  assert.equal(buildLearningJourney().nextAction.href, "/quizzes/pretest-jaringan-dasar");
  const journey = buildLearningJourney({
    pretestComplete: true,
    materials: LEARNING_MATERIAL_SEQUENCE.slice(0, 2).map((slug) => ({ slug, status: "COMPLETED" })),
  });
  assert.equal(journey.completedMaterials, 2);
  assert.equal(journey.materialsStatus, "IN_PROGRESS");
  assert.deepEqual(journey.nextAction, { kind: "material", href: "/materials/tcp-ip", slug: "tcp-ip" });
});

test("learning journey continues through posttest and labs without inventing troubleshooting completion", () => {
  const materials = LEARNING_MATERIAL_SEQUENCE.map((slug) => ({ slug, status: "COMPLETED" }));
  assert.equal(buildLearningJourney({ pretestComplete: true, materials }).nextAction.kind, "posttest");
  assert.equal(buildLearningJourney({ pretestComplete: true, materials, posttestComplete: true }).nextAction.kind, "network-lab");
  const afterNetworkLab = buildLearningJourney({ pretestComplete: true, materials, posttestComplete: true, networkLabSaved: true });
  assert.equal(afterNetworkLab.nextAction.kind, "troubleshooting");
  assert.equal(afterNetworkLab.labsStatus, "IN_PROGRESS");
});

test("login redirect preserves local destinations and rejects external or unauthorized admin destinations", () => {
  const origin = "https://nexanet.example";
  assert.equal(safePostLoginPath("/settings?tab=password", "STUDENT", origin), "/settings?tab=password");
  assert.equal(safePostLoginPath("https://attacker.example", "STUDENT", origin), "/dashboard");
  assert.equal(safePostLoginPath("//attacker.example", "STUDENT", origin), "/dashboard");
  assert.equal(safePostLoginPath("/admin/students", "STUDENT", origin), "/dashboard");
  assert.equal(safePostLoginPath("/admin/materials", "TEACHER", origin), "/admin/materials");
});

test("each core TKJ material includes learning objectives, practice, and a summary", () => {
  assert.equal(materials.length, 6);
  for (const material of materials) {
    assert.ok(material.objectives.trim().length > 0, `${material.slug} has objectives`);
    assert.match(material.content, /## \d+\. Latihan praktik/, `${material.slug} has practice`);
    assert.match(material.content, /## Ringkasan/, `${material.slug} has a summary`);
  }
});
