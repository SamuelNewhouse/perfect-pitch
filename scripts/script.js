import makeNote from './makeNote.js';
import keyboard from './keyboardData.js'

(() => {
  const NOTEDURATION = 1500;

  const keyInfoDisplay = (() => {
    const display = document.getElementsByClassName("key-info-display")[0];
    const keys = [];

    const update = () => {
      keys.sort((a, b) => b.frequency - a.frequency);

      while (display.firstChild) display.removeChild(display.firstChild);

      for (let k of keys) {
        const newDiv = document.createElement('div');
        newDiv.textContent = k.name
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
    const key = keyboard[keyNumber]

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

    for (let i = 1; i < keyboard.length; i++) {
      const newKey = document.createElement('div');

      newKey.addEventListener('mousedown', () => { handleKeyDown(i) });

      if (keyboard[i].isBlack) {
        if (keyboard[i].isBlackSpaced)
          newKey.classList.add('gap');
        blackKeys.appendChild(newKey);
      }
      else
        whiteKeys.appendChild(newKey);
    }
  };

  document.addEventListener('DOMContentLoaded', buildHTMLKeyBoard);
})();