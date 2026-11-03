import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outDir = resolve("public", "models");
mkdirSync(outDir, { recursive: true });

function box(size, center, material) {
  const [sx, sy, sz] = size.map(value => value / 2);
  const [cx, cy, cz] = center;
  const faces = [
    { n: [0, 0, 1], p: [[-sx,-sy,sz],[sx,-sy,sz],[sx,sy,sz],[-sx,sy,sz]] },
    { n: [0, 0,-1], p: [[sx,-sy,-sz],[-sx,-sy,-sz],[-sx,sy,-sz],[sx,sy,-sz]] },
    { n: [1, 0, 0], p: [[sx,-sy,sz],[sx,-sy,-sz],[sx,sy,-sz],[sx,sy,sz]] },
    { n: [-1,0, 0], p: [[-sx,-sy,-sz],[-sx,-sy,sz],[-sx,sy,sz],[-sx,sy,-sz]] },
    { n: [0, 1, 0], p: [[-sx,sy,sz],[sx,sy,sz],[sx,sy,-sz],[-sx,sy,-sz]] },
    { n: [0,-1, 0], p: [[-sx,-sy,-sz],[sx,-sy,-sz],[sx,-sy,sz],[-sx,-sy,sz]] },
  ];
  const positions = []; const normals = []; const indices = [];
  for (const { n, p } of faces) {
    const base = positions.length / 3;
    for (const [x, y, z] of p) { positions.push(x + cx, y + cy, z + cz); normals.push(...n); }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return { material, positions, normals, indices };
}

function cylinder(radius, height, center, material, segments = 24) {
  const [cx, cy, cz] = center; const positions = []; const normals = []; const indices = [];
  for (let i = 0; i < segments; i++) {
    const a = i * Math.PI * 2 / segments; const b = (i + 1) * Math.PI * 2 / segments;
    const base = positions.length / 3;
    const p = [[Math.cos(a),-1,Math.sin(a)],[Math.cos(b),-1,Math.sin(b)],[Math.cos(b),1,Math.sin(b)],[Math.cos(a),1,Math.sin(a)]];
    for (const [x, y, z] of p) { positions.push(cx + x * radius, cy + y * height / 2, cz + z * radius); normals.push(x, 0, z); }
    indices.push(base, base + 3, base + 2, base, base + 2, base + 1);
  }
  for (const sign of [-1, 1]) {
    const base = positions.length / 3; positions.push(cx, cy + sign * height / 2, cz); normals.push(0, sign, 0);
    for (let i = 0; i <= segments; i++) { const a = i * Math.PI * 2 / segments; positions.push(cx + Math.cos(a) * radius, cy + sign * height / 2, cz + Math.sin(a) * radius); normals.push(0, sign, 0); }
    for (let i = 0; i < segments; i++) {
      if (sign > 0) indices.push(base, base + i + 2, base + i + 1);
      else indices.push(base, base + i + 1, base + i + 2);
    }
  }
  return { material, positions, normals, indices };
}

function rotateY(part, center, angle) {
  const [cx, , cz] = center;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  for (let index = 0; index < part.positions.length; index += 3) {
    const x = part.positions[index] - cx;
    const z = part.positions[index + 2] - cz;
    part.positions[index] = cx + x * cosine + z * sine;
    part.positions[index + 2] = cz - x * sine + z * cosine;
    const nx = part.normals[index];
    const nz = part.normals[index + 2];
    part.normals[index] = nx * cosine + nz * sine;
    part.normals[index + 2] = -nx * sine + nz * cosine;
  }
  return part;
}

function bezierTube(controlPoints, radius, material, steps = 48, sides = 10) {
  const [p0, p1, p2, p3] = controlPoints;
  const points = [];
  const tangents = [];
  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    const u = 1 - t;
    points.push([
      u ** 3 * p0[0] + 3 * u ** 2 * t * p1[0] + 3 * u * t ** 2 * p2[0] + t ** 3 * p3[0],
      u ** 3 * p0[1] + 3 * u ** 2 * t * p1[1] + 3 * u * t ** 2 * p2[1] + t ** 3 * p3[1],
      u ** 3 * p0[2] + 3 * u ** 2 * t * p1[2] + 3 * u * t ** 2 * p2[2] + t ** 3 * p3[2],
    ]);
    const tangent = [
      3 * u ** 2 * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t ** 2 * (p3[0] - p2[0]),
      3 * u ** 2 * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t ** 2 * (p3[1] - p2[1]),
      3 * u ** 2 * (p1[2] - p0[2]) + 6 * u * t * (p2[2] - p1[2]) + 3 * t ** 2 * (p3[2] - p2[2]),
    ];
    const length = Math.hypot(...tangent) || 1;
    tangents.push(tangent.map((value) => value / length));
  }
  const positions = [];
  const normals = [];
  const indices = [];
  for (let step = 0; step <= steps; step++) {
    const tangent = tangents[step];
    const reference = Math.abs(tangent[1]) > 0.92 ? [0, 0, 1] : [0, 1, 0];
    let side = [tangent[1] * reference[2] - tangent[2] * reference[1], tangent[2] * reference[0] - tangent[0] * reference[2], tangent[0] * reference[1] - tangent[1] * reference[0]];
    const sideLength = Math.hypot(...side) || 1;
    side = side.map((value) => value / sideLength);
    const up = [side[1] * tangent[2] - side[2] * tangent[1], side[2] * tangent[0] - side[0] * tangent[2], side[0] * tangent[1] - side[1] * tangent[0]];
    for (let ring = 0; ring <= sides; ring++) {
      const angle = (ring / sides) * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const normal = [side[0] * cosine + up[0] * sine, side[1] * cosine + up[1] * sine, side[2] * cosine + up[2] * sine];
      positions.push(points[step][0] + normal[0] * radius, points[step][1] + normal[1] * radius, points[step][2] + normal[2] * radius);
      normals.push(...normal);
    }
  }
  for (let step = 0; step < steps; step++) {
    for (let ring = 0; ring < sides; ring++) {
      const a = step * (sides + 1) + ring;
      const nextPath = a + sides + 1;
      const nextSide = a + 1;
      indices.push(a, nextPath, nextSide, nextSide, nextPath, nextPath + 1);
    }
  }
  return { material, positions, normals, indices };
}

const palette = {
  case: [0.105, 0.125, 0.15, 1], edge: [0.21, 0.24, 0.27, 1], port: [0.018, 0.025, 0.032, 1], metal: [0.64, 0.69, 0.71, 1], led: [0.12, 0.72, 0.61, 1], amber: [0.92, 0.57, 0.18, 1], white: [0.9, 0.92, 0.93, 1], accent: [0.045, 0.055, 0.07, 1], pcb: [0.035, 0.27, 0.16, 1], gold: [0.82, 0.56, 0.19, 1], rubber: [0.035, 0.04, 0.045, 1], cable: [0.06, 0.075, 0.09, 1], clear: [0.76, 0.88, 0.92, 0.48],
};
const finish = {
  case: [0.16, 0.36], edge: [0.24, 0.42], port: [0.1, 0.68], metal: [0.72, 0.3], led: [0.0, 0.28], amber: [0.02, 0.3], white: [0.04, 0.34], accent: [0.06, 0.58], pcb: [0.1, 0.48], gold: [0.82, 0.24], rubber: [0.0, 0.88], cable: [0.02, 0.62], clear: [0.04, 0.16],
};
const emissive = {
  led: [0.08, 0.8, 0.58], amber: [0.75, 0.3, 0.04],
};
const materialIndex = Object.keys(palette);

function makeParts(kind) {
  const p = [];
  const addBox = (size, center, mat, angle = 0) => p.push(rotateY(box(size, center, mat), center, angle));
  const addCylinder = (radius, height, center, mat, segments = 24) => p.push(rotateY(cylinder(radius, height, center, mat, segments), center, 0));
  const addTube = (curve, radius, mat, steps = 48) => p.push(bezierTube(curve, radius, mat, steps));
  const addRj45 = (center, angle = 0) => {
    const [x, y, z] = center;
    addBox([0.17, 0.13, 0.32], [x, y, z], "clear", angle);
    addBox([0.132, 0.064, 0.018], [x, y + 0.005, z + 0.154], "port", angle);
    for (let pin = 0; pin < 8; pin++) addBox([0.008, 0.027, 0.006], [x - 0.0525 + pin * 0.015, y + 0.018, z + 0.165], "gold", angle);
    addBox([0.074, 0.022, 0.13], [x, y + 0.073, z + 0.025], "edge", angle);
    addBox([0.058, 0.011, 0.10], [x, y + 0.09, z + 0.055], "white", angle);
    addBox([0.19, 0.095, 0.09], [x, y, z - 0.19], "rubber", angle);
    for (let ring = 0; ring < 3; ring++) addBox([0.195, 0.008, 0.009], [x, y, z - 0.16 - ring * 0.025], "edge", angle);
  };
  if (kind === "router") {
    // Dual-band home router: sculpted shell, twin antennas, vent rows and a full WAN/LAN panel.
    addBox([1.5, 0.19, 0.92], [0, 0.025, 0], "case");
    addBox([1.4, 0.022, 0.82], [0, 0.128, -0.01], "edge");
    addBox([1.32, 0.018, 0.74], [0, 0.146, -0.015], "case");
    addBox([0.72, 0.006, 0.18], [0, 0.158, 0.16], "edge");
    for (const x of [-0.54, 0.54]) {
      addCylinder(0.052, 0.045, [x, 0.145, -0.30], "edge", 20);
      addCylinder(0.027, 0.50, [x, 0.405, -0.30], "case", 24);
      addCylinder(0.028, 0.014, [x, 0.66, -0.30], "rubber", 20);
    }
    for (const x of [-0.60, 0.60]) for (const z of [-0.33, 0.33]) addCylinder(0.052, 0.035, [x, -0.09, z], "rubber", 16);
    for (let i = 0; i < 5; i++) addBox([0.54, 0.009, 0.024], [0, 0.157, -0.27 + i * 0.064], "accent");
    for (let i = 0; i < 5; i++) {
      const x = -0.36 + i * 0.09;
      addCylinder(0.012, 0.006, [x, 0.163, 0.16], i === 4 ? "amber" : "led", 12);
    }
    for (let i = 0; i < 4; i++) {
      const x = -0.48 + i * 0.30;
      addBox([0.20, 0.12, 0.05], [x, -0.005, -0.47], "metal");
      addBox([0.15, 0.075, 0.054], [x, -0.002, -0.495], "port");
      for (let pin = 0; pin < 8; pin++) addBox([0.009, 0.008, 0.004], [x - 0.052 + pin * 0.015, 0.025, -0.524], "gold");
    }
    addBox([0.20, 0.12, 0.05], [0.63, -0.005, -0.47], "metal");
    addBox([0.15, 0.075, 0.054], [0.63, -0.002, -0.495], "port");
    for (let pin = 0; pin < 8; pin++) addBox([0.009, 0.008, 0.004], [0.63 - 0.052 + pin * 0.015, 0.025, -0.524], "amber");
    addCylinder(0.048, 0.045, [-0.62, 0.005, -0.48], "edge", 20);
    addCylinder(0.023, 0.046, [-0.62, 0.005, -0.51], "port", 20);
    addBox([0.075, 0.075, 0.04], [0.43, 0.0, -0.48], "case");
    addBox([0.04, 0.04, 0.042], [0.43, 0.0, -0.504], "port");
  } else if (kind === "switch") {
    // Desktop 8-port managed switch with a metal chassis, rack ears and link LEDs.
    addBox([1.88, 0.25, 0.78], [0, 0, 0], "metal");
    addBox([1.72, 0.14, 0.045], [0, -0.005, 0.408], "case");
    for (const x of [-0.99, 0.99]) {
      addBox([0.20, 0.20, 0.68], [x, -0.005, 0], "metal");
      addCylinder(0.032, 0.018, [x, 0.074, 0.36], "port", 16);
      addCylinder(0.032, 0.018, [x, -0.075, 0.36], "port", 16);
    }
    for (let i = 0; i < 8; i++) {
      const x = -0.73 + i * 0.21;
      addBox([0.155, 0.086, 0.05], [x, -0.006, 0.443], "metal");
      addBox([0.118, 0.056, 0.055], [x, -0.006, 0.47], "port");
      for (let pin = 0; pin < 8; pin++) addBox([0.006, 0.006, 0.003], [x - 0.041 + pin * 0.012, 0.012, 0.499], "gold");
      addCylinder(0.009, 0.006, [x - 0.03, 0.075, 0.34], "led", 10);
      addCylinder(0.009, 0.006, [x - 0.01, 0.075, 0.34], i === 5 ? "amber" : "led", 10);
    }
    addBox([0.14, 0.09, 0.052], [0.80, -0.006, 0.443], "metal");
    addBox([0.105, 0.052, 0.054], [0.80, -0.006, 0.47], "port");
    addBox([0.045, 0.015, 0.008], [0, -0.005, 0.44], "white");
    for (let i = 0; i < 7; i++) addBox([0.70, 0.008, 0.022], [0, 0.129, -0.29 + i * 0.078], "case");
    for (const x of [-0.75, 0.75]) for (const z of [-0.28, 0.28]) addCylinder(0.038, 0.025, [x, -0.138, z], "rubber", 16);
  } else if (kind === "network-card") {
    // PCIe Ethernet adapter with a slotted shield, controller, memory and gold edge fingers.
    addBox([1.02, 0.035, 0.52], [0, 0, 0], "pcb");
    addBox([0.09, 0.34, 0.54], [-0.54, 0.12, 0], "metal");
    addBox([0.15, 0.18, 0.025], [-0.54, 0.14, 0.02], "port");
    addBox([0.112, 0.125, 0.035], [-0.54, 0.14, 0.018], "accent");
    for (let pin = 0; pin < 8; pin++) addBox([0.008, 0.065, 0.004], [-0.58 + pin * 0.012, 0.145, 0.038], "gold");
    addBox([0.25, 0.05, 0.20], [0.02, 0.038, 0.02], "case");
    addBox([0.20, 0.008, 0.13], [0.02, 0.065, 0.02], "edge");
    for (const x of [-0.105, 0.105]) for (const z of [-0.065, 0.065]) addBox([0.014, 0.012, 0.014], [x + 0.02, 0.071, z + 0.02], "metal");
    addBox([0.14, 0.035, 0.12], [0.34, 0.03, -0.08], "case");
    addBox([0.11, 0.012, 0.09], [0.34, 0.052, -0.08], "edge");
    for (let i = 0; i < 9; i++) addBox([0.035, 0.01, 0.012], [0.19 + i * 0.045, 0.023, 0.19], "gold");
    for (let i = 0; i < 7; i++) addBox([0.02, 0.003, 0.18], [-0.25 + i * 0.07, 0.02, -0.06], "metal");
    addCylinder(0.012, 0.008, [0.47, 0.025, 0.17], "led", 12);
    addCylinder(0.012, 0.008, [0.47, 0.025, 0.13], "amber", 12);
    addBox([0.42, 0.012, 0.009], [0.19, -0.021, 0.245], "gold");
    for (let finger = 0; finger < 9; finger++) addBox([0.065, 0.008, 0.045], [-0.24 + finger * 0.06, -0.02, 0.265], "gold");
    addCylinder(0.025, 0.012, [-0.54, 0.30, 0.02], "port", 16);
  } else if (kind === "rj45-connector") {
    // Clear 8P8C plug with internal wires, gold contacts, latch and cable boot.
    addRj45([0, 0.10, 0.02]);
    addBox([0.12, 0.006, 0.012], [0, 0.176, 0.12], "white");
    const wireColors = ["white", "amber", "white", "led", "white", "accent", "white", "case"];
    for (let wire = 0; wire < 8; wire++) addBox([0.009, 0.008, 0.115], [-0.053 + wire * 0.015, 0.082, -0.035], wireColors[wire]);
    addTube([[0, 0.10, -0.22], [0, 0.10, -0.36], [0, 0.10, -0.54], [0, 0.10, -0.68]], 0.06, "cable", 20);
  } else if (kind === "ethernet-cable") {
    // Cat6 patch lead with a broad service loop and two shielded 8P8C plugs.
    addTube([[-0.62, 0.10, 0], [-0.60, 0.72, -0.12], [0.60, 0.72, -0.12], [0.62, 0.10, 0]], 0.045, "cable", 56);
    addRj45([-0.78, 0.10, 0], -Math.PI / 2);
    addRj45([0.78, 0.10, 0], Math.PI / 2);
    addBox([0.08, 0.01, 0.016], [0, 0.775, -0.12], "edge");
  }
  return p;
}

function buildGlb(kind) {
  const parts = makeParts(kind); const chunks = []; let byteLength = 0;
  const bufferViews = []; const accessors = []; const meshes = [];
  function pushArray(values, type, target, componentType, accessorType, min, max) {
    while (byteLength % 4) { chunks.push(Buffer.from([0])); byteLength++; }
    const bytes = type === "float" ? Buffer.from(new Float32Array(values).buffer) : Buffer.from(new Uint16Array(values).buffer);
    const viewIndex = bufferViews.length; bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target }); chunks.push(bytes); byteLength += bytes.length;
    const accessorIndex = accessors.length; accessors.push({ bufferView: viewIndex, componentType, count: values.length / (accessorType === "SCALAR" ? 1 : 3), type: accessorType, ...(min ? { min } : {}), ...(max ? { max } : {}) });
    return accessorIndex;
  }
  for (const mat of materialIndex) {
    const group = parts.filter(part => part.material === mat);
    if (!group.length) continue;
    const primitive = [];
    for (const part of group) {
      const posMin = [0,1,2].map(axis => Math.min(...Array.from({ length: part.positions.length / 3 }, (_, i) => part.positions[i * 3 + axis])));
      const posMax = [0,1,2].map(axis => Math.max(...Array.from({ length: part.positions.length / 3 }, (_, i) => part.positions[i * 3 + axis])));
      const positions = pushArray(part.positions, "float", 34962, 5126, "VEC3", posMin, posMax);
      const normals = pushArray(part.normals, "float", 34962, 5126, "VEC3");
      const indices = pushArray(part.indices, "ushort", 34963, 5123, "SCALAR");
      primitive.push({ attributes: { POSITION: positions, NORMAL: normals }, indices, material: materialIndex.indexOf(mat), mode: 4 });
    }
    meshes.push({ name: mat, primitives: primitive });
  }
  const bin = Buffer.concat(chunks);
  const materials = materialIndex.map(name => ({ name, pbrMetallicRoughness: { baseColorFactor: palette[name], metallicFactor: finish[name][0], roughnessFactor: finish[name][1] }, ...(name === "clear" ? { alphaMode: "BLEND", doubleSided: true } : {}), ...(emissive[name] ? { emissiveFactor: emissive[name] } : {}) }));
  const json = Buffer.from(JSON.stringify({ asset: { version: "2.0", generator: "NexaNet educational model builder" }, scene: 0, scenes: [{ nodes: meshes.map((_, index) => index) }], nodes: meshes.map((mesh, index) => ({ mesh: index, name: mesh.name })), meshes, materials, accessors, bufferViews, buffers: [{ byteLength: bin.length }] }));
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]);
  const binPadded = Buffer.concat([bin, Buffer.alloc((4 - bin.length % 4) % 4)]);
  const totalLength = 12 + 8 + jsonPadded.length + 8 + binPadded.length;
  const header = Buffer.alloc(12); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonPadded.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(binPadded.length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonPadded, binHeader, binPadded]);
}

for (const kind of ["router", "switch", "network-card", "rj45-connector", "ethernet-cable"]) writeFileSync(resolve(outDir, `${kind}.glb`), buildGlb(kind));
