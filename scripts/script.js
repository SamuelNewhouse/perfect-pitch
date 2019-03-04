//=============================================================================
// Created by Samuel Newhouse for
//
// www.SkillWax.com
//
// https://github.com/SamuelNewhouse
//=============================================================================

(() => {
  // TODO:
  // Need to track every key so notes can be lit up while playing.
  // Need to manually time note duration so bottom display can be adjusted as notes stop.

  // HOW:
  // Each key has a timeout set upon being pressed.
  // If the key already has a timeout, clear and set a new one.

  const TUNING = 440;   // Could be changed.
  const KEYS = 88;      // Don't change.
  const SEMITONES = 12; // Changing this doesn't make sense.

  const KEYDISPLAYDATA = [
    { cssClass: 'hover-navy', name: 'G# Ab' },
    { cssClass: 'hover-blue', name: 'A' },
    { cssClass: 'hover-purple', name: 'A# Bb' },
    { cssClass: 'hover-fuchsia', name: 'B' },
    { cssClass: 'hover-red', name: 'C' },
    { cssClass: 'hover-brown', name: 'C# Db' },
    { cssClass: 'hover-orange', name: 'D' },
    { cssClass: 'hover-olive', name: 'D# Eb' },
    { cssClass: 'hover-yellow', name: 'E' },
    { cssClass: 'hover-lime', name: 'F' },
    { cssClass: 'hover-teal', name: 'F# Gb' },
    { cssClass: 'hover-aqua', name: 'G' },
  ];

  const keyBoard = [null]; // 0 index is null because keys start at 1.
  for (let i = 1; i <= KEYS; i++) {
    keyBoard.push({ timeOut: null });
  }

  const getFrequencyFromKeyNumber = (keyNumber) => {
    const power = (keyNumber - 49) / SEMITONES;
    const multiplier = 2 ** power;
    return TUNING * multiplier;
  }

  const isKeyBlack = (keyNumber) => {
    const n = keyNumber % SEMITONES;
    return n === 0 || n === 2 || n === 5 || n === 7 || n === 10;
  }

  const doesBlackKeyNeedGap = (keyNumber) => {
    const n = keyNumber % SEMITONES;
    return n === 5 || n === 10;
  }

  const audio = (() => {
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

    return {
      makeNote(frequency) {
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
    }
  })();

  const noteDisplay = document.getElementsByClassName("note-display")[0];
  const displayNote = (keyNumber) => {
    console.log(keyNumber);
  }

  const handleKeyDown = (keyNumber) => {
    const frequency = getFrequencyFromKeyNumber(keyNumber);
    const note = audio.makeNote(frequency);
    console.log(note)
    note.play();
    note.end();
  }

  const blackKeys = document.getElementsByClassName("black-keys")[0];
  const whiteKeys = document.getElementsByClassName("white-keys")[0];

  document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= KEYS; i++) {
      const newKey = document.createElement('div');

      newKey.classList.add(KEYDISPLAYDATA[i % SEMITONES].cssClass);
      newKey.addEventListener('mousedown', () => { handleKeyDown(i) });

      if (isKeyBlack(i)) {
        if (doesBlackKeyNeedGap(i))
          newKey.classList.add('gap');
        blackKeys.appendChild(newKey);
      }
      else
        whiteKeys.appendChild(newKey);
    }
  });
})();