// Web Audio API Synthesizer + Speech Engine for "Wadiya on Fire"

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.85;

  constructor() {
    try {
      const savedMute = localStorage.getItem('wadiya_fire_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
      const savedArtist = localStorage.getItem('wadiya_voice_artist');
      if (savedArtist === 'clean' || savedArtist === 'panic' || savedArtist === 'deep') {
        this.currentArtist = savedArtist;
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.initContext();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      };

      window.addEventListener('pointerdown', unlock);
      window.addEventListener('keydown', unlock);
      window.addEventListener('touchstart', unlock);
    }
  }

  public initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      localStorage.setItem('wadiya_fire_muted', String(this.muted));
    } catch {
      // ignore
    }
    return this.muted;
  }

  private currentArtist: 'clean' | 'panic' | 'deep' = 'clean';
  private cachedAudioMap: Map<string, HTMLAudioElement> = new Map();

  public getVoiceArtist(): 'clean' | 'panic' | 'deep' {
    return this.currentArtist;
  }

  public setVoiceArtist(artist: 'clean' | 'panic' | 'deep') {
    this.currentArtist = artist;
    try {
      localStorage.setItem('wadiya_voice_artist', artist);
    } catch {
      // ignore
    }
  }

  /**
   * Authentic Native Bengali Voice Artist: "আল্লাহ! ওয়াদিয়া আগুন লাগিয়ে দিল!"
   */
  public playWadiyaAgunVoice(overrideArtist?: 'clean' | 'panic' | 'deep') {
    if (this.muted) return;
    this.initContext();

    const artist = overrideArtist || this.currentArtist;
    const audioPath = `/bengali_artist_${artist}.mp3`;

    try {
      let audio = this.cachedAudioMap.get(audioPath);
      if (!audio) {
        audio = new Audio(audioPath);
        this.cachedAudioMap.set(audioPath, audio);
      }
      audio.currentTime = 0;
      audio.volume = Math.min(1.0, this.volume * 1.15);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to SpeechSynthesis if audio element playback is restricted
          this.playSpeechSynthesisFallback();
        });
      }
    } catch {
      this.playSpeechSynthesisFallback();
    }
  }

  private playSpeechSynthesisFallback() {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const voices = window.speechSynthesis.getVoices();
        const bnVoice = voices.find(
          (v) =>
            v.lang.startsWith('bn') ||
            v.lang.toLowerCase().includes('bn-') ||
            v.name.toLowerCase().includes('bengali') ||
            v.name.toLowerCase().includes('bangla')
        );

        const utterance = new SpeechSynthesisUtterance('আল্লাহ! ওয়াদিয়া আগুন লাগিয়ে দিল!');
        if (bnVoice) {
          utterance.voice = bnVoice;
          utterance.lang = bnVoice.lang;
        } else {
          utterance.lang = 'bn-BD';
        }

        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Cinematic Fire Blast with Low-End Punch and Soft Crackle
   */
  public playFireBlast() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Warm cinematic sub thump
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.5);

      subGain.gain.setValueAtTime(0.65 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.52);

      // 2. Soft roaring fire flame
      const bufferSize = this.ctx.sampleRate * 0.7;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.7);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5 * this.volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.7);
    } catch {
      // ignore
    }
  }

  /**
   * Warm Acoustic Marimba Chime for Each Ladder Rung Climbed
   */
  public playLadderRungStep(rungIndex: number) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];
      const freq = scale[rungIndex % scale.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // ignore
    }
  }

  /**
   * Comedic Cartoon Poop Splat & Pop
   */
  public playPoopSplat() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Cartoon pop
      const pop = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      pop.type = 'triangle';
      pop.frequency.setValueAtTime(320, now);
      pop.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      popGain.gain.setValueAtTime(0.6 * this.volume, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      pop.connect(popGain);
      popGain.connect(this.ctx.destination);
      pop.start(now);
      pop.stop(now + 0.23);

      // Squelch splash
      const squelch = this.ctx.createOscillator();
      const squelchGain = this.ctx.createGain();
      squelch.type = 'sawtooth';
      squelch.frequency.setValueAtTime(140, now + 0.05);
      squelch.frequency.linearRampToValueAtTime(75, now + 0.25);

      squelchGain.gain.setValueAtTime(0.45 * this.volume, now + 0.05);
      squelchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      squelch.connect(squelchGain);
      squelchGain.connect(this.ctx.destination);
      squelch.start(now + 0.05);
      squelch.stop(now + 0.29);
    } catch {
      // ignore
    }
  }

  /**
   * Crisp Footstep Tap
   */
  public playStep() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.06);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // ignore
    }
  }

  /**
   * Tactile Dice Shake & Roll
   */
  public playDiceShake() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const t = now + i * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200 + Math.random() * 120, t);
        gain.gain.setValueAtTime(0.2 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.03);
      }
    } catch {
      // ignore
    }
  }

  public playDiceLand(val: number = 3) {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + val * 16, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

      gain.gain.setValueAtTime(0.55 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // ignore
    }
  }

  public playVictory() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [
        { f: 523.25, t: 0, d: 0.22 },
        { f: 659.25, t: 0.22, d: 0.22 },
        { f: 783.99, t: 0.44, d: 0.22 },
        { f: 1046.5, t: 0.7, d: 0.9 },
      ];
      const now = this.ctx.currentTime;
      chords.forEach((c) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(c.f, now + c.t);
        gain.gain.setValueAtTime(0.35 * this.volume, now + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + c.t);
        osc.stop(now + c.t + c.d);
      });
    } catch {
      // ignore
    }
  }

  public playClick() {
    if (this.muted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
