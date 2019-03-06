// Returns a 1 based array of keys to match key numbers.
// Zero index element is null.

const TUNING = 440;   // Could be changed.
const KEYS = 88;      // Don't change.
const SEMITONES = 12; // Changing this doesn't make sense.

const KEYDATA = [
  { color: 'navy', name: 'G#% / Ab%' },
  { color: 'blue', name: 'A%' },
  { color: 'purple', name: 'A#% / Bb%' },
  { color: 'fuchsia', name: 'B%' },
  { color: 'red', name: 'C%' },
  { color: '#805300', name: 'C#% / Db%' }, // brown. HTML brown doesn't match the pattern.
  { color: 'orange', name: 'D%' },
  { color: 'olive', name: 'D#% / Eb%' },
  { color: 'yellow', name: 'E%' },
  { color: 'lime', name: 'F%' },
  { color: 'teal', name: 'F#% / Gb%' },
  { color: 'aqua', name: 'G%' },
];

const getFrequencyFromKeyNumber = keyNumber => {
  const power = (keyNumber - 49) / SEMITONES;
  const multiplier = 2 ** power;
  return TUNING * multiplier;
}

const getColorFromKeyNumber = keyNumber => {
  return KEYDATA[keyNumber % SEMITONES].color;
}

const getOctaveFromKeyNumber = keyNumber => {
  return Math.floor((keyNumber + 8) / SEMITONES);
}

const getNameFromKeyNumber = keyNumber => {
  const keyData = KEYDATA[keyNumber % SEMITONES];
  const baseName = keyData.name;
  return baseName.replace(/%/g, getOctaveFromKeyNumber(keyNumber));
}

const isKeyBlack = keyNumber => {
  const n = keyNumber % SEMITONES;
  return n === 0 || n === 2 || n === 5 || n === 7 || n === 10;
}

const isSpacedBlackKey = keyNumber => {
  const n = keyNumber % SEMITONES;
  return n === 5 || n === 10;
}

const keyboard = [null]; // 0 index is null because keys start at 1.
for (let i = 1; i <= KEYS; i++) {
  keyboard.push({
    frequency: getFrequencyFromKeyNumber(i),
    color: getColorFromKeyNumber(i),
    name: getNameFromKeyNumber(i),
    isBlack: isKeyBlack(i),
    isSpacedBlack: isSpacedBlackKey(i),
    note: null,
    timeout: null
  });
}

export default keyboard;