import { parseColors, maskImage } from '../utils.js';

export function generatePixelMap() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

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
    alert("Veuillez fournir un texte, des couleurs de fond et de texte.");
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
      let color = isText
        ? textColors[Math.floor(Math.random() * textColors.length)]
        : (Math.random() * 100 < textNoise
          ? textColors[Math.floor(Math.random() * textColors.length)]
          : bgColors[Math.floor(Math.random() * bgColors.length)]);
      ctx.fillStyle = color;
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
  name: 'Pixel',
  generate: generatePixelMap,
  options: {
    backgroundColors: '#FF5733, #33FF57, #3357FF, #F3FF33, #33FFF3',
    textColors: '#000000, #222222, #111111',
    pixelSize: 5,
    hiddenText: 'Hello',
    textSize: 25,
    textX: 50,
    textY: 50,
    textAngle: 0,
    textNoise: 10,
    blurRadius: 0
  }
};
