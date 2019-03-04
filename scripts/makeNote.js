const FADETIME = 0.2;

const context = new (window.AudioContext || window.webkitAudioContext)();
const compressor = context.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, context.currentTime);
compressor.knee.setValueAtTime(40, context.currentTime);
compressor.ratio.setValueAtTime(12, context.currentTime);
compressor.attack.setValueAtTime(0, context.currentTime);
compressor.release.setValueAtTime(1, context.currentTime);
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