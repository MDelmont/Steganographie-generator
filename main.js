import modes from './modes/index.js';
import { setupPreview, updateColorPreview, setupMaskUpload } from './utils.js';

const allOptionIds = [
  'backgroundColors',
  'textColors',
  'pixelSize',
  'hiddenText',
  'textSize',
  'textX',
  'textY',
  'textAngle',
  'textNoise',
  'blurRadius',
  'blendStrength'
];

function toggleOptions(visible = []) {
  allOptionIds.forEach(id => {
    const input = document.getElementById(id);
    const label = document.querySelector(`label[for="${id}"]`);
    const preview =
      id === 'backgroundColors'
        ? document.getElementById('bgColorPreview')
        : id === 'textColors'
          ? document.getElementById('textColorPreview')
          : null;
    if (input) input.classList.add('hidden');
    if (label) label.classList.add('hidden');
    if (preview) preview.classList.add('hidden');
  });
  visible.forEach(id => {
    const input = document.getElementById(id);
    const label = document.querySelector(`label[for="${id}"]`);
    const preview =
      id === 'backgroundColors'
        ? document.getElementById('bgColorPreview')
        : id === 'textColors'
          ? document.getElementById('textColorPreview')
          : null;
    if (input) input.classList.remove('hidden');
    if (label) label.classList.remove('hidden');
    if (preview) preview.classList.remove('hidden');
  });
}

function applyModeOptions(opts, visible) {
  toggleOptions(visible);
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
    applyModeOptions(mode.options, mode.visibleOptions || allOptionIds);
    window.generate = () => mode.generate();
  };

  select.addEventListener('change', setMode);

  select.value = modes[0].name;
  setMode();
}

setupPreview();
setupMaskUpload();
setupModes();
