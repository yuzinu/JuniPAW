import * as Tone from 'tone';
import "@babel/polyfill";
import "../styles/synth.scss";

export default document.addEventListener('DOMContentLoaded', function(){
  console.clear();
  /* UPDATE: there is a problem in chrome with starting audio context
  //  before a user gesture. This fixes it.
  // document.documentElement.addEventListener('mousedown', () => {
  //   if (Tone.context.state !== 'running')
  //     Tone.context.resume();
  // }); */
  async function nextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
  }

  async function timeout(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
  }

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

  Tone.Transport.scheduleRepeat(repeat, '8n');
  Tone.Transport.bpm.value = 128;

  let randomButton = document.getElementById("random");

  randomButton.addEventListener('mousedown', () => {
    $rows.forEach($row => {
      let $label = $row.querySelector(`label:nth-child(${Math.ceil(Math.random() * 32)})`),
          $input = $label.querySelector("input");

      $input.checked = "checked";
    });
  });

  $rows.forEach(($row, i) => {
    $row = Array.from($row.children);
    $row.forEach($label => {
      let $input = $label.querySelector("input");
      let $span = $input.nextElementSibling;
      
      async function triggerSound() {
        if (!$input.checked) {
          synths[i].triggerAttackRelease(notes[i], '16n');
        }
      }
      
      $label.addEventListener('click', async (e) => {
        e.preventDefault();
      })
      
      $label.addEventListener('mousedown', e => {
        e.preventDefault();
        $input.checked = !$input.checked;        
      })

      $span.addEventListener('mousedown', async (e) => {
        e.preventDefault();
        triggerSound();
        await timeout(50);
      });
    });
  });

  let sortButton = document.getElementById("sort");
  let isSorting = false;
  let frame;

  sortButton.addEventListener('mousedown', () => {
    isSorting = !isSorting;
    if (isSorting) {
      frame = requestAnimationFrame(bubbleSort);
    } else {
      cancelAnimationFrame(frame);
    }
  });
    
  // async function bubbleSort() {
  async function bubbleSort() {
    let $keys = Array.from($rows);
    let sorted = false;
    
    for (let i = $keys.length - 1 ; i > 0; i--) {
      sorted = true;

      for (let j = $keys.length - 1; j > $keys.length - 1 - i; j--) {
        if (isSorting === false) {
          return cancelAnimationFrame(frame);
        }

        let synth = synths[j],
        nextSynth = synths[j - 1],
        note = notes[j],
        nextNote = notes[j - 1],
        $key = Array.from($keys[j].getElementsByTagName('input')),
        $nextKey = Array.from($keys[j - 1].getElementsByTagName('input')),
        $pad = $key.find(pad => pad.checked),
        $nextPad = $nextKey.find(pad => pad.checked),
        $label = $pad.nextElementSibling,
        $nextLabel = $nextPad.nextElementSibling;
        
        $label.classList.remove("pad");
        $label.classList.add("outline");
        synth.triggerAttackRelease(note, '16n');
        frame = await nextFrame();
        await timeout(50);

        $label.classList.remove("outline");
        $label.classList.add("pad");
        frame = await nextFrame();
        await timeout(50);

        $nextLabel.classList.remove("pad");
        $nextLabel.classList.add("outline");
        nextSynth.triggerAttackRelease(nextNote, '16n');
        frame = await nextFrame();
        await timeout(50);

        $nextLabel.classList.remove("outline");
        $nextLabel.classList.add("pad");
        frame = await nextFrame();
        await timeout(50);
        
        if ($key.indexOf($pad) > $nextKey.indexOf($nextPad)) {
          sorted = false;
          $key[$nextKey.indexOf($nextPad)].checked = "checked";
          $nextKey[$key.indexOf($pad)].checked = "checked";
          $pad.checked = "";
          $nextPad.checked = "";
        }
      }

      if (sorted) {
        isSorting = false;
        return cancelAnimationFrame(frame);
      }
    }
  }

  function repeat(time) {
    let step = index % 32;
    for (let i = 0; i < $rows.length; i++) {
      let synth = synths[i],
          note = notes[i],
          $row = $rows[i],
          $label = $row.querySelector(`label:nth-child(${step + 1})`),
          $input = $label.querySelector("input"),
          $pad = $input.nextElementSibling;

      $label.classList.add("highlight");
        
      if ($input.checked) {
          $pad.classList.remove("pad");
          $pad.classList.add("outline");
        synth.triggerAttackRelease(note, ' 16n', time);
      }

      setTimeout(() => {
        $pad.classList.add("pad");
        $pad.classList.remove("outline");
        $label.classList.remove("highlight");
      }, 200);
    }
    index++;
    console.log(index);
  }
});