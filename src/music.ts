/**
 * "Crumbling Maze 🧀 — No Way Back"
 * Whimsical Lo-Fi Cozy Adventure Soundtrack
 *
 * Fully synthesized via Web Audio API — seamless ~2.6 minute loop (64 measures @ 96 BPM).
 * Features:
 *  - Warm Electric Piano / Rhodes chords
 *  - Soft Marimba / Kalimba tiptoe melodies
 *  - Cute Pizzicato Strings bassline
 *  - Delicate Music Box / Bell sparkles
 *  - Playful 8-bit Chiptune counter-motifs
 *  - Gentle Lo-Fi brush & soft woodblock rhythm
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let isMuted = false;
let scheduleTimer: number | null = null;

const BPM = 96;
const BEAT = 60 / BPM; // ~0.625s
const MEASURE = BEAT * 4; // ~2.5s
const TOTAL_MEASURES = 64; // ~160s (2m 40s) seamless loop
const LOOKAHEAD = 0.25; // seconds to schedule ahead
const SCHEDULE_INTERVAL = 100; // ms between schedule checks

let loopStartTime = 0;
let currentMeasure = 0;
let scheduledUpTo = 0;

// Helper: MIDI note to frequency
const m2f = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Standard note definitions
const C2 = 36, Cs2 = 37, D2 = 38, Eb2 = 39, E2 = 40, F2 = 41, Fs2 = 42, G2 = 43, Ab2 = 44, A2 = 45, Bb2 = 46, B2 = 47;
const C3 = 48, Cs3 = 49, D3 = 50, Eb3 = 51, E3 = 52, F3 = 53, Fs3 = 54, G3 = 55, Ab3 = 56, A3 = 57, Bb3 = 58, B3 = 59;
const C4 = 60, Cs4 = 61, D4 = 62, Eb4 = 63, E4 = 64, F4 = 65, Fs4 = 66, G4 = 67, Ab4 = 68, A4 = 69, Bb4 = 70, B4 = 71;
const C5 = 72, Cs5 = 73, D5 = 74, Eb5 = 75, E5 = 76, F5 = 77, Fs5 = 78, G5 = 79, Ab5 = 80, A5 = 81, Bb5 = 82, B5 = 83;
const C6 = 84, Cs6 = 85, D6 = 86, Eb6 = 87, E6 = 88, F6 = 89, Fs6 = 90, G6 = 91, Ab6 = 92, A6 = 93, Bb6 = 94, B6 = 95;
void [Cs2, D2, Eb2, Fs2, B2, Cs4, Ab5, Cs6, Eb6, F6, Fs6, Ab6, Bb6, B6]; // prevent unused variable warnings

function getAudioContext(): AudioContext {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : 0.24, ctx.currentTime);
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

/* =========================================================================
   SYNTHESIZERS (WARM, COZY, WHIMSICAL)
   ========================================================================= */

// 1. Warm Electric Piano (Rhodes-like dual detuned sine/triangle with soft warm attack)
function playRhodesChord(notes: number[], time: number, duration: number, vol = 0.08) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  notes.forEach((midi, idx) => {
    const freq = m2f(midi);
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(600, time + duration);

    const noteVol = vol * (0.85 + (idx % 2) * 0.15);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(noteVol, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(noteVol * 0.5, time + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(targetGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.25);
    osc2.stop(time + duration + 0.25);
  });
}

// 2. Soft Marimba / Kalimba (Wooden pop with fast mallet click & warm resonance)
function playMarimbaNote(midi: number, time: number, vol = 0.09) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const freq = m2f(midi);
  const osc = audioCtx.createOscillator();
  const overtone = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.12, time);
  osc.frequency.exponentialRampToValueAtTime(freq, time + 0.018);

  overtone.type = 'sine';
  overtone.frequency.setValueAtTime(freq * 3.9, time);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(Math.min(freq * 1.5, 3000), time);
  filter.Q.value = 1.8;

  const oGain = audioCtx.createGain();
  oGain.gain.setValueAtTime(vol * 0.4, time);
  oGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);

  osc.connect(gain);
  overtone.connect(oGain);
  oGain.connect(gain);
  gain.connect(targetGain);

  osc.start(time);
  overtone.start(time);
  osc.stop(time + 0.5);
  overtone.stop(time + 0.1);
}

// 3. Pizzicato Strings / Sneaky Mouse Bass (Staccato round plucked feel)
function playPizzicato(midi: number, time: number, vol = 0.12) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const freq = m2f(midi);
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, time);
  filter.frequency.exponentialRampToValueAtTime(220, time + 0.16);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(targetGain);

  osc.start(time);
  osc.stop(time + 0.3);
}

// 4. Delicate Music Box / Bell (Magical sparkling cheese discovery chime)
function playBellNote(midi: number, time: number, vol = 0.04) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const freq = m2f(midi);
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2.76, time);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.9);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(targetGain);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + 0.95);
  osc2.stop(time + 0.95);
}

// 5. Playful 8-Bit Chiptune Arpeggios (Cozy nostalgic Game Boy sparkles)
function playChiptune(midi: number, time: number, vol = 0.022) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const freq = m2f(midi);
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, time);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(targetGain);

  osc.start(time);
  osc.stop(time + 0.12);
}

// 6. Gentle Lo-Fi Shaker / Brush (Soft rhythmic pulse)
function playBrush(time: number, vol = 0.018) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const bufferSize = Math.floor(audioCtx.sampleRate * 0.04);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(4500, time);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.038);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(targetGain);

  noise.start(time);
}

// 7. Soft Lo-Fi Kick (Warm pillow heartbeat on beats 1 and 3)
function playSoftKick(time: number, vol = 0.065) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, time);
  osc.frequency.exponentialRampToValueAtTime(36, time + 0.07);

  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

  osc.connect(gain);
  gain.connect(targetGain);

  osc.start(time);
  osc.stop(time + 0.14);
}

// 8. Soft Tiptoe Woodblock (Mouse sneak step on beats 2 & 4)
function playWoodblock(time: number, vol = 0.028) {
  if (!masterGain || !ctx) return;
  const audioCtx = ctx;
  const targetGain = masterGain;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(820, time);
  osc.frequency.exponentialRampToValueAtTime(620, time + 0.025);

  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

  osc.connect(gain);
  gain.connect(targetGain);

  osc.start(time);
  osc.stop(time + 0.045);
}

/* =========================================================================
   64-MEASURE MUSICAL PROGRESSION (SEAMLESS 2.6 MINUTE COZY ADVENTURE)
   ========================================================================= */

interface MeasureScore {
  chord: number[];
  bass: number;
  melody?: { beat: number; note: number; len?: number }[];
  bells?: { beat: number; note: number }[];
  chiptune?: { beat: number; note: number }[];
}

// Harmonious, whimsical 64-measure composition:
// Part 1: "The Curious Mouse" (1-16)
// Part 2: "Crumbling Steps & Cheese Heist" (17-32)
// Part 3: "Underground Cheese Kingdom" (33-48)
// Part 4: "No Way Back / Tiptoeing to Safety" (49-64 -> loops to 1)

const SCORES: MeasureScore[] = [
  // --- SECTION 1: THE CURIOUS MOUSE ---
  // M1: Fmaj7
  { chord: [F3, C4, E4, A4], bass: F2, melody: [{ beat: 0, note: A4 }, { beat: 1.5, note: C5 }, { beat: 2.5, note: B4 }] },
  // M2: G6
  { chord: [G3, B3, D4, E4], bass: G2, melody: [{ beat: 0, note: G4 }, { beat: 2, note: E5 }, { beat: 3, note: D5 }] },
  // M3: Em7
  { chord: [E3, G3, B3, D4], bass: E2, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: G4 }, { beat: 3, note: A4 }] },
  // M4: Am7
  { chord: [A3, C4, E4, G4], bass: A2, melody: [{ beat: 0, note: E4 }, { beat: 2, note: G4 }, { beat: 3, note: A4 }] },
  // M5: Dm9 (Melody steps forward)
  { chord: [D3, F3, A3, C4, E4], bass: D3, melody: [{ beat: 0, note: C5 }, { beat: 1, note: D5 }, { beat: 2, note: C5 }, { beat: 3, note: A4 }], bells: [{ beat: 3, note: E6 }] },
  // M6: G7sus4 -> G7
  { chord: [G3, C4, D4, F4], bass: G2, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: G4 }, { beat: 2.5, note: A4 }, { beat: 3.5, note: B4 }] },
  // M7: Cmaj9
  { chord: [C3, E3, G3, B3, D4], bass: C3, melody: [{ beat: 0, note: C5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: D5 }] },
  // M8: C7 (turnaround)
  { chord: [C3, E3, G3, Bb3], bass: C2, melody: [{ beat: 0, note: Bb4 }, { beat: 2, note: A4 }, { beat: 3, note: G4 }], bells: [{ beat: 2, note: C6 }] },

  // M9: Fmaj7 (Whimsical kalimba enters)
  { chord: [F3, C4, E4, A4], bass: F2, melody: [{ beat: 0, note: A4 }, { beat: 1, note: C5 }, { beat: 2, note: E5 }, { beat: 3, note: D5 }] },
  // M10: G6
  { chord: [G3, B3, D4, E4], bass: G2, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: G5 }] },
  // M11: Em7
  { chord: [E3, G3, B3, D4], bass: E2, melody: [{ beat: 0, note: E5 }, { beat: 1, note: D5 }, { beat: 2, note: B4 }, { beat: 3, note: G4 }] },
  // M12: Am9
  { chord: [A3, C4, E4, B4], bass: A2, melody: [{ beat: 0, note: A4 }, { beat: 2, note: C5 }, { beat: 3, note: B4 }] },
  // M13: Dm7
  { chord: [D3, F3, A3, C4], bass: D3, melody: [{ beat: 0, note: F4 }, { beat: 1, note: A4 }, { beat: 2, note: C5 }, { beat: 3, note: D5 }], bells: [{ beat: 2, note: A5 }] },
  // M14: G7
  { chord: [G3, B3, D4, F4], bass: G2, melody: [{ beat: 0, note: E5 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: C5 }] },
  // M15: Cmaj9
  { chord: [C3, E3, G3, B3, D4], bass: C3, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: C5 }, { beat: 3, note: D5 }] },
  // M16: Cmaj7
  { chord: [C3, E3, G3, B3], bass: C3, melody: [{ beat: 0, note: C5 }], bells: [{ beat: 0, note: E6 }, { beat: 2, note: G6 }] },

  // --- SECTION 2: CRUMBLING STEPS & CHEESE HEIST (8-bit chiptune counter-motifs join) ---
  // M17: D7
  { chord: [D3, Fs3, A3, C4], bass: D3, chiptune: [{ beat: 0, note: Fs4 }, { beat: 0.5, note: A4 }, { beat: 1, note: C5 }, { beat: 1.5, note: E5 }], melody: [{ beat: 0, note: D5 }, { beat: 2, note: C5 }] },
  // M18: Gm7
  { chord: [G3, Bb3, D4, F4], bass: G2, chiptune: [{ beat: 0, note: D4 }, { beat: 0.5, note: G4 }, { beat: 1, note: Bb4 }, { beat: 1.5, note: D5 }], melody: [{ beat: 0, note: Bb4 }, { beat: 2, note: A4 }, { beat: 3, note: G4 }] },
  // M19: C7
  { chord: [C3, E3, G3, Bb3], bass: C3, melody: [{ beat: 0, note: G4 }, { beat: 1.5, note: Bb4 }, { beat: 2.5, note: C5 }] },
  // M20: Fmaj7
  { chord: [F3, A3, C4, E4], bass: F2, melody: [{ beat: 0, note: A4 }, { beat: 2, note: C5 }, { beat: 3, note: E5 }], bells: [{ beat: 2, note: C6 }] },
  // M21: Fm7 (Magical modal interchange)
  { chord: [F3, Ab3, C4, Eb4], bass: F2, melody: [{ beat: 0, note: Eb5 }, { beat: 1.5, note: C5 }, { beat: 2.5, note: Ab4 }] },
  // M22: Bb7
  { chord: [Bb2, D3, F3, Ab3], bass: Bb2, melody: [{ beat: 0, note: F4 }, { beat: 1.5, note: Ab4 }, { beat: 2.5, note: D5 }] },
  // M23: Ebmaj7
  { chord: [Eb3, G3, Bb3, D4], bass: Eb3, melody: [{ beat: 0, note: D5 }, { beat: 1.5, note: Bb4 }, { beat: 2.5, note: G4 }] },
  // M24: Abmaj7 (Delicious cozy surprise)
  { chord: [Ab2, C3, Eb3, G3], bass: Ab2, melody: [{ beat: 0, note: G4 }, { beat: 2, note: C5 }, { beat: 3, note: Eb5 }], bells: [{ beat: 3, note: G6 }] },

  // M25: Dm7
  { chord: [D3, F3, A3, C4], bass: D3, chiptune: [{ beat: 0, note: F4 }, { beat: 0.5, note: A4 }, { beat: 1, note: C5 }, { beat: 1.5, note: E5 }], melody: [{ beat: 0, note: F5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: D5 }] },
  // M26: G7
  { chord: [G3, B3, D4, F4], bass: G2, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: F5 }] },
  // M27: Em7
  { chord: [E3, G3, B3, D4], bass: E2, melody: [{ beat: 0, note: G5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: B4 }] },
  // M28: A7
  { chord: [A2, Cs3, E3, G3], bass: A2, melody: [{ beat: 0, note: Cs5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: A4 }], bells: [{ beat: 2, note: E6 }] },
  // M29: Dm9
  { chord: [D3, F3, A3, C4, E4], bass: D3, melody: [{ beat: 0, note: C5 }, { beat: 1, note: D5 }, { beat: 2, note: E5 }, { beat: 3, note: F5 }] },
  // M30: G13
  { chord: [G3, B3, E4, F4], bass: G2, melody: [{ beat: 0, note: E5 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: C5 }] },
  // M31: Cmaj9
  { chord: [C3, E3, G3, B3, D4], bass: C3, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: C5 }] },
  // M32: C7sus4
  { chord: [C3, F3, G3, Bb3], bass: C3, melody: [{ beat: 0, note: C5 }, { beat: 2, note: Bb4 }, { beat: 3, note: G4 }], bells: [{ beat: 3, note: C6 }] },

  // --- SECTION 3: UNDERGROUND CHEESE KINGDOM (Full lush harmonies & sparkling bells) ---
  // M33: Fmaj9
  { chord: [F3, A3, C4, E4, G4], bass: F2, melody: [{ beat: 0, note: G5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: C5 }] },
  // M34: Em7
  { chord: [E3, G3, B3, D4], bass: E2, melody: [{ beat: 0, note: D5 }, { beat: 1.5, note: B4 }, { beat: 2.5, note: G4 }] },
  // M35: Dm9
  { chord: [D3, F3, A3, C4, E4], bass: D3, melody: [{ beat: 0, note: E5 }, { beat: 1, note: F5 }, { beat: 2, note: E5 }, { beat: 3, note: D5 }] },
  // M36: Cmaj7
  { chord: [C3, E3, G3, B3], bass: C3, melody: [{ beat: 0, note: C5 }, { beat: 2, note: B4 }, { beat: 3, note: G4 }], bells: [{ beat: 2, note: E6 }] },
  // M37: Bbmaj9
  { chord: [Bb2, D3, F3, A3, C4], bass: Bb2, melody: [{ beat: 0, note: C5 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: F5 }] },
  // M38: Am7
  { chord: [A3, C4, E4, G4], bass: A2, melody: [{ beat: 0, note: E5 }, { beat: 1.5, note: C5 }, { beat: 2.5, note: A4 }] },
  // M39: Abmaj7
  { chord: [Ab2, C3, Eb3, G3], bass: Ab2, melody: [{ beat: 0, note: G4 }, { beat: 1.5, note: Bb4 }, { beat: 2.5, note: C5 }] },
  // M40: Gsus4 -> G
  { chord: [G3, C4, D4, G4], bass: G2, melody: [{ beat: 0, note: D5 }, { beat: 2, note: B4 }], bells: [{ beat: 0, note: G6 }, { beat: 2, note: D6 }] },

  // M41: Fmaj9
  { chord: [F3, A3, C4, E4, G4], bass: F2, chiptune: [{ beat: 0, note: A4 }, { beat: 0.5, note: C5 }, { beat: 1, note: E5 }, { beat: 1.5, note: G5 }], melody: [{ beat: 0, note: A5 }, { beat: 1.5, note: G5 }, { beat: 2.5, note: E5 }] },
  // M42: G/F
  { chord: [F3, B3, D4, G4], bass: F2, melody: [{ beat: 0, note: D5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: G5 }] },
  // M43: Em7
  { chord: [E3, G3, B3, D4], bass: E2, melody: [{ beat: 0, note: B5 }, { beat: 1.5, note: G5 }, { beat: 2.5, note: E5 }] },
  // M44: Am9
  { chord: [A3, C4, E4, B4], bass: A2, melody: [{ beat: 0, note: A5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: C5 }], bells: [{ beat: 2, note: C6 }] },
  // M45: Dm9
  { chord: [D3, F3, A3, C4, E4], bass: D3, melody: [{ beat: 0, note: E5 }, { beat: 1, note: F5 }, { beat: 2, note: A5 }, { beat: 3, note: G5 }] },
  // M46: Fm6 (Bittersweet cozy warmth)
  { chord: [F3, Ab3, C4, D4], bass: F2, melody: [{ beat: 0, note: F5 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: C5 }] },
  // M47: Cmaj9
  { chord: [C3, E3, G3, B3, D4], bass: C3, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: C5 }, { beat: 3, note: E5 }] },
  // M48: A7b9
  { chord: [A2, Cs3, G3, Bb3], bass: A2, melody: [{ beat: 0, note: Cs5 }, { beat: 2, note: E5 }], bells: [{ beat: 3, note: A6 }] },

  // --- SECTION 4: NO WAY BACK / TIPTOEING TO SAFETY (Uplifting resolution & seamless turnaround) ---
  // M49: Dm7
  { chord: [D3, F3, A3, C4], bass: D3, melody: [{ beat: 0, note: F4 }, { beat: 1, note: A4 }, { beat: 2, note: C5 }, { beat: 3, note: D5 }] },
  // M50: G7
  { chord: [G3, B3, D4, F4], bass: G2, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: G4 }] },
  // M51: Em7
  { chord: [E3, G3, B3, D4], bass: E2, melody: [{ beat: 0, note: G4 }, { beat: 1.5, note: B4 }, { beat: 2.5, note: E5 }] },
  // M52: Am7
  { chord: [A3, C4, E4, G4], bass: A2, melody: [{ beat: 0, note: C5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: A5 }], bells: [{ beat: 2, note: E6 }] },
  // M53: Dm7
  { chord: [D3, F3, A3, C4], bass: D3, melody: [{ beat: 0, note: F5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: D5 }] },
  // M54: G7
  { chord: [G3, B3, D4, F4], bass: G2, melody: [{ beat: 0, note: E5 }, { beat: 1.5, note: D5 }, { beat: 2.5, note: B4 }] },
  // M55: Cmaj7
  { chord: [C3, E3, G3, B3], bass: C3, melody: [{ beat: 0, note: C5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: G5 }] },
  // M56: C7
  { chord: [C3, E3, G3, Bb3], bass: C3, melody: [{ beat: 0, note: Bb5 }, { beat: 2, note: G5 }, { beat: 3, note: E5 }] },

  // M57: Fmaj7 (Triumph!)
  { chord: [F3, A3, C4, E4], bass: F2, melody: [{ beat: 0, note: A5 }, { beat: 1.5, note: C6 }, { beat: 2.5, note: A5 }] },
  // M58: F#dim7
  { chord: [Fs3, A3, C4, Eb4], bass: Fs3, melody: [{ beat: 0, note: Fs5 }, { beat: 1.5, note: A5 }, { beat: 2.5, note: C6 }] },
  // M59: C/G
  { chord: [G3, C4, E4, G4], bass: G2, melody: [{ beat: 0, note: G5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: C5 }] },
  // M60: A7
  { chord: [A2, Cs3, E3, G3], bass: A2, melody: [{ beat: 0, note: Cs5 }, { beat: 1.5, note: E5 }, { beat: 2.5, note: A4 }], bells: [{ beat: 2, note: A5 }] },
  // M61: Dm9
  { chord: [D3, F3, A3, C4, E4], bass: D3, melody: [{ beat: 0, note: C5 }, { beat: 1, note: D5 }, { beat: 2, note: E5 }, { beat: 3, note: F5 }] },
  // M62: G7sus4
  { chord: [G3, C4, D4, F4], bass: G2, melody: [{ beat: 0, note: G5 }, { beat: 1.5, note: F5 }, { beat: 2.5, note: D5 }] },
  // M63: G7
  { chord: [G3, B3, D4, F4], bass: G2, melody: [{ beat: 0, note: B4 }, { beat: 1.5, note: C5 }, { beat: 2.5, note: D5 }] },
  // M64: C/E -> Seamlessly leads back to Fmaj7 at M1!
  { chord: [E3, G3, C4, E4], bass: E2, melody: [{ beat: 0, note: E5 }, { beat: 2, note: G5 }], bells: [{ beat: 0, note: C6 }, { beat: 2, note: E6 }, { beat: 3.5, note: G6 }] },
];

/* =========================================================================
   SCHEDULER ENGINE (JITTER-FREE WEBAUDIO LOOKAHEAD)
   ========================================================================= */

function scheduleMeasure(measureIdx: number, startTime: number) {
  const score = SCORES[measureIdx % TOTAL_MEASURES];

  // 1. Warm Rhodes chord on Beat 0 and 2
  playRhodesChord(score.chord, startTime, BEAT * 1.8, 0.07);
  playRhodesChord(score.chord, startTime + BEAT * 2, BEAT * 1.8, 0.055);

  // 2. Pizzicato bass tiptoeing: root on Beat 0, fifth/octave on Beat 2
  playPizzicato(score.bass, startTime, 0.12);
  playPizzicato(score.bass + 7, startTime + BEAT * 2, 0.09);
  // Cute bounce on off-beat 3.5
  if (measureIdx % 2 === 1) {
    playPizzicato(score.bass, startTime + BEAT * 3.5, 0.07);
  }

  // 3. Gentle Lo-Fi Drums & Brush
  // Soft kick on beats 0 & 2
  playSoftKick(startTime, 0.06);
  playSoftKick(startTime + BEAT * 2, 0.045);

  // Soft woodblock tiptoes on beats 1 & 3
  playWoodblock(startTime + BEAT, 0.024);
  playWoodblock(startTime + BEAT * 3, 0.024);

  // Shaker on all 8th notes (1 & 2 & 3 & 4 &)
  for (let b = 0; b < 4; b++) {
    playBrush(startTime + BEAT * b, 0.015);
    playBrush(startTime + BEAT * (b + 0.5), 0.009); // softer offbeat
  }

  // 4. Soft Marimba / Kalimba Melody
  if (score.melody) {
    score.melody.forEach((m) => {
      playMarimbaNote(m.note, startTime + BEAT * m.beat, 0.085);
    });
  }

  // 5. Delicate Music Box Bells
  if (score.bells) {
    score.bells.forEach((bl) => {
      playBellNote(bl.note, startTime + BEAT * bl.beat, 0.04);
    });
  }

  // 6. Playful 8-Bit Chiptune Arpeggios
  if (score.chiptune) {
    score.chiptune.forEach((ch) => {
      playChiptune(ch.note, startTime + BEAT * ch.beat, 0.02);
    });
  }
}

function runScheduler() {
  if (!isPlaying || !ctx) return;

  const now = ctx.currentTime;
  while (scheduledUpTo < now + LOOKAHEAD) {
    scheduleMeasure(currentMeasure, scheduledUpTo);
    scheduledUpTo += MEASURE;
    currentMeasure = (currentMeasure + 1) % TOTAL_MEASURES;
  }
}

/* =========================================================================
   PUBLIC API
   ========================================================================= */

export const music = {
  /**
   * Starts or resumes the whimsical background soundtrack.
   * Seamlessly loops forever.
   */
  start: () => {
    const audioCtx = getAudioContext();
    if (isPlaying) return;
    isPlaying = true;

    loopStartTime = audioCtx.currentTime + 0.05;
    scheduledUpTo = loopStartTime;
    currentMeasure = 0;

    runScheduler();
    scheduleTimer = window.setInterval(runScheduler, SCHEDULE_INTERVAL);
  },

  /**
   * Pauses the music.
   */
  stop: () => {
    isPlaying = false;
    if (scheduleTimer !== null) {
      clearInterval(scheduleTimer);
      scheduleTimer = null;
    }
  },

  /**
   * Toggles or sets mute state with a smooth volume fade.
   */
  setMuted: (muted: boolean) => {
    isMuted = muted;
    if (!masterGain || !ctx) return;
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.24, now + 0.15);
  },

  /**
   * Check if music is currently active.
   */
  isPlaying: () => isPlaying,
};
