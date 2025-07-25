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
  'protectionRadius',
  'blurRadius',
  'channel',
  'contrast',
  'message',
  'method',
  'cubeSize',
  'bitsPerPixel',
  'key'
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

// Gestion de l'overlay de révélation
const overlay = document.getElementById('overlay');
const enableReveal = document.getElementById('enableReveal');
const revealOptions = document.getElementById('revealOptions');
const revealColor = document.getElementById('revealColor');
const revealOpacity = document.getElementById('revealOpacity');
const opacityValue = document.getElementById('opacityValue');

function updateOverlay() {
  if (enableReveal.checked) {
    const color = revealColor.value;
    const opacity = parseInt(revealOpacity.value) / 100;
    overlay.style.display = 'block';
    overlay.style.backgroundColor = color;
    overlay.style.opacity = opacity;
  } else {
    overlay.style.display = 'none';
  }
}

// Événements
enableReveal.addEventListener('change', function() {
  revealOptions.style.display = this.checked ? 'block' : 'none';
  updateOverlay();
});

revealColor.addEventListener('input', updateOverlay);

revealOpacity.addEventListener('input', function() {
  opacityValue.textContent = this.value + '%';
  updateOverlay();
});

// Initialisation
updateOverlay();

// Mettre à jour la taille de l'overlay si le canvas change de taille
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    if (entry.target.id === 'canvas') {
      overlay.style.width = entry.contentRect.width + 'px';
      overlay.style.height = entry.contentRect.height + 'px';
    }
  }
});

resizeObserver.observe(document.getElementById('canvas'));
