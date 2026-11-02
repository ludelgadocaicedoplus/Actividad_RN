/**
 * Sistema de audio procedimental con Web Audio API.
 * No requiere archivos externos de audio y funciona sin conexión (offline).
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    
    // Cargar preferencia guardada si existe
    try {
      const saved = localStorage.getItem('quiz_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = JSON.parse(saved);
      }
    } catch (e) {
      this.soundEnabled = true;
    }
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('quiz_sound_enabled', JSON.stringify(this.soundEnabled));
    } catch (e) {}
    if (this.soundEnabled) {
      this.init();
      this.playClick();
    }
    return this.soundEnabled;
  }

  // Tono base con envolvente
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, delay = 0) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const startTime = this.audioCtx.currentTime + delay;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainVal, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  // Clic suave de interfaz
  playClick() {
    if (!this.soundEnabled) return;
    this.playTone(600, 'sine', 0.05, 0.06);
  }

  // Tic-tac sutil de reloj (últimos 5 segundos)
  playTick() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const startTime = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, startTime);
    osc.frequency.exponentialRampToValueAtTime(440, startTime + 0.04);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  // Respuesta Correcta: Acorde brillante y alegre (Do-Mi-Sol-Do)
  playCorrect() {
    if (!this.soundEnabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.28, 0.12, idx * 0.07);
    });
  }

  // Respuesta Incorrecta: Zumbido suave descendente
  playIncorrect() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    const startTime = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, startTime);
    osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.3);

    // Filtro para suavizar
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, startTime);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  }

  // Tiempo agotado: Doble tono de aviso
  playTimeout() {
    if (!this.soundEnabled) return;
    this.playTone(350, 'sine', 0.15, 0.1, 0);
    this.playTone(280, 'sine', 0.2, 0.1, 0.16);
  }

  // Fanfarria de victoria final
  playVictory() {
    if (!this.soundEnabled) return;
    this.init();
    // Melodía triunfal
    const melody = [
      { f: 523.25, d: 0.15, wait: 0 },    // C5
      { f: 659.25, d: 0.15, wait: 0.14 }, // E5
      { f: 783.99, d: 0.18, wait: 0.28 }, // G5
      { f: 1046.50, d: 0.45, wait: 0.45 } // C6 (sostenido)
    ];

    melody.forEach(item => {
      this.playTone(item.f, 'triangle', item.d, 0.15, item.wait);
      this.playTone(item.f * 0.5, 'sine', item.d, 0.1, item.wait);
    });
  }
}

window.soundCtrl = new SoundController();
