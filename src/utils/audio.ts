// Web Audio API Synthesizer & Speech Synthesis for Kak Bintang (Karakter Siswa Laki-Laki)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Cheerful twinkle sound for stars earned
 */
export function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Pentatonic scale frequencies: C5, E5, G5, A5, C6
    const freqs = [523.25, 659.25, 783.99, 880.0, 1046.5];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

/**
 * Cheerful fanfare for badge unlock or valid journal
 */
export function playSuccessFanfare() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [
      { freq: 440.0, start: 0, dur: 0.12 }, // A4
      { freq: 554.37, start: 0.12, dur: 0.12 }, // C#5
      { freq: 659.25, start: 0.24, dur: 0.15 }, // E5
      { freq: 880.0, start: 0.40, dur: 0.45 }, // A5
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.start);

      gain.gain.setValueAtTime(0, now + note.start);
      gain.gain.linearRampToValueAtTime(0.25, now + note.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.start);
      osc.stop(now + note.start + note.dur + 0.05);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

/**
 * Subtle pop for clicking tabs or selecting habits
 */
export function playPop() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {
    console.warn('Audio pop error', e);
  }
}

export interface VoiceSettings {
  rate: number; // Tempo / Kecepatan bicara (0.8 - 1.4)
  pitch: number; // Nada suara (0.8 - 1.3)
  voiceURI?: string;
  preset: 'semangat' | 'santai' | 'tegas' | 'cepat';
}

const STORAGE_KEY_VOICE = 'kak_bintang_voice_settings';

// Default voice settings: Karakter siswa laki-laki hangat, bersahabat, tempo alami & bersemangat
export function getSavedVoiceSettings(): VoiceSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VOICE);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading voice settings', e);
  }
  return {
    rate: 1.05, // Tempo lincah, berenergi, cocok untuk siswa/kakak pembina
    pitch: 0.95, // Nada ramah siswa laki-laki (warm, natural male register)
    preset: 'semangat',
  };
}

export function saveVoiceSettings(settings: VoiceSettings) {
  try {
    localStorage.setItem(STORAGE_KEY_VOICE, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving voice settings', e);
  }
}

/**
 * Pick the best Indonesian male or natural voice available
 */
function findBestMaleIndonesianVoice(): SpeechSynthesisVoice | undefined {
  if (!('speechSynthesis' in window)) return undefined;
  const voices = window.speechSynthesis.getVoices();

  // 1. Try finding explicitly Indonesian male voice
  const indoMale = voices.find((v) => {
    const isIndo = v.lang.startsWith('id') || v.lang.includes('ID');
    const nameLower = v.name.toLowerCase();
    const isMale = nameLower.includes('male') || nameLower.includes('pria') || nameLower.includes('andika') || nameLower.includes('agus') || nameLower.includes('damian');
    return isIndo && isMale;
  });
  if (indoMale) return indoMale;

  // 2. Try any Indonesian voice
  const anyIndo = voices.find((v) => v.lang.startsWith('id') || v.lang.includes('ID'));
  if (anyIndo) return anyIndo;

  // 3. Fallback to any natural/male voice
  return voices.find((v) => v.name.toLowerCase().includes('male'));
}

/**
 * Text-to-speech for Kak Bintang (Karakter Siswa Laki-Laki)
 */
export function speakKakBintang(
  text: string,
  onEnd?: () => void,
  customSettings?: Partial<VoiceSettings>
) {
  if (!('speechSynthesis' in window)) {
    alert('Browser tidak mendukung pembacaan suara.');
    return;
  }

  window.speechSynthesis.cancel();

  // Clean text from excessive symbols or markdown
  const cleanText = text
    .replace(/[#*_`]/g, '')
    .replace(/✨|🌟|🇮🇩|🏆|🎉|❤️|🌿|☀️/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';

  const settings = { ...getSavedVoiceSettings(), ...customSettings };
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;

  // Find preferred voice
  const voices = window.speechSynthesis.getVoices();
  if (settings.voiceURI) {
    const chosen = voices.find((v) => v.voiceURI === settings.voiceURI);
    if (chosen) utterance.voice = chosen;
  }

  if (!utterance.voice) {
    const bestVoice = findBestMaleIndonesianVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
