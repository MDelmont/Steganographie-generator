import pixel, { generatePixelMap } from './pixel.js';

export function generateBlendPixelMap() {
  generatePixelMap();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;
  const src = ctx.getImageData(0, 0, width, height);
  const data = src.data;
  const out = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy <= 1; dy++) {
        for (let dx = 0; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < width && ny < height) {
            const idx = (ny * width + nx) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
      }
      const idx = (y * width + x) * 4;
      out[idx] = r / count;
      out[idx + 1] = g / count;
      out[idx + 2] = b / count;
      out[idx + 3] = 255;
    }
  }

  ctx.putImageData(new ImageData(out, width, height), 0, 0);
}

export default {
  name: 'Pixel Blend',
  generate: generateBlendPixelMap,
  options: pixel.options
};
