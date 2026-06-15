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

game.start();

// expose for debugging
window.__game = game;
