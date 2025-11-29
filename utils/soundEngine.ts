
// Motor de áudio procedural usando Web Audio API
// Gera sons matematicamente sem necessidade de arquivos externos (MP3/WAV)

class SoundEngineClass {
  private ctx: AudioContext | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = true;
  private isAmbientPlaying: boolean = false;

  constructor() {
    // Inicializa apenas sob demanda para respeitar política de autoplay
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (muted) {
      this.stopAmbient();
    } else {
      if (this.isAmbientPlaying) this.startAmbient();
    }
  }

  // --- HAPTIC FEEDBACK (VIBRAÇÃO) ---

  public vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  // --- EFEITOS SONOROS (SFX) ---

  public playClick() {
    this.vibrate(5); // Vibração muito curta e sutil
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playHover() {
    // Sem vibração no hover para não irritar
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playSuccess() {
    this.vibrate([50, 50, 50]); // Vibração dupla de sucesso
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Acorde Maior (Dó - Mi - Sol)
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = t + (i * 0.1);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.5);
    });
  }

  public playError() {
    this.vibrate([100, 50, 100]); // Vibração longa de erro
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playPing() {
    this.vibrate(10); // Ping sutil
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // --- MÚSICA AMBIENTE (PAD CELESTIAL) ---

  public startAmbient() {
    this.isAmbientPlaying = true;
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Se já estiver tocando, não duplica
    if (this.ambientOscillators.length > 0) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 2); // Fade In
    this.ambientGain.connect(this.ctx.destination);

    // Cria um Pad suave com 3 osciladores levemente desafinados
    // Frequências baseadas em Dó e Sol (Quinta justa) para estabilidade
    const freqs = [130.81, 196.00, 261.63]; // C3, G3, C4

    freqs.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      // LFO para vibrato sutil
      const lfo = this.ctx!.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.2; // Bem lento
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 2; // Amplitude do vibrato
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(this.ambientGain!);
      osc.start();
      this.ambientOscillators.push(osc);
    });
  }

  public stopAmbient() {
    this.isAmbientPlaying = false;
    if (!this.ctx || !this.ambientGain) return;

    // Fade Out
    const t = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(t);
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, t);
    this.ambientGain.gain.linearRampToValueAtTime(0, t + 2);

    setTimeout(() => {
      this.ambientOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { }
      });
      this.ambientOscillators = [];
      this.ambientGain = null;
    }, 2000);
  }
}

export const SoundEngine = new SoundEngineClass();
