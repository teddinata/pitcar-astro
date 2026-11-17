import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import logoPitcar from '~/assets/images/logo-pitcar.png';
import { type BodyMats, type Slot, buildCar, makeShellMaterial } from './car';
import { makeMats, setActive } from './kit';
import type { AreaId } from '~/data/diagnosa';

type V3 = [number, number, number];

interface AreaView {
  slots: Slot[];
  /** Where the part label floats, in the car's own metres. */
  tag: V3;
  yaw: number;
  pitch: number;
}

const VIEWS: Record<AreaId, AreaView> = {
  mesin: { slots: ['mesin', 'pendingin', 'bahanbakar'], tag: [3.62, 1.12, -0.2], yaw: 0.95, pitch: 0.34 },
  ac: { slots: ['ac'], tag: [2.82, 1.45, -0.42], yaw: 1.25, pitch: 0.36 },
  rem: { slots: ['rem', 'suspensi'], tag: [3.45, 0.36, 0.86], yaw: 0.5, pitch: 0.14 },
  transmisi: { slots: ['transmisi'], tag: [2.45, 0.24, 0.7], yaw: 0.28, pitch: 0.2 },
  listrik: { slots: ['listrik'], tag: [4.02, 0.92, 0.52], yaw: 0.8, pitch: 0.42 },
  bodi: { slots: [], tag: [1.5, 1.5, 0.84], yaw: 0.36, pitch: 0.22 },
};

const REST = { yaw: 0.62, pitch: 0.2 };
const MODEL_URL = '/models/avanza.glb';
// Material names inside the model file: body paint and window glass.
const MODEL_PAINT = 'Material.069';
const MODEL_GLASS = 'Material.060';
const FOV = 26;
const BODY_LENGTH = 4.2;
const BODY_WIDTH = 1.66;
const MODEL_YAW = -Math.PI / 2;
const LIGHT_DIR = new THREE.Vector3(0.45, 1, 0.55).normalize();

/** Door livery: a red slanted band carrying the Pitcar name, drawn once and wrapped onto the body. */
async function liveryTexture() {
  const font = "italic 700 150px 'Chakra Petch'";
  await document.fonts.load(font, 'PITCAR').catch(() => undefined);
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 320;
  const g = c.getContext('2d')!;
  g.fillStyle = '#cc0000';
  g.beginPath();
  g.moveTo(90, 40); g.lineTo(1004, 40); g.lineTo(934, 280); g.lineTo(20, 280);
  g.closePath();
  g.fill();
  g.fillStyle = '#a30000';
  g.beginPath();
  g.moveTo(820, 40); g.lineTo(1004, 40); g.lineTo(934, 280); g.lineTo(750, 280);
  g.closePath();
  g.fill();
  g.fillStyle = '#ffffff';
  g.font = font;
  g.textBaseline = 'middle';
  g.fillText('PITCAR', 120, 168);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Number plate carrying the real Pitcar logo. */
async function plateTexture() {
  const img = new Image();
  img.src = logoPitcar.src;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 512, 160);
  g.strokeStyle = '#111112';
  g.lineWidth = 8;
  g.strokeRect(6, 6, 500, 148);
  const h = 104;
  const w = (img.naturalWidth / img.naturalHeight) * h;
  g.drawImage(img, (512 - w) / 2, (160 - h) / 2, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export interface TagPosition {
  id: AreaId;
  x: number;
  y: number;
  visible: boolean;
}

export interface Stage {
  setArea(id: AreaId | null): void;
}

export async function createStage(canvas: HTMLCanvasElement, onTags: (tags: TagPosition[]) => void): Promise<Stage | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key, key.target);
  // Red back light and underglow exist at night only: daylight has no signage to cast them.
  const rim = new THREE.DirectionalLight(0xff2a1a, 0);
  scene.add(rim, rim.target);
  const underglow = new THREE.PointLight(0xcc0000, 0, 6, 1.6);
  scene.add(underglow);

  const camera = new THREE.PerspectiveCamera(FOV, 2, 0.05, 80);
  const mats = makeMats();
  const active = mats.active as THREE.MeshStandardMaterial;
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xc9ccd1, metalness: 0.7, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.08,
    transparent: true, side: THREE.DoubleSide,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0c1014, metalness: 0.3, roughness: 0.04, transparent: true, side: THREE.DoubleSide, depthWrite: false,
  });
  const xray = makeShellMaterial();
  const line = new THREE.LineBasicMaterial({ color: 0xa8a29e, transparent: true });
  const body: BodyMats = { paint, glass, xray, line };

  const car = buildCar('efi', true, mats, body);
  car.group.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
  });
  // The shell casts a shadow but takes none: a see-through body would show acne.
  car.group.children[0].receiveShadow = false;
  car.group.children[1].castShadow = car.group.children[1].receiveShadow = false;
  scene.add(car.group);

  // The scanned body replaces the generated shell; the generated systems stay inside it.
  // If the file fails to load, the generated shell simply remains.
  const trim: THREE.Material[] = [];
  try {
    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(MODEL_URL);
    const model = gltf.scene;
    model.rotation.y = MODEL_YAW;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const holder = new THREE.Group();
    holder.add(model);
    holder.scale.setScalar(BODY_LENGTH / size.x);
    box.setFromObject(holder);
    const mid = box.getCenter(new THREE.Vector3());
    holder.position.set(BODY_LENGTH / 2 - mid.x, -box.min.y, -mid.z);
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = (m.material as THREE.Material).name;
      m.castShadow = true;
      m.renderOrder = 2;
      if (name === MODEL_PAINT) m.material = paint;
      else if (name === MODEL_GLASS) m.material = glass;
      else {
        const mat = m.material as THREE.Material;
        mat.transparent = true;
        trim.push(mat);
      }
    });
    car.group.children.forEach((child) => (child.visible = !!child.userData.slot));
    scene.add(holder);
    holder.updateMatrixWorld(true);

    let skin: THREE.Mesh | null = null;
    model.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && (o as THREE.Mesh).material === paint) skin = o as THREE.Mesh;
    });
    if (skin) {
      const [livery, plate] = await Promise.all([liveryTexture(), plateTexture()]);
      const stick = (map: THREE.Texture, at: V3, turnY: number, size: V3) => {
        const mat = new THREE.MeshStandardMaterial({
          map, transparent: true, roughness: 0.45, metalness: 0.1,
          polygonOffset: true, polygonOffsetFactor: -4, depthWrite: false,
        });
        const decal = new THREE.Mesh(
          new DecalGeometry(skin!, new THREE.Vector3(...at), new THREE.Euler(0, turnY, 0), new THREE.Vector3(...size)),
          mat,
        );
        decal.renderOrder = 3;
        scene.add(decal);
        trim.push(mat);
      };
      const side = BODY_WIDTH / 2;
      stick(livery, [2.15, 0.78, side], 0, [1.9, 0.6, 0.5]);
      stick(livery, [2.15, 0.78, -side], Math.PI, [1.9, 0.6, 0.5]);
      // Plates are flat cards, so they sit just proud of the bumpers instead of being projected.
      const bounds = new THREE.Box3().setFromObject(holder);
      const card = (x: number, y: number, turnY: number) => {
        const mat = new THREE.MeshStandardMaterial({ map: plate, transparent: true, roughness: 0.5 });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.145), mat);
        mesh.position.set(x, y, 0);
        mesh.rotation.y = turnY;
        mesh.renderOrder = 3;
        scene.add(mesh);
        trim.push(mat);
      };
      card(bounds.max.x + 0.004, 0.46, Math.PI / 2);
      card(bounds.min.x - 0.004, 0.74, -Math.PI / 2);
    }
  } catch {
    trim.length = 0;
  }

  const shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(car.center.x, 0, 0);
  floor.scale.setScalar(car.radius * 5);
  scene.add(floor);

  key.position.copy(car.center).addScaledVector(LIGHT_DIR, car.radius * 6);
  key.target.position.copy(car.center);
  const sc = key.shadow.camera;
  sc.left = sc.bottom = -car.radius * 1.5;
  sc.right = sc.top = car.radius * 1.5;
  sc.near = car.radius;
  sc.far = car.radius * 12;
  sc.updateProjectionMatrix();
  rim.position.copy(car.center).add(new THREE.Vector3(-car.radius * 3, car.radius * 1.2, -car.radius * 4));
  rim.target.position.copy(car.center);
  underglow.position.set(car.center.x, 0.12, 0);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const view = { yaw: REST.yaw - 0.5, pitch: REST.pitch, solid: 1, tint: 0 };
  const goal = { ...REST, solid: 1, tint: 0 };
  let area: AreaId | null = null;
  let frame = 0;
  let last = 0;
  let dark = false;
  const basePaint = new THREE.Color();
  const signal = new THREE.Color();

  function applyTheme() {
    dark = document.documentElement.classList.contains('dark');
    const css = getComputedStyle(document.documentElement);
    const token = (name: string) => new THREE.Color(css.getPropertyValue(name).trim());
    signal.copy(token(dark ? '--lv-signal-fill' : '--lv-signal'));
    active.color.copy(signal);
    active.emissive.copy(signal);
    active.emissiveIntensity = dark ? 0.7 : 0.35;
    basePaint.set(dark ? 0x30333a : 0xc9ccd1);
    xray.uniforms.uColor.value.copy(token('--lv-ink-2'));
    xray.uniforms.uFace.value = dark ? 0.045 : 0.08;
    xray.uniforms.uRim.value = dark ? 0.6 : 0.75;
    line.color.copy(token('--lv-ink-2'));
    shadowMat.opacity = dark ? 0.6 : 0.3;
    underglow.intensity = dark ? 5 : 0;
    rim.intensity = dark ? 3.2 : 0;
    scene.environmentIntensity = dark ? 0.8 : 1.05;
    renderer.toneMappingExposure = dark ? 1.15 : 0.95;
    invalidate();
  }

  function frameCamera() {
    const v = THREE.MathUtils.degToRad(FOV) / 2;
    const h = Math.atan(Math.tan(v) * camera.aspect);
    // The car is far longer than it is tall: fit length to width and height to height.
    const dist = Math.max((car.radius * 0.94) / Math.tan(h), (car.center.y * 2.05) / Math.tan(v));
    camera.position.set(
      car.center.x + dist * Math.sin(view.yaw) * Math.cos(view.pitch),
      car.center.y + dist * Math.sin(view.pitch),
      car.center.z + dist * Math.cos(view.yaw) * Math.cos(view.pitch),
    );
    camera.lookAt(car.center);
  }

  const probe = new THREE.Vector3();
  function projectTags() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    onTags((Object.keys(VIEWS) as AreaId[]).map((id) => {
      probe.set(...VIEWS[id].tag).project(camera);
      return { id, x: (probe.x * 0.5 + 0.5) * w, y: (-probe.y * 0.5 + 0.5) * h, visible: probe.z < 1 };
    }));
  }

  function tick(now: number) {
    frame = 0;
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    let moving = false;
    const approach = (from: number, to: number, speed = 7) => {
      if (reduce.matches || Math.abs(to - from) < 0.0005) return to;
      moving = true;
      return from + (to - from) * (1 - Math.exp(-speed * dt));
    };
    view.yaw = approach(view.yaw, goal.yaw);
    view.pitch = approach(view.pitch, goal.pitch);
    view.solid = approach(view.solid, goal.solid, 4.5);
    view.tint = approach(view.tint, goal.tint, 4.5);

    paint.opacity = 0.05 + 0.95 * view.solid;
    paint.depthWrite = view.solid > 0.97;
    paint.color.copy(basePaint).lerp(signal, view.tint * (dark ? 0.55 : 0.7));
    glass.opacity = 0.06 + 0.6 * view.solid;
    trim.forEach((mat) => {
      mat.opacity = 0.1 + 0.9 * view.solid;
      mat.depthWrite = view.solid > 0.97;
    });
    xray.uniforms.uFade.value = 1 - view.solid;
    line.opacity = 1 - 0.75 * view.solid;

    frameCamera();
    renderer.render(scene, camera);
    projectTags();
    if (moving) invalidate();
    else last = 0;
  }

  function invalidate() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    invalidate();
  }

  const turn = (dYaw: number, dPitch: number) => {
    goal.yaw += dYaw;
    goal.pitch = Math.min(1.1, Math.max(0.03, goal.pitch + dPitch));
    invalidate();
  };

  let drag: { id: number; x: number; y: number } | null = null;
  canvas.addEventListener('pointerdown', (ev) => {
    drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY };
    canvas.setPointerCapture(ev.pointerId);
    canvas.style.cursor = 'grabbing';
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!drag || ev.pointerId !== drag.id) return;
    turn(-(ev.clientX - drag.x) * 0.008, (ev.clientY - drag.y) * 0.006);
    drag.x = ev.clientX;
    drag.y = ev.clientY;
  });
  const release = (ev: PointerEvent) => {
    if (!drag || ev.pointerId !== drag.id) return;
    drag = null;
    canvas.style.cursor = 'grab';
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('keydown', (ev) => {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-0.2, 0], ArrowRight: [0.2, 0], ArrowUp: [0, 0.12], ArrowDown: [0, -0.12],
    };
    const d = step[ev.key];
    if (!d) return;
    ev.preventDefault();
    turn(d[0], d[1]);
  });

  applyTheme();
  resize();
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  canvas.style.cursor = 'grab';

  return {
    setArea(next) {
      if (area) VIEWS[area].slots.forEach((slot) => setActive(car.parts.get(slot)!, false, active));
      area = next;
      const v = next ? VIEWS[next] : null;
      v?.slots.forEach((slot) => setActive(car.parts.get(slot)!, true, active));
      goal.yaw = v?.yaw ?? REST.yaw;
      goal.pitch = v?.pitch ?? REST.pitch;
      // Bodywork is the shell itself, so it stays painted and takes the signal colour instead.
      goal.solid = v && v.slots.length ? 0 : 1;
      goal.tint = next === 'bodi' ? 1 : 0;
      invalidate();
    },
  };
}
