export function frequencyToMidi(freq) {
  return (69 + 12 * Math.log2(freq / 440)).toFixed(1);
}

export function pitchToNoteName(pitch) {
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  const noteIndex = Math.round(pitch) % 12;
  return noteNames[noteIndex];
}

// Takes the (rounded) note value and calls the callback only 
export function onNoteChange(currentNote, prevNote) {
  return (callback) => {
    if (currentNote !== prevNote) {
      callback(currentNote);
    }
  }
}