import { music } from "./music";

// All sounds are synthesized with WebAudio — no audio files needed.
let ctx: AudioContext | null = null;
let muted = false;
const ac = () => (ctx ??= new AudioContext());

export const setMuted = (m: boolean) => {
  muted = m;
  music.setMuted(m);
};

export { music };

function tone(f: number, d: number, type: OscillatorType = "square", vol = 0.06, to?: number, delay = 0) {
  if (muted) return;
  const c = ac();
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + d);
}

function noise(d: number, vol: number) {
  if (muted) return;
  const c = ac();
  const buf = c.createBuffer(1, c.sampleRate * d, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const s = c.createBufferSource();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  f.type = "bandpass";
  f.frequency.value = 900;
  g.gain.value = vol;
  s.buffer = buf;
  s.connect(f).connect(g).connect(c.destination);
  s.start();
}

export const sfx = {
  step: () => tone(520 + Math.random() * 120, 0.07, "square", 0.05, 800),
  bump: () => tone(130, 0.12, "sawtooth", 0.07, 70),
  crumble: () => noise(0.28, 0.25),
  coin: () => {
    tone(988, 0.08, "square", 0.05);
    tone(1319, 0.2, "square", 0.05, undefined, 0.08);
  },
  fall: () => tone(1000, 0.8, "sine", 0.1, 60),
  sadTrombone: () => {
    [311, 294, 277].forEach((f, i) => tone(f, 0.35, "sawtooth", 0.06, undefined, 0.9 + i * 0.35));
    tone(262, 0.8, "sawtooth", 0.06, 200, 1.95);
  },
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, "triangle", 0.1, undefined, i * 0.1)),
};
