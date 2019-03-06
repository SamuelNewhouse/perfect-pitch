const FADETIME = 0.2;

const context = new (window.AudioContext || window.webkitAudioContext)();
const now = context.currentTime;
const compressor = context.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, now);
compressor.knee.setValueAtTime(40, now);
compressor.ratio.setValueAtTime(12, now);
compressor.attack.setValueAtTime(0, now);
compressor.release.setValueAtTime(1, now);
compressor.connect(context.destination);

const play = (oscillator) => {
  oscillator.start();
}

const end = (oscillator, gain) => {
  const endTime = context.currentTime + FADETIME;
  gain.gain.setValueAtTime(0, 0);
  oscillator.stop(endTime);
}

const makeNote = (frequency) => {
  const gain = context.createGain();
  gain.connect(compressor);

  const oscillator = context.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  oscillator.connect(gain);

  return {
    play: () => { play(oscillator) },
    end: () => { end(oscillator, gain) }
  }
}

export default makeNote;