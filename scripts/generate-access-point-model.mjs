import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Builds only the access point asset so the router and switch models stay intact.
const outputDirectory = resolve("public", "models");
mkdirSync(outputDirectory, { recursive: true });

const parts = [];
const palette = {
  shell: [0.91, 0.93, 0.94, 1],
  shellShadow: [0.66, 0.70, 0.72, 1],
  seam: [0.25, 0.29, 0.33, 1],
  bracket: [0.48, 0.54, 0.57, 1],
  dark: [0.045, 0.06, 0.075, 1],
  metal: [0.72, 0.61, 0.39, 1],
  led: [0.16, 0.78, 0.71, 1],
  label: [0.83, 0.85, 0.84, 1],
};
const roughness = { shell: 0.3, shellShadow: 0.42, seam: 0.52, bracket: 0.38, dark: 0.62, metal: 0.28, led: 0.24, label: 0.68 };

function addPart(material, positions, normals, indices) {
  parts.push({ material, positions, normals, indices });
}

function lathe(profile, material, segments = 64) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let ring = 0; ring < profile.length; ring++) {
    const [radius, y] = profile[ring];
    const previous = profile[Math.max(0, ring - 1)];
    const next = profile[Math.min(profile.length - 1, ring + 1)];
    const dr = next[0] - previous[0];
    const dy = next[1] - previous[1];
    const normalLength = Math.hypot(dy, dr) || 1;
    for (let step = 0; step <= segments; step++) {
      const angle = (step / segments) * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      positions.push(radius * cosine, y, radius * sine);
      const nx = (dy * cosine) / normalLength;
      const ny = -dr / normalLength;
      const nz = (dy * sine) / normalLength;
      normals.push(nx, ny, nz);
    }
  }
  for (let ring = 0; ring < profile.length - 1; ring++) {
    for (let step = 0; step < segments; step++) {
      const a = ring * (segments + 1) + step;
      const b = a + 1;
      const d = (ring + 1) * (segments + 1) + step;
      const c = d + 1;
      // This winding faces outwards from the axis.
      indices.push(a, d, b, b, d, c);
    }
  }
  addPart(material, positions, normals, indices);
}

function cylinder(radius, height, center, material, segments = 32) {
  const [cx, cy, cz] = center;
  const positions = [];
  const normals = [];
  const indices = [];
  const bottom = cy - height / 2;
  const top = cy + height / 2;

  for (let step = 0; step <= segments; step++) {
    const angle = (step / segments) * Math.PI * 2;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    positions.push(cx + radius * x, bottom, cz + radius * z, cx + radius * x, top, cz + radius * z);
    normals.push(x, 0, z, x, 0, z);
  }
  for (let step = 0; step < segments; step++) {
    const bottomA = step * 2;
    const topA = bottomA + 1;
    const bottomB = bottomA + 2;
    const topB = bottomA + 3;
    indices.push(bottomA, topA, bottomB, topA, topB, bottomB);
  }

  const topCenter = positions.length / 3;
  positions.push(cx, top, cz);
  normals.push(0, 1, 0);
  const bottomCenter = positions.length / 3;
  positions.push(cx, bottom, cz);
  normals.push(0, -1, 0);
  for (let step = 0; step < segments; step++) {
    const a = step * 2;
    const b = a + 2;
    indices.push(topCenter, b + 1, a + 1, bottomCenter, a, b);
  }
  addPart(material, positions, normals, indices);
}

function box(size, center, material) {
  const [sx, sy, sz] = size.map((value) => value / 2);
  const [cx, cy, cz] = center;
  const faces = [
    { normal: [0, 0, 1], corners: [[-sx, -sy, sz], [sx, -sy, sz], [sx, sy, sz], [-sx, sy, sz]] },
    { normal: [0, 0, -1], corners: [[sx, -sy, -sz], [-sx, -sy, -sz], [-sx, sy, -sz], [sx, sy, -sz]] },
    { normal: [1, 0, 0], corners: [[sx, -sy, sz], [sx, -sy, -sz], [sx, sy, -sz], [sx, sy, sz]] },
    { normal: [-1, 0, 0], corners: [[-sx, -sy, -sz], [-sx, -sy, sz], [-sx, sy, sz], [-sx, sy, -sz]] },
    { normal: [0, 1, 0], corners: [[-sx, sy, sz], [sx, sy, sz], [sx, sy, -sz], [-sx, sy, -sz]] },
    { normal: [0, -1, 0], corners: [[-sx, -sy, -sz], [sx, -sy, -sz], [sx, -sy, sz], [-sx, -sy, sz]] },
  ];
  const positions = [];
  const normals = [];
  const indices = [];
  for (const face of faces) {
    const base = positions.length / 3;
    for (const [x, y, z] of face.corners) {
      positions.push(x + cx, y + cy, z + cz);
      normals.push(...face.normal);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  addPart(material, positions, normals, indices);
}

function torus(radius, tube, center, material, segments = 64, tubeSegments = 8) {
  const [cx, cy, cz] = center;
  const positions = [];
  const normals = [];
  const indices = [];
  for (let ring = 0; ring <= segments; ring++) {
    const around = (ring / segments) * Math.PI * 2;
    const ca = Math.cos(around);
    const sa = Math.sin(around);
    for (let side = 0; side <= tubeSegments; side++) {
      const cross = (side / tubeSegments) * Math.PI * 2;
      const cc = Math.cos(cross);
      const sc = Math.sin(cross);
      positions.push(cx + (radius + tube * cc) * ca, cy + tube * sc, cz + (radius + tube * cc) * sa);
      normals.push(cc * ca, sc, cc * sa);
    }
  }
  for (let ring = 0; ring < segments; ring++) {
    for (let side = 0; side < tubeSegments; side++) {
      const a = ring * (tubeSegments + 1) + side;
      const b = a + tubeSegments + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  addPart(material, positions, normals, indices);
}

// Low-profile radio enclosure with a soft crown and a narrow moulded seam.
lathe([[0.442, 0.055], [0.476, 0.062], [0.493, 0.079], [0.5, 0.105], [0.497, 0.137], [0.485, 0.165], [0.462, 0.19], [0.423, 0.211], [0.36, 0.228], [0.27, 0.239], [0.16, 0.246], [0.055, 0.249], [0, 0.25]], "shell");
// Close the underside before adding the visible mounting hardware.
cylinder(0.438, 0.006, [0, 0.052, 0], "shellShadow", 64);
lathe([[0.431, 0.042], [0.475, 0.045], [0.491, 0.056], [0.492, 0.066]], "shellShadow");
lathe([[0.477, 0.065], [0.497, 0.068], [0.499, 0.074]], "seam");

// Ceiling mounting plate and lock tabs visible under the enclosure.
lathe([[0.39, 0.012], [0.445, 0.018], [0.458, 0.031], [0.452, 0.045], [0.41, 0.05]], "bracket");
lathe([[0.33, 0.004], [0.39, 0.004], [0.405, 0.012]], "dark");
for (const angle of [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2]) {
  const x = Math.cos(angle) * 0.365;
  const z = Math.sin(angle) * 0.365;
  box([0.115, 0.014, 0.052], [x, 0.016, z], "bracket");
  cylinder(0.018, 0.009, [x, 0.026, z], "dark", 16);
}

// Fine concentric moulded lines and a small central status mark on the top.
torus(0.452, 0.0032, [0, 0.201, 0], "shellShadow", 64, 6);
torus(0.385, 0.0018, [0, 0.226, 0], "shellShadow", 64, 6);
cylinder(0.036, 0.003, [0, 0.250, 0], "shellShadow", 32);
cylinder(0.022, 0.004, [0, 0.253, 0], "led", 32);
// Subtle embossed six-dot mark.
for (const [x, z] of [[-0.012, 0.009], [0.012, 0.009], [-0.012, -0.009], [0.012, -0.009]]) {
  cylinder(0.0032, 0.0015, [x, 0.255, z], "dark", 12);
}

// Side I/O recess: an Ethernet port with contacts, PoE icon area and reset pinhole.
box([0.19, 0.085, 0.014], [0, 0.085, 0.499], "dark");
box([0.145, 0.056, 0.009], [0, 0.085, 0.508], "seam");
for (let pin = 0; pin < 8; pin++) {
  box([0.008, 0.021, 0.004], [-0.0525 + pin * 0.015, 0.089, 0.514], "metal");
}
box([0.036, 0.025, 0.008], [0.15, 0.088, 0.489], "label");
cylinder(0.007, 0.004, [-0.15, 0.085, 0.495], "dark", 16);

// A dim link/activity window sits opposite the main top status indicator.
for (const x of [-0.035, -0.015, 0.015, 0.035]) {
  cylinder(0.0048, 0.002, [x, 0.125, -0.496], "led", 12);
}

function toGlb() {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];

  function pushArray(values, component, target, componentType, type, min, max) {
    while (byteLength % 4) {
      chunks.push(Buffer.from([0]));
      byteLength++;
    }
    const bytes = component === "float" ? Buffer.from(new Float32Array(values).buffer) : Buffer.from(new Uint16Array(values).buffer);
    const bufferView = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(bytes);
    byteLength += bytes.length;
    const accessor = accessors.length;
    accessors.push({ bufferView, componentType, count: values.length / (type === "SCALAR" ? 1 : 3), type, ...(min ? { min } : {}), ...(max ? { max } : {}) });
    return accessor;
  }

  const materials = Object.entries(palette).map(([name, color]) => ({
    name,
    pbrMetallicRoughness: { baseColorFactor: color, metallicFactor: name === "metal" || name === "bracket" ? 0.58 : 0.04, roughnessFactor: roughness[name] },
    ...(name === "led" ? { emissiveFactor: [0.08, 0.72, 0.62] } : {}),
  }));
  const materialNames = Object.keys(palette);

  for (const name of materialNames) {
    const group = parts.filter((part) => part.material === name);
    if (!group.length) continue;
    const primitives = [];
    for (const part of group) {
      const count = part.positions.length / 3;
      const min = [0, 1, 2].map((axis) => Math.min(...Array.from({ length: count }, (_, index) => part.positions[index * 3 + axis])));
      const max = [0, 1, 2].map((axis) => Math.max(...Array.from({ length: count }, (_, index) => part.positions[index * 3 + axis])));
      primitives.push({
        attributes: {
          POSITION: pushArray(part.positions, "float", 34962, 5126, "VEC3", min, max),
          NORMAL: pushArray(part.normals, "float", 34962, 5126, "VEC3"),
        },
        indices: pushArray(part.indices, "ushort", 34963, 5123, "SCALAR"),
        material: materialNames.indexOf(name),
        mode: 4,
      });
    }
    meshes.push({ name, primitives });
  }

  const binary = Buffer.concat(chunks);
  const document = {
    asset: { version: "2.0", generator: "NexaNet detailed ceiling access point model" },
    scene: 0,
    scenes: [{ nodes: meshes.map((_, index) => index) }],
    nodes: meshes.map((mesh, index) => ({ mesh: index, name: mesh.name })),
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binary.length }],
  };
  const json = Buffer.from(JSON.stringify(document));
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const binaryPadded = Buffer.concat([binary, Buffer.alloc((4 - (binary.length % 4)) % 4)]);
  const totalLength = 12 + 8 + jsonPadded.length + 8 + binaryPadded.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonPadded.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binaryHeader = Buffer.alloc(8);
  binaryHeader.writeUInt32LE(binaryPadded.length, 0);
  binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonPadded, binaryHeader, binaryPadded]);
}

writeFileSync(resolve(outputDirectory, "access-point.glb"), toGlb());
