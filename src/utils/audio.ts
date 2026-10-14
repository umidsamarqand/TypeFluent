import { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(soundType: SoundType, volume: number = 0.5, isError: boolean = false) {
  if (soundType === 'off' || volume <= 0) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, now);
    masterGain.connect(ctx.destination);

    if (isError) {
      // Soft dull thud for errors
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
      return;
    }

    if (soundType === 'clicky') {
      // Cherry MX Blue style tactile snap
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      const baseFreq = 2200 + Math.random() * 400;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);
      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.022);

      // Bottom out resonance
      const osc2 = ctx.createOscillator();
      const osc2Gain = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(320 + Math.random() * 40, now);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.035);
      osc2Gain.gain.setValueAtTime(0.2, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc2.connect(osc2Gain);
      osc2Gain.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + 0.04);
    } else if (soundType === 'thock') {
      // Deep lubricated linear switch bottom-out
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const freq = 180 + Math.random() * 30;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.065);

      // Add brief acoustic noise click
      const bufferSize = ctx.sampleRate * 0.01;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1200, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, now);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
    } else if (soundType === 'box_navy') {
      // Box Navy heavy click bar: pre-click then bottom-out
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.012);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.018);

      // Second bottom out snap
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(450, now + 0.008);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.035);
      gain2.gain.setValueAtTime(0.35, now + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now + 0.008);
      osc2.stop(now + 0.045);
    } else if (soundType === 'bubble') {
      // Gentle water drop / soft pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const f = 600 + Math.random() * 150;
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f * 1.8, now + 0.025);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.045);
    }
  } catch {
    // Audio context was blocked or not yet permitted by gesture
  }
}
