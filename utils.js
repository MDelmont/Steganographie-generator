export function parseColors(str) {
  return str.split(',')
    .map(s => s.trim())
    .filter(s => /^#?([0-9A-F]{3}){1,2}$/i.test(s))
    .map(c => c.startsWith('#') ? c : '#' + c);
}

export function updateColorPreview(inputId, previewId) {
  const colors = parseColors(document.getElementById(inputId).value);
  const preview = document.getElementById(previewId);
  preview.innerHTML = '';
  colors.forEach(color => {
    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = color;
    preview.appendChild(box);
  });
}

export function setupPreview() {
  document.getElementById('backgroundColors').addEventListener('input', () =>
    updateColorPreview('backgroundColors', 'bgColorPreview'));
  document.getElementById('textColors').addEventListener('input', () =>
    updateColorPreview('textColors', 'textColorPreview'));

  updateColorPreview('backgroundColors', 'bgColorPreview');
  updateColorPreview('textColors', 'textColorPreview');
}

export let maskImage = null;

export function setupMaskUpload() {
  document.getElementById('maskUpload').addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          maskImage = img;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Veuillez téléverser un fichier SVG valide.");
      maskImage = null;
    }
  });
}

export function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex({ r, g, b }) {
  const toHex = c => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
