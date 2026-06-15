// ============================================================================
//  Bootstrap — wire up canvas, resume audio on first gesture, start the game.
// ============================================================================
import { Game } from './game.js';
import { sfx } from './audio.js';

const canvas = document.getElementById('game');
import { input } from './input.js';
input.bindCanvas(canvas);
const game = new Game(canvas);

// unlock WebAudio on first interaction (browser autoplay policy)
function unlock() {
  sfx.resume();
  window.removeEventListener('keydown', unlock);
  window.removeEventListener('pointerdown', unlock);
}
window.addEventListener('keydown', unlock);
window.addEventListener('pointerdown', unlock);

// focus so keys register immediately
canvas.tabIndex = 0;
canvas.focus();
window.addEventListener('pointerdown', () => canvas.focus());

// --- fullscreen toggle ---
const frame = document.querySelector('.crt-frame');
const fsBtn = document.getElementById('fsBtn');
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (frame.requestFullscreen) {
      frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  canvas.focus();
}
fsBtn.addEventListener('click', toggleFullscreen);
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    fsBtn.innerHTML = '<span class="font-pixel text-[10px] text-white">EXIT FS</span>';
  } else {
    fsBtn.innerHTML = '<span class="font-pixel text-[10px] text-white">FULLSCREEN</span>';
  }
  canvas.focus();
});

// --- controls overlay toggle ---
const helpBtn = document.getElementById('helpBtn');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const controls = document.getElementById('controls');

function toggleHelp() {
  controls.classList.toggle('hidden');
  controls.classList.toggle('flex');
  canvas.focus();
}

helpBtn.addEventListener('click', toggleHelp);
closeHelpBtn.addEventListener('click', toggleHelp);

game.start();

// expose for debugging
window.__game = game;
