import { type AreaId, BERKALA, KM_MAX, KM_MIN, km, paketUntuk, pesanGejala, pesanServis, waLink } from '~/data/diagnosa';
import type { Stage } from './scene';

const $$ = <T extends Element>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T>(sel));

let mobil = '';
let kmPilihan: number | null = null;

function refreshLinks() {
  $$<HTMLAnchorElement>(document, '[data-wa-gejala]').forEach((a) => {
    a.href = waLink(pesanGejala(a.dataset.area!, a.dataset.judul!, mobil, kmPilihan));
  });
  const servis = document.querySelector<HTMLAnchorElement>('[data-wa-servis]');
  const range = document.querySelector<HTMLInputElement>('#odo-range');
  if (servis && range) servis.href = waLink(pesanServis(Number(range.value), mobil));
}

function initDiagnosa(root: HTMLElement) {
  if (root.dataset.ready) return;
  root.dataset.ready = '1';

  const plates = $$<HTMLButtonElement>(root, '[data-area]');
  const tags = $$<HTMLButtonElement>(root, '[data-tag]');
  const panels = $$<HTMLElement>(root, '[data-panel]');
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const stageEl = root.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const note = root.querySelector<HTMLElement>('[data-note]')!;
  let stage: Stage | null = null;
  let current: AreaId | null = null;

  function select(id: AreaId | null, scroll = true) {
    current = id;
    [...plates, ...tags].forEach((b) => {
      const own = (b.dataset.area ?? b.dataset.tag) === id;
      b.setAttribute('aria-pressed', String(own));
    });
    panels.forEach((p) => (p.hidden = p.dataset.panel !== id));
    empty.hidden = id !== null;
    stage?.setArea(id);
    const open = panels.find((p) => !p.hidden);
    if (open && scroll && open.getBoundingClientRect().top > window.innerHeight * 0.7) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      open.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
    }
  }

  const toggle = (id: AreaId) => select(current === id ? null : id);
  plates.forEach((b) => b.addEventListener('click', () => toggle(b.dataset.area as AreaId)));
  tags.forEach((b) => b.addEventListener('click', () => toggle(b.dataset.tag as AreaId)));

  const fields = $$<HTMLInputElement>(root, '[data-mobil]');
  fields.forEach((field) =>
    field.addEventListener('input', () => {
      mobil = field.value.trim();
      // Every area panel carries the same field, so they stay in step.
      fields.forEach((other) => other !== field && (other.value = field.value));
      refreshLinks();
    }),
  );

  const start = async () => {
    try {
      const { createStage } = await import('./scene');
      stage = await createStage(canvas, (positions) => {
        positions.forEach((p) => {
          const tag = tags.find((t) => t.dataset.tag === p.id);
          if (!tag) return;
          tag.hidden = !p.visible;
          tag.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        });
      });
      if (!stage) throw new Error('webgl');
      stageEl.classList.add('is-live');
      note.textContent = 'Geser mobil untuk memutarnya';
      stage.setArea(current);
    } catch {
      note.textContent = 'Model 3D tidak bisa dimuat di perangkat ini. Pilih bagian dari daftar di bawah.';
    }
  };
  // The model waits for idle time so the contact links and text are usable first.
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 });
  else setTimeout(start, 600);
}

function initOdometer(root: HTMLElement) {
  if (root.dataset.ready) return;
  root.dataset.ready = '1';

  const range = root.querySelector<HTMLInputElement>('input[type="range"]')!;
  const drums = $$<HTMLElement>(root, '[data-drum]');
  const rows = $$<HTMLElement>(root, '[data-tiap]');
  const pack = root.querySelector<HTMLElement>('[data-paket]')!;
  const cta = root.querySelector<HTMLAnchorElement>('[data-wa-servis]')!;
  const ctaText = root.querySelector<HTMLElement>('[data-wa-servis-text]')!;

  function render(touched: boolean) {
    const value = Number(range.value);
    const digits = String(value).padStart(drums.length, '0');
    let leading = true;
    drums.forEach((d, i) => {
      leading = leading && digits[i] === '0';
      d.textContent = digits[i];
      d.classList.toggle('is-zero', leading);
    });
    range.style.setProperty('--fill', `${((value - KM_MIN) / (KM_MAX - KM_MIN)) * 100}%`);
    range.setAttribute('aria-valuetext', `${km(value)} kilometer`);
    rows.forEach((row, i) => {
      const tiap = BERKALA[i].tiap;
      const due = value % tiap === 0;
      row.classList.toggle('is-due', due);
      row.querySelector('[data-when]')!.textContent = due ? 'Waktunya' : `Berikutnya di ${km(Math.ceil(value / tiap) * tiap)} km`;
    });
    pack.textContent = paketUntuk(value);
    ctaText.textContent = `Booking servis ${km(value)} km`;
    cta.href = waLink(pesanServis(value, mobil));
    if (touched) {
      kmPilihan = value;
      refreshLinks();
    }
  }

  range.addEventListener('input', () => render(true));
  render(false);
}

function init() {
  document.querySelectorAll<HTMLElement>('[data-diagnosa]').forEach(initDiagnosa);
  document.querySelectorAll<HTMLElement>('[data-odometer]').forEach(initOdometer);
}

document.addEventListener('astro:page-load', init);
