import modes from './modes/index.js';
import { setupPreview, updateColorPreview, setupMaskUpload } from './utils.js';

function applyModeOptions(opts) {
  if (!opts) return;
  Object.entries(opts).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      el.value = value;
    }
  });
  updateColorPreview('backgroundColors', 'bgColorPreview');
  updateColorPreview('textColors', 'textColorPreview');
}

function setupModes() {
  const select = document.getElementById('mode');
  modes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode.name;
    option.textContent = mode.name;
    select.appendChild(option);
  });

  const setMode = () => {
    const mode = modes.find(m => m.name === select.value);
    applyModeOptions(mode.options);
    window.generate = () => mode.generate();
  };

  select.addEventListener('change', setMode);

  select.value = modes[0].name;
  setMode();
}

setupPreview();
setupMaskUpload();
setupModes();
