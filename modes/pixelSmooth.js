import pixel, { generatePixelMap } from './pixel.js';

export function generateSmoothPixelMap() {
  generatePixelMap();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const blurRadius = parseFloat(document.getElementById('blurRadius').value) || 0;
  if (blurRadius > 0) {
    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const tctx = tmp.getContext('2d');
    tctx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `blur(${blurRadius}px)`;
    ctx.drawImage(tmp, 0, 0);
    ctx.filter = 'none';
  }
}

export default {
  name: 'Pixel Smooth',
  generate: generateSmoothPixelMap,
  options: {
    ...pixel.options,
    blurRadius: 2
  }
};
