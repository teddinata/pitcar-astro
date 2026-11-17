import * as THREE from 'three';
import { type Mats, type V3, box, cyl, ball, ring, rod, tube, helix, lathe, grp } from './kit';

export type Fuel = 'efi' | 'karbu' | 'commonrail' | 'injeksi';
export type Slot = 'mesin' | 'pendingin' | 'rem' | 'bahanbakar' | 'ac' | 'transmisi' | 'suspensi' | 'listrik';

type Line2 = [number, number][];

/**
 * Proportions of one body style, in metres. x runs from the rear bumper (0) to
 * the nose (len), y is height above the ground.
 *
 * These are generic silhouettes built from typical dimensions of the class.
 * They are not a manufacturer's model.
 */
interface BodySpec {
  len: number;
  width: number;
  clearance: number;
  wheelR: number;
  frontAxle: number;
  rearAxle: number;
  /** Upper outline of the side view. */
  top: Line2;
  /** Window sill. Where it rises above `top` the body simply has no glass. */
  belt: Line2;
  pillars: number[];
  doors: number[];
}

const BODIES: Record<Exclude<Fuel, 'injeksi'>, BodySpec> = {
  // Compact rear-wheel-drive MPV.
  efi: {
    len: 4.2, width: 1.66, clearance: 0.2, wheelR: 0.31, frontAxle: 3.45, rearAxle: 0.8,
    top: [[0, 0.78], [0.04, 1.1], [0.2, 1.6], [0.8, 1.68], [2.5, 1.66], [2.85, 1.58], [3.5, 1.02], [4.05, 0.88], [4.18, 0.72], [4.2, 0.56]],
    belt: [[0, 1.0], [3.5, 1.0], [4.2, 0.86]],
    pillars: [0.95, 1.85, 2.72],
    doors: [1.0, 1.85, 2.8, 3.38],
  },
  // Upright minibus of the carburettor era.
  karbu: {
    len: 4.3, width: 1.67, clearance: 0.21, wheelR: 0.32, frontAxle: 3.5, rearAxle: 0.85,
    top: [[0, 0.84], [0.03, 1.2], [0.1, 1.72], [0.5, 1.79], [2.75, 1.79], [2.98, 1.72], [3.42, 1.13], [4.15, 1.02], [4.28, 0.84], [4.3, 0.62]],
    belt: [[0, 1.09], [3.42, 1.11], [4.3, 0.99]],
    pillars: [0.9, 1.9, 2.8],
    doors: [1.0, 1.9, 2.85, 3.36],
  },
  // Ladder-frame diesel SUV: long, tall, high off the ground.
  commonrail: {
    len: 4.8, width: 1.82, clearance: 0.3, wheelR: 0.38, frontAxle: 3.9, rearAxle: 1.1,
    top: [[0, 0.95], [0.05, 1.28], [0.28, 1.73], [0.95, 1.81], [2.6, 1.8], [3.05, 1.72], [3.75, 1.23], [4.55, 1.13], [4.77, 0.97], [4.8, 0.76]],
    belt: [[0, 1.2], [3.75, 1.22], [4.8, 1.12]],
    pillars: [1.05, 2.0, 2.95],
    doors: [1.3, 2.1, 3.05, 3.68],
  },
};

const sample = (pts: Line2, x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return pts[pts.length - 1][1];
};

const smooth = (a: number[], passes: number) => {
  for (let p = 0; p < passes; p++) {
    const b = a.slice();
    for (let i = 1; i < a.length - 1; i++) a[i] = (b[i - 1] + 2 * b[i] + b[i + 1]) / 4;
  }
  return a;
};

const sat = (v: number) => Math.min(1, Math.max(0, v));
const sstep = (a: number, b: number, v: number) => {
  const t = sat((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Rim-lit glass: nearly clear face-on, visible where the surface turns away. */
export function makeShellMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(0xa8a29e) }, uFace: { value: 0.05 }, uRim: { value: 0.6 }, uFade: { value: 1 } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor; uniform float uFace; uniform float uRim; uniform float uFade;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        gl_FragColor = vec4(uColor, mix(uFace, uRim, f) * uFade);
      }`,
  });
}

const HALF = 8; // points on one side of a cross-section, centreline to centreline

export interface BodyMats {
  paint: THREE.Material;
  glass: THREE.Material;
  /** Rim-lit shell that takes over when the paint fades out. */
  xray: THREE.Material;
  line: THREE.LineBasicMaterial;
}

export interface Car {
  group: THREE.Group;
  parts: Map<Slot, THREE.Object3D>;
  center: THREE.Vector3;
  radius: number;
}

export function buildCar(fuel: Fuel, matic: boolean, mats: Mats, body: BodyMats): Car {
  const lineMat = body.line;
  // The older mechanical diesel sits in the same upright minibus as the carburettor car.
  const s = BODIES[fuel === 'injeksi' ? 'karbu' : fuel];
  const N = 110;
  const xs: number[] = [];
  const top: number[] = [];
  const belt: number[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * s.len;
    xs.push(x);
    top.push(sample(s.top, x));
  }
  smooth(top, 3);
  for (let i = 0; i <= N; i++) belt.push(Math.min(top[i] - 0.004, sample(s.belt, xs[i])));
  smooth(belt, 2);

  const archR = s.wheelR + 0.085;
  const bottom = (x: number) => {
    let y = s.clearance + 0.1 * (1 - sstep(0, 0.3, x)) + 0.1 * (1 - sstep(0, 0.35, s.len - x));
    for (const ax of [s.frontAxle, s.rearAxle]) {
      const d = Math.abs(x - ax);
      if (d < archR) y = Math.max(y, s.wheelR + Math.sqrt(archR * archR - d * d));
    }
    return y;
  };
  const halfW = (x: number) =>
    (s.width / 2) * (1 - 0.09 * (1 - sstep(0, 0.5, x)) - 0.13 * (1 - sstep(0, 0.65, s.len - x)));

  // Half cross-section as [z, y], from the floor centreline up to the roof centreline.
  const section = (i: number): [number, number][] => {
    const w = halfW(xs[i]);
    const yb = Math.min(bottom(xs[i]), belt[i] - 0.1);
    const yl = belt[i];
    const yt = top[i];
    const glass = sat((yt - yl) / 0.35);
    const wr = w * (0.94 - 0.15 * glass);
    return [
      [0, yb],
      [w * 0.86, yb],
      [w, Math.min(yb + 0.1, yl - 0.07)],
      [w, yl - 0.06],
      [w * 0.985, yl],
      [wr, yl + (yt - yl) * 0.94],
      [wr * 0.8, yt],
      [0, yt + 0.025 * glass],
    ];
  };

  const M = HALF * 2 - 2;
  const pos: number[] = [];
  const sections: [number, number][][] = [];
  for (let i = 0; i <= N; i++) {
    const half = section(i);
    sections.push(half);
    for (let j = 0; j < HALF; j++) pos.push(xs[i], half[j][1], half[j][0]);
    for (let j = HALF - 2; j >= 1; j--) pos.push(xs[i], half[j][1], -half[j][0]);
  }
  const roofY = Math.max(...top) - 0.1;
  const step = s.len / N;
  const isGlass = (i: number, hq: number) => {
    const x = xs[i] + step / 2;
    const yt = (top[i] + top[i + 1]) / 2;
    if (yt - (belt[i] + belt[i + 1]) / 2 < 0.12 || hq < 4 || hq > 6) return false;
    if (yt < roofY) return true; // windscreen and rear screen, full width
    return hq === 4 && !s.pillars.some((px) => Math.abs(x - px) < step * 0.9);
  };
  const paintIdx: number[] = [];
  const glassIdx: number[] = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const a = i * M + j;
      const b = i * M + ((j + 1) % M);
      const hq = j < HALF - 1 ? j : M - 1 - j;
      (isGlass(i, hq) ? glassIdx : paintIdx).push(a, a + M, b + M, a, b + M, b);
    }
  }
  for (const i of [0, N]) {
    const c = pos.length / 3;
    pos.push(xs[i], (sections[i][0][1] + sections[i][HALF - 1][1]) / 2, 0);
    for (let j = 0; j < M; j++) paintIdx.push(c, i * M + j, i * M + ((j + 1) % M));
  }
  const shellGeo = new THREE.BufferGeometry();
  shellGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  shellGeo.setIndex([...paintIdx, ...glassIdx]);
  shellGeo.addGroup(0, paintIdx.length, 0);
  shellGeo.addGroup(paintIdx.length, glassIdx.length, 1);
  shellGeo.computeVertexNormals();
  const shell = new THREE.Mesh(shellGeo, [body.paint, body.glass]);
  shell.renderOrder = 2;
  shell.castShadow = true;
  const ghost = new THREE.Mesh(shellGeo, body.xray);
  ghost.renderOrder = 2;

  const group = new THREE.Group();
  group.add(shell, ghost);

  // ---- feature lines drawn on the surface ----
  const line = (pts: V3[]) => {
    const g = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(...p)));
    const l = new THREE.Line(g, lineMat);
    l.renderOrder = 3;
    group.add(l);
  };
  const at = (x: number) => Math.round((x / s.len) * N);
  const both = (make: (side: 1 | -1) => V3[]) => { line(make(1)); line(make(-1)); };
  const e = 1.004;

  const glazed = xs.map((_, i) => i).filter((i) => top[i] - belt[i] > 0.05);
  both((k) => [
    ...glazed.map((i): V3 => [xs[i], sections[i][4][1], sections[i][4][0] * k * e]),
    ...glazed.slice().reverse().map((i): V3 => [xs[i], sections[i][5][1], sections[i][5][0] * k * e]),
    [xs[glazed[0]], sections[glazed[0]][4][1], sections[glazed[0]][4][0] * k * e],
  ]);
  for (const x of s.pillars) {
    const i = at(x);
    both((k) => [4, 5].map((j): V3 => [xs[i], sections[i][j][1], sections[i][j][0] * k * e]));
  }
  for (const x of s.doors) {
    const i = at(x);
    both((k) => [2, 3, 4].map((j): V3 => [xs[i], sections[i][j][1], sections[i][j][0] * k * e]));
  }
  // Sill between the arches, and the arches themselves.
  both((k) =>
    xs.map((_, i) => i)
      .filter((i) => xs[i] > s.rearAxle + archR && xs[i] < s.frontAxle - archR)
      .map((i): V3 => [xs[i], sections[i][2][1], sections[i][2][0] * k * e]),
  );
  for (const ax of [s.frontAxle, s.rearAxle]) {
    both((k) => Array.from({ length: 25 }, (_, n): V3 => {
      const a = (n / 24) * Math.PI;
      const x = ax + Math.cos(a) * archR;
      return [x, s.wheelR + Math.sin(a) * archR, halfW(x) * k * e];
    }));
  }
  // Cowl and tailgate: the two cross-car lines that read as "bonnet" and "boot".
  const glassEnds = [glazed[glazed.length - 1], glazed[0]];
  for (const i of glassEnds) {
    const half = sections[i];
    const over = [4, 5, 6, 7].map((j): V3 => [xs[i], half[j][1] + 0.003, half[j][0]]);
    line([...over, ...over.slice(0, -1).reverse().map((p): V3 => [p[0], p[1], -p[2]])]);
  }
  // Grille bars.
  for (let n = 0; n < 3; n++) {
    const y = sample(s.top, s.len - 0.02) - 0.04 - n * 0.06;
    const w = halfW(s.len) * 0.55;
    line([[s.len + 0.004, y, -w], [s.len + 0.004, y, w]]);
  }

  // ---- lamps ----
  const lamp = new THREE.MeshBasicMaterial({ color: 0xfff1d6 });
  const tail = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
  const noseY = sample(s.top, s.len - 0.25) - 0.13;
  const tailY = sample(s.belt, 0.1) - 0.1;
  for (const k of [1, -1]) {
    group.add(box(0.05, 0.09, 0.3, lamp, [s.len - 0.05, noseY, halfW(s.len - 0.05) * 0.72 * k]));
    group.add(box(0.04, 0.26, 0.1, tail, [0.03, tailY, halfW(0.03) * 0.86 * k]));
  }

  const cowl = xs[glazed[glazed.length - 1]];
  for (const k of [1, -1]) {
    const mx = cowl - 0.22;
    group.add(box(0.07, 0.11, 0.17, mats.dark, [mx, sample(s.belt, mx) + 0.07, (halfW(mx) + 0.08) * k]));
    for (const dx of s.doors.slice(0, -1)) {
      group.add(box(0.13, 0.025, 0.02, mats.alu, [dx + 0.16, sample(s.belt, dx) - 0.13, (halfW(dx) + 0.004) * k]));
    }
  }

  // ---- wheels ----
  const R = s.wheelR;
  const wz = s.width / 2 - 0.115;
  for (const ax of [s.frontAxle, s.rearAxle]) {
    for (const k of [1, -1]) {
      const t = 0.1075;
      const tyre = lathe([[R * 0.66, -t], [R * 0.94, -t], [R, -t + 0.03], [R, t - 0.03], [R * 0.94, t], [R * 0.66, t]], mats.rubber);
      tyre.rotation.x = Math.PI / 2;
      const wheel = grp([
        tyre,
        cyl(R * 0.66, 0.17, mats.dark, [0, 0, 0], 'z', R * 0.66, 40),
        ring(R * 0.65, 0.012, mats.alu, [0, 0, 0.095 * k]),
        cyl(R * 0.16, 0.21, mats.alu, [0, 0, 0], 'z'),
        ...[0, 1, 2, 3, 4].map((n) => {
          const a = (n / 5) * Math.PI * 2;
          return box(R * 0.52, 0.045, 0.03, mats.alu, [Math.cos(a) * R * 0.38, Math.sin(a) * R * 0.38, 0.085 * k], [0, 0, a]);
        }),
      ], [ax, R, wz * k]);
      group.add(wheel);
    }
  }

  // ---- the seven systems ----
  const fa = s.frontAxle;
  const ra = s.rearAxle;
  const ex = fa + 0.1;
  const ey = R + 0.26;
  const parts = new Map<Slot, THREE.Object3D>();
  const add = (slot: Slot, children: THREE.Object3D[]) => {
    const g = grp(children);
    g.userData.slot = slot;
    parts.set(slot, g);
    group.add(g);
  };

  add('mesin', [
    box(0.6, 0.26, 0.4, mats.dark, [ex, ey, 0]),
    box(0.6, 0.1, 0.36, mats.steel, [ex, ey + 0.18, 0]),
    box(0.56, 0.05, 0.3, mats.alu, [ex, ey + 0.255, 0]),
    box(0.5, 0.09, 0.3, mats.dark, [ex, ey - 0.175, 0]),
    cyl(0.075, 0.03, mats.alu, [ex + 0.32, ey - 0.1, 0], 'x'),
    cyl(0.05, 0.03, mats.alu, [ex + 0.32, ey + 0.12, 0.1], 'x'),
  ]);

  const rx = s.len - 0.4;
  add('pendingin', [
    box(0.04, 0.4, 0.62, mats.alu, [rx, R + 0.3, 0]),
    box(0.05, 0.04, 0.66, mats.dark, [rx, R + 0.52, 0]),
    box(0.05, 0.04, 0.66, mats.dark, [rx, R + 0.08, 0]),
    cyl(0.17, 0.015, mats.dark, [rx - 0.06, R + 0.3, 0], 'x'),
    tube([[ex + 0.2, ey + 0.2, 0.12], [ex + 0.38, ey + 0.3, 0.2], [rx - 0.03, R + 0.5, 0.2]], 0.022, mats.rubber),
    tube([[ex + 0.25, ey - 0.1, -0.14], [ex + 0.4, R + 0.1, -0.2], [rx - 0.03, R + 0.1, -0.2]], 0.022, mats.rubber),
  ]);

  const bz = s.width / 2 - 0.26;
  add('rem', [
    ...[fa, ra].flatMap((ax) => [1, -1].flatMap((k) => [
      cyl(R * 0.62, 0.028, mats.steel, [ax, R, bz * k], 'z', R * 0.62, 40),
      box(0.1, 0.07, 0.07, mats.dark, [ax - R * 0.5, R + R * 0.25, bz * k]),
    ])),
    cyl(0.035, 0.16, mats.alu, [fa - 0.38, R + 0.62, 0.32], 'x'),
    cyl(0.1, 0.06, mats.dark, [fa - 0.49, R + 0.62, 0.32], 'x'),
    tube([[fa - 0.3, R + 0.6, 0.32], [fa - 0.1, R + 0.3, 0.5], [fa, R + 0.2, bz]], 0.008, mats.steel),
    tube([[fa - 0.3, R + 0.6, 0.32], [fa - 0.5, s.clearance + 0.12, 0.3], [ra + 0.3, s.clearance + 0.12, 0.3], [ra, R + 0.1, bz - 0.05]], 0.008, mats.steel),
  ]);

  const ecu = box(0.05, 0.14, 0.2, mats.alu, [fa - 0.58, R + 0.42, -0.02]);
  const loom = tube([[fa - 0.56, R + 0.44, -0.02], [fa - 0.35, ey + 0.3, 0.1], [ex - 0.2, ey + 0.26, 0.2]], 0.01, mats.dark);
  if (fuel === 'efi') {
    add('bahanbakar', [
      ecu, loom,
      cyl(0.016, 0.5, mats.steel, [ex, ey + 0.26, 0.22], 'x'),
      ...[-0.19, -0.065, 0.065, 0.19].map((d) => cyl(0.014, 0.07, mats.dark, [ex + d, ey + 0.22, 0.22])),
    ]);
  } else if (fuel === 'karbu') {
    add('bahanbakar', [
      cyl(0.045, 0.1, mats.alu, [ex, ey + 0.32, 0]),
      cyl(0.15, 0.06, mats.dark, [ex, ey + 0.39, 0]),
      cyl(0.155, 0.012, mats.steel, [ex, ey + 0.425, 0]),
      tube([[ex - 0.05, ey + 0.3, 0.03], [ex - 0.2, ey + 0.2, 0.24], [ex - 0.6, s.clearance + 0.15, 0.3], [ra + 0.5, s.clearance + 0.2, 0.3]], 0.009, mats.steel),
    ]);
  } else if (fuel === 'commonrail') {
    add('bahanbakar', [
      ecu, loom,
      cyl(0.02, 0.5, mats.steel, [ex, ey + 0.28, 0.23], 'x'),
      ...[-0.19, -0.065, 0.065, 0.19].map((d) => cyl(0.016, 0.1, mats.dark, [ex + d, ey + 0.31, 0.1])),
      ...[-0.19, -0.065, 0.065, 0.19].map((d) => tube([[ex + d, ey + 0.28, 0.23], [ex + d, ey + 0.4, 0.18], [ex + d, ey + 0.36, 0.1]], 0.006, mats.steel)),
      cyl(0.06, 0.14, mats.alu, [ex + 0.22, ey - 0.02, 0.27], 'x'),
    ]);
  } else {
    // In-line injection pump bolted to the side of the block, one steel pipe per cylinder.
    const px = [-0.12, -0.04, 0.04, 0.12];
    add('bahanbakar', [
      box(0.34, 0.14, 0.09, mats.alu, [ex, ey + 0.02, 0.27]),
      cyl(0.05, 0.08, mats.dark, [ex - 0.2, ey + 0.02, 0.27], 'x'),
      ...px.map((d) => cyl(0.014, 0.05, mats.steel, [ex + d, ey + 0.11, 0.27])),
      ...px.map((d, i) => tube([[ex + d, ey + 0.13, 0.27], [ex + d, ey + 0.34, 0.2], [ex - 0.19 + i * 0.127, ey + 0.36, 0.06], [ex - 0.19 + i * 0.127, ey + 0.3, 0]], 0.006, mats.steel)),
      ...[-0.19, -0.063, 0.063, 0.19].map((d) => cyl(0.016, 0.09, mats.dark, [ex + d, ey + 0.3, 0])),
    ]);
  }

  add('ac', [
    box(0.02, 0.36, 0.58, mats.steel, [rx + 0.07, R + 0.3, 0]),
    cyl(0.06, 0.15, mats.alu, [ex + 0.2, ey - 0.06, -0.27], 'x'),
    cyl(0.068, 0.025, mats.dark, [ex + 0.29, ey - 0.06, -0.27], 'x'),
    box(0.2, 0.18, 0.3, mats.alu, [fa - 0.6, R + 0.5, -0.32]),
    tube([[ex + 0.2, ey, -0.27], [ex + 0.4, ey + 0.2, -0.3], [rx + 0.07, R + 0.46, -0.27]], 0.01, mats.steel),
    tube([[rx + 0.07, R + 0.14, -0.27], [ex + 0.3, R + 0.02, -0.34], [fa - 0.3, R + 0.3, -0.36], [fa - 0.5, R + 0.5, -0.34]], 0.01, mats.steel),
  ]);

  add('transmisi', [
    // A torque converter needs a deeper, rounder housing than a clutch does.
    cyl(0.14, matic ? 0.26 : 0.2, mats.alu, [ex - (matic ? 0.43 : 0.4), ey - 0.02, 0], 'x', matic ? 0.22 : 0.2),
    box(0.5, matic ? 0.24 : 0.22, matic ? 0.28 : 0.24, mats.steel, [ex - 0.75, ey - 0.03, 0]),
    ...(matic ? [box(0.4, 0.05, 0.24, mats.dark, [ex - 0.75, ey - 0.17, 0])] : []),
    cyl(0.07, 0.12, mats.steel, [ex - 1.05, ey - 0.04, 0], 'x'),
    rod([ex - 1.1, ey - 0.04, 0], [ra + 0.14, R, 0], 0.035, mats.dark),
    ball(0.135, mats.steel, [ra, R, 0]),
    rod([ra, R, -(s.width / 2 - 0.22)], [ra, R, s.width / 2 - 0.22], 0.04, mats.dark),
    ...(matic
      ? [box(0.16, 0.03, 0.06, mats.dark, [ex - 0.78, ey + 0.3, 0]), box(0.03, 0.09, 0.03, mats.dark, [ex - 0.8, ey + 0.35, 0])]
      : [rod([ex - 0.7, ey + 0.08, 0], [ex - 0.78, ey + 0.4, 0], 0.012, mats.dark), ball(0.028, mats.dark, [ex - 0.78, ey + 0.41, 0])]),
  ]);

  const sz = s.width / 2 - 0.31;
  add('suspensi', [1, -1].flatMap((k) => [
    helix(0.055, R + 0.1, R + 0.46, 6, 0.011, mats.steel, [fa, 0, sz * k]),
    cyl(0.024, 0.44, mats.dark, [fa, R + 0.28, sz * k]),
    cyl(0.07, 0.02, mats.dark, [fa, R + 0.5, sz * k]),
    rod([fa, R - 0.09, 0.16 * k], [fa, R - 0.06, (s.width / 2 - 0.24) * k], 0.022, mats.dark),
    helix(0.06, R + 0.07, R + 0.34, 5, 0.012, mats.steel, [ra, 0, (sz - 0.12) * k]),
    rod([ra - 0.12, R + 0.03, (sz + 0.02) * k], [ra - 0.22, R + 0.46, (sz - 0.04) * k], 0.022, mats.dark),
  ]));

  // Battery on the left of the bay, alternator low on the block, one cable between them.
  add('listrik', [
    box(0.24, 0.19, 0.17, mats.dark, [fa + 0.42, R + 0.52, 0.45]),
    cyl(0.014, 0.03, mats.brass, [fa + 0.34, R + 0.63, 0.45]),
    cyl(0.014, 0.03, mats.brass, [fa + 0.5, R + 0.63, 0.45]),
    cyl(0.075, 0.12, mats.alu, [ex + 0.24, ey + 0.08, 0.3], 'x'),
    cyl(0.05, 0.02, mats.dark, [ex + 0.31, ey + 0.08, 0.3], 'x'),
    tube([[fa + 0.34, R + 0.64, 0.45], [fa + 0.3, R + 0.7, 0.38], [ex + 0.24, ey + 0.2, 0.32], [ex + 0.24, ey + 0.15, 0.3]], 0.01, mats.red),
    box(0.16, 0.07, 0.11, mats.dark, [fa - 0.2, R + 0.6, -0.5]),
  ]);

  const height = Math.max(...top);
  return {
    group,
    parts,
    center: new THREE.Vector3(s.len / 2, height * 0.46, 0),
    radius: Math.hypot(s.len / 2, height / 2) * 1.02,
  };
}
