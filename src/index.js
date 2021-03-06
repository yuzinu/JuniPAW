import * as Tone from 'tone';
import "./styles/index.scss";
import Synth from "./scripts/synth";

document.addEventListener('DOMContentLoaded', function(){
  let playButton = document.getElementById("play");

  playButton.addEventListener('mousedown', () => {
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
      playButton.innerHTML = "Pause";
    } else if (Tone.context.state !== 'running') {
      Tone.context.resume();
      playButton.innerHTML = "Pause";
    } else if (Tone.Transport.state === "paused") {
      Tone.Transport.start();
      playButton.innerHTML = "Pause";
    } else {
      Tone.Transport.pause();
      playButton.innerHTML = "Play";
    }
  });

  let clearButton = document.getElementById("clear");

  clearButton.addEventListener('mousedown', () => {
    let $allPads = document.body.querySelectorAll(`input`);
    $allPads.forEach($pad => {
      $pad.checked = "";
    });
  });

  document.body.onkeydown = (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
        playButton.innerHTML = "Pause";
      } else if (Tone.context.state !== 'running') {
        Tone.context.resume();
        playButton.innerHTML = "Pause";
      } else if (Tone.Transport.state === "paused") {
        Tone.Transport.start();
        playButton.innerHTML = "Pause";
      } else {
        Tone.Transport.pause();
        playButton.innerHTML = "Play";
      }
    }
  };
});
//for mobile later

// function setViewportHeight() {
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty("--vh", `${vh}px`);
// }

// setViewportHeight();

// window.addEventListener('resize', () => {
//   setTimeout(setViewportHeight, 100);
// });