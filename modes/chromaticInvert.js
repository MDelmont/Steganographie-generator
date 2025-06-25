import pixel from './pixel.js';
import { parseColors, maskImage, hexToRgb, rgbToHex } from '../utils.js';

function invertColor(c) {
  return {
    r: 255 - c.r,
    g: 255 - c.g,
    b: 255 - c.b
  };
}

export function generateChromaticInvert() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const bgColors = parseColors(document.getElementById('backgroundColors').value);
  const textColors = parseColors(document.getElementById('textColors').value);
  const text = document.getElementById('hiddenText').value.trim();
  const pixelSize = parseInt(document.getElementById('pixelSize').value);
  const textSizePercent = parseFloat(document.getElementById('textSize').value);
  const posXPercent = parseFloat(document.getElementById('textX').value);
  const posYPercent = parseFloat(document.getElementById('textY').value);
  const angleDeg = parseFloat(document.getElementById('textAngle').value);
  const textNoise = parseFloat(document.getElementById('textNoise').value) || 0;

  if (!text || bgColors.length === 0 || textColors.length === 0) {
    alert('Veuillez fournir un texte, des couleurs de fond et de texte.');
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.floor(canvas.width / pixelSize);
  const rows = Math.floor(canvas.height / pixelSize);

  const temp = document.createElement('canvas');
  temp.width = cols;
  temp.height = rows;
  const tctx = temp.getContext('2d');

  tctx.fillStyle = 'white';
  tctx.fillRect(0, 0, cols, rows);

  tctx.save();
  const centerX = (posXPercent / 100) * cols;
  const centerY = (posYPercent / 100) * rows;
  const angleRad = angleDeg * Math.PI / 180;
  tctx.translate(centerX, centerY);
  tctx.rotate(angleRad);
  const fontSize = Math.floor((textSizePercent / 100) * rows);
  tctx.font = `bold ${fontSize}px monospace`;
  tctx.textAlign = 'center';
  tctx.textBaseline = 'middle';
  tctx.fillStyle = 'black';
  tctx.fillText(text, 0, 0);
  tctx.restore();

  const mask = tctx.getImageData(0, 0, cols, rows).data;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = (y * cols + x) * 4;
      const isText = mask[index] < 128;
      const base = hexToRgb(bgColors[Math.floor(Math.random() * bgColors.length)]);
      let color = { ...base };
      if (isText || Math.random() * 100 < textNoise) {
        const txt = hexToRgb(textColors[Math.floor(Math.random() * textColors.length)]);
        color = invertColor(txt);
      }
      ctx.fillStyle = rgbToHex(color);
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  if (maskImage) {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  }
}

export default {
  name: 'Inversion Chromatique',
  generate: generateChromaticInvert,
  options: pixel.options,
  visibleOptions: pixel.visibleOptions
};
