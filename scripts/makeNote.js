const FADETIME = .05; // Extra time for the note to end cleanly without "popping"

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
  const currentTime = context.currentTime;
  gain.gain.setTargetAtTime(0, 0, 0.01);
  oscillator.stop(currentTime + FADETIME);
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