import * as Tone from 'tone';
import "../styles/synth.scss";

export default document.addEventListener('DOMContentLoaded', function(){
  console.clear();

  // UPDATE: there is a problem in chrome with starting audio context
  //  before a user gesture. This fixes it.
  document.documentElement.addEventListener('mousedown', () => {
    if (Tone.context.state !== 'running')
      Tone.context.resume();
  });

  const synths = [
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth(),
    new Tone.Synth()
  ];


  // synths[0].oscillator.type = 'triangle';
  // synths[1].oscillator.type = 'sine';
  // synths[2].oscillator.type = 'sawtooth';

  const gain = new Tone.Gain(0.6);
  gain.toDestination();

  synths.forEach(synth => {
    synth.oscillator.type = 'sine';
    synth.connect(gain);
  });

  const $rows = document.querySelectorAll(".row"),
  notes = ['C4', 'B3', 'A#3', 'A3', 'G#3', 'G3', 'F#3', 'F3', 'E3', 'D#3', 'D3', 'C#3','C3'];
  let index = 0;

  console.log(`${$rows.length}`);

  Tone.Transport.scheduleRepeat(repeat, '16n');
  Tone.Transport.bpm.value = 128;
  Tone.Transport.start();

  function repeat(time) {
    let step = index % 32;
    for (let i = 0; i < $rows.length; i++) {
      // Tone.Transport.bpm.value =
      let synth = synths[i],
          note = notes[i],
          $row = $rows[i],
          $input = $row.querySelector(`label:nth-child(${step + 1}) > input`);
      if ($input.checked) {
        synth.triggerAttackRelease(note, '16n', time);
      }
    }
    index++;
  }

});