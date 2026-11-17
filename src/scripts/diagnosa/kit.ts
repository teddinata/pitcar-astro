import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export type V3 = [number, number, number];
export type Axis = 'x' | 'y' | 'z';

export interface Mats {
  steel: THREE.Material;
  dark: THREE.Material;
  alu: THREE.Material;
  red: THREE.Material;
  rubber: THREE.Material;
  brass: THREE.Material;
  glass: THREE.Material;
  /** Swapped onto whatever is selected or suspected. */
  active: THREE.Material;
}

export function makeMats(): Mats {
  const std = (color: number, roughness: number, metalness: number) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  return {
    steel: std(0x9a9da1, 0.36, 0.9),
    dark: std(0x303136, 0.62, 0.55),
    alu: std(0xdcdddf, 0.26, 0.95),
    red: new THREE.MeshPhysicalMaterial({ color: 0xcc0000, roughness: 0.35, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.15 }),
    rubber: std(0x141414, 0.9, 0),
    brass: std(0xb98a3c, 0.38, 0.85),
    glass: new THREE.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.15, metalness: 0, transparent: true, opacity: 0.45 }),
    active: new THREE.MeshStandardMaterial({ color: 0xe01010, roughness: 0.4, metalness: 0.2, emissive: 0xcc0000, emissiveIntensity: 0.55 }),
  };
}

const place = <T extends THREE.Object3D>(o: T, at: V3 = [0, 0, 0], rot?: V3): T => {
  o.position.set(...at);
  if (rot) o.rotation.set(...rot);
  return o;
};

/** Box with softened edges, so it catches light like a cast or machined part. */
export const box = (w: number, h: number, d: number, mat: THREE.Material, at?: V3, rot?: V3) =>
  place(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(0.012, Math.min(w, h, d) * 0.2)), mat), at, rot);

/** Toothed wheel of thickness `len` along `axis`. */
export function gear(r: number, len: number, mat: THREE.Material, at?: V3, axis: Axis = 'x', teeth = Math.max(10, Math.round(r * 240))) {
  const depth = Math.min(0.012, r * 0.16);
  const shape = new THREE.Shape();
  const n = teeth * 4;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = i % 4 < 2 ? r : r - depth;
    if (i === 0) shape.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else shape.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: len, bevelEnabled: false });
  geo.translate(0, 0, -len / 2);
  const m = place(new THREE.Mesh(geo, mat), at);
  if (axis === 'x') m.rotation.y = Math.PI / 2;
  if (axis === 'y') m.rotation.x = Math.PI / 2;
  return m;
}

/** Moves an object along one axis relative to where it was built. */
export function nudge(o: THREE.Object3D, axis: Axis, d: number) {
  o.userData.p0 ??= o.position.clone();
  o.position[axis] = (o.userData.p0 as THREE.Vector3)[axis] + d;
}

/** Cylinder of length `h` along `axis`. `r2` is the radius at the positive end. */
export function cyl(r: number, h: number, mat: THREE.Material, at?: V3, axis: Axis = 'y', r2 = r, seg = 28) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r2, r, h, seg), mat);
  place(m, at);
  if (axis === 'x') m.rotation.z = -Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  return m;
}

export const ball = (r: number, mat: THREE.Material, at?: V3) =>
  place(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat), at);

export const ring = (r: number, wire: number, mat: THREE.Material, at?: V3, axis: Axis = 'z') => {
  const m = place(new THREE.Mesh(new THREE.TorusGeometry(r, wire, 10, 40), mat), at);
  if (axis === 'x') m.rotation.y = Math.PI / 2;
  if (axis === 'y') m.rotation.x = Math.PI / 2;
  return m;
};

/** Round bar between two points. */
export function rod(a: V3, b: V3, r: number, mat: THREE.Material) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, va.distanceTo(vb), 16), mat);
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.sub(va).normalize());
  return m;
}

export function tube(pts: V3[], r: number, mat: THREE.Material) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16, pts.length * 10), r, 8), mat);
}

export function helix(r: number, y0: number, y1: number, turns: number, wire: number, mat: THREE.Material, at: V3 = [0, 0, 0]) {
  const pts: V3[] = [];
  const n = turns * 14;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * turns * Math.PI * 2;
    pts.push([Math.cos(a) * r, y0 + ((y1 - y0) * i) / n, Math.sin(a) * r]);
  }
  return place(tube(pts, wire, mat), at);
}

export const lathe = (profile: [number, number][], mat: THREE.Material, at?: V3) =>
  place(new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 32), mat), at);

export function grp(children: THREE.Object3D[], at?: V3, rot?: V3) {
  const g = new THREE.Group();
  g.add(...children);
  return place(g, at, rot);
}

export function setActive(root: THREE.Object3D, on: boolean, active: THREE.Material) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.userData.base ??= m.material;
    m.material = on ? active : m.userData.base;
  });
}

export function disposeTree(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
  });
}
