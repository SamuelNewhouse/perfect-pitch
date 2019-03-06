//=============================================================================
// Created by Samuel Newhouse for
//
// www.SkillWax.com
//
// https://github.com/SamuelNewhouse
//=============================================================================
import makeNote from './makeNote.js';

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

  const NOTEDURATION = 5000;
  const KEYDATA = [
    { color: 'navy', name: 'G# Ab' },
    { color: 'blue', name: 'A' },
    { color: 'purple', name: 'A# Bb' },
    { color: 'fuchsia', name: 'B' },
    { color: 'red', name: 'C' },
    { color: '#805300', name: 'C# Db' }, // brown. HTML brown doesn't match the pattern.
    { color: 'orange', name: 'D' },
    { color: 'olive', name: 'D# Eb' },
    { color: 'yellow', name: 'E' },
    { color: 'lime', name: 'F' },
    { color: 'teal', name: 'F# Gb' },
    { color: 'aqua', name: 'G' },
  ];

  const getFrequencyFromKeyNumber = keyNumber => {
    const power = (keyNumber - 49) / SEMITONES;
    const multiplier = 2 ** power;
    return TUNING * multiplier;
  }

  const getColorFromKeyNumber = keyNumber => {
    return KEYDATA[keyNumber % SEMITONES].color;
  }

  const getNameFromKeyNumber = keyNumber => {
    return KEYDATA[keyNumber % SEMITONES].name;
  }

  const keyBoard = [null]; // 0 index is null because keys start at 1.
  for (let i = 1; i <= KEYS; i++) {
    keyBoard.push({
      frequency: getFrequencyFromKeyNumber(i),
      color: getColorFromKeyNumber(i),
      name: getNameFromKeyNumber(i),
      note: null,
      timeout: null
    });
  }

  const keyInfoDisplay = (() => {
    const display = document.getElementsByClassName("key-info-display")[0];
    const keys = [];

    const update = () => {
      keys.sort((a, b) => b.frequency - a.frequency);

      while (display.firstChild) display.removeChild(display.firstChild);

      for (let k of keys) {
        const newDiv = document.createElement('div');
        newDiv.style.background = k.color;
        display.appendChild(newDiv);
      }
    }

    const addKey = key => {
      // DEBUG ONLY
      if (keys.includes(key)) {
        console.log("WARNING: Key already added to keyInfoDisplay.");
        return;
      }

      keys.push(key);
      update();
  }

    const removeKey = key => {
      const index = keys.findIndex((e) => e === key);

      // DEBUG ONLY
      if (index < 0) {
        console.log("WARNING: Couldn't find key in keyInfoDisplay.");
        return;
      }
      keys.splice(index, 1);
      update();
    }

    return {
      addKey,
      removeKey
    }
  })();

  function stopKey() {
    this.note.end();
    this.note = null;
    this.timeout = null;
    keyInfoDisplay.removeKey(this);
  }

  function startKey() {
    this.note = makeNote(this.frequency);
    this.note.play();
    this.timeout = setTimeout(stopKey.bind(this), NOTEDURATION);
    keyInfoDisplay.addKey(this);
  }

  const handleKeyDown = (keyNumber) => {
    const key = keyBoard[keyNumber]

    if (key.timeout) { // Is key still making noise
      // TODO: Audibly Replay note. Right now the note just keeps going without any
      // indication of the key being pressed again.
      clearTimeout(key.timeout);
      key.timeout = setTimeout(stopKey.bind(key), NOTEDURATION);
      return;
    }

    startKey.call(key);
  }

  const buildHTMLKeyBoard = () => {
    const blackKeys = document.getElementsByClassName("black-keys")[0];
    const whiteKeys = document.getElementsByClassName("white-keys")[0];

    const isKeyBlack = (keyNumber) => {
      const n = keyNumber % SEMITONES;
      return n === 0 || n === 2 || n === 5 || n === 7 || n === 10;
    }

    const doesBlackKeyNeedGap = (keyNumber) => {
      const n = keyNumber % SEMITONES;
      return n === 5 || n === 10;
    }

    for (let i = 1; i <= KEYS; i++) {
      const newKey = document.createElement('div');

      newKey.addEventListener('mousedown', () => { handleKeyDown(i) });

      if (isKeyBlack(i)) {
        if (doesBlackKeyNeedGap(i))
          newKey.classList.add('gap');
        blackKeys.appendChild(newKey);
      }
      else
        whiteKeys.appendChild(newKey);
    }
  };

  document.addEventListener('DOMContentLoaded', buildHTMLKeyBoard);
})();