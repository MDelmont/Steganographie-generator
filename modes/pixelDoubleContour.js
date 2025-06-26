import { parseColors, maskImage } from '../utils.js';

function createTextMask(text, cols, rows, centerX, centerY, angleDeg, fontSize) {
  const temp = document.createElement('canvas');
  temp.width = cols;
  temp.height = rows;
  const ctx = temp.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, cols, rows);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angleDeg * Math.PI / 180);
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  if (text) ctx.fillText(text, 0, 0);
  ctx.restore();
  return ctx.getImageData(0, 0, cols, rows).data;
}

function createProtectionMask(mask, cols, rows, radius) {
  const data = new Uint8ClampedArray(mask.length);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      if (mask[idx] < 128) {
        data[idx] = 255;
        data[idx + 3] = 255;
        const r = Math.max(1, Math.floor(radius));
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const nIdx = (ny * cols + nx) * 4;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist <= r) {
                data[nIdx] = 255;
                data[nIdx + 3] = 255;
              }
            }
          }
        }
      }
    }
  }
  return data;
}

export function generatePixelDoubleContourMap() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const bgColors = parseColors(document.getElementById('backgroundColors').value);
  const textColors = parseColors(document.getElementById('textColors').value);
  const text1 = document.getElementById('hiddenText').value.trim();
  const text2 = document.getElementById('hiddenText2').value.trim();
  const pixelSize = parseInt(document.getElementById('pixelSize').value);
  const textSizePercent = parseFloat(document.getElementById('textSize').value);
  const posX1 = parseFloat(document.getElementById('textX').value);
  const posY1 = parseFloat(document.getElementById('textY').value);
  const posX2 = parseFloat(document.getElementById('textX2').value);
  const posY2 = parseFloat(document.getElementById('textY2').value);
  const angle1 = parseFloat(document.getElementById('textAngle').value);
  const angle2 = parseFloat(document.getElementById('textAngle2').value);
  const textNoise = parseFloat(document.getElementById('textNoise').value) || 0;
  const protectionRadius = parseFloat(document.getElementById('protectionRadius')?.value) || 0;

  if ((!text1 && !text2) || bgColors.length === 0 || textColors.length === 0) {
    alert('Veuillez fournir au moins un texte et des couleurs de fond et de texte.');
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.floor(canvas.width / pixelSize);
  const rows = Math.floor(canvas.height / pixelSize);
  const fontSize = Math.floor((textSizePercent / 100) * rows);

  const mask1 = text1 ?
    createTextMask(text1, cols, rows, (posX1 / 100) * cols, (posY1 / 100) * rows, angle1, fontSize) :
    new Uint8ClampedArray(cols * rows * 4);
  const mask2 = text2 ?
    createTextMask(text2, cols, rows, (posX2 / 100) * cols, (posY2 / 100) * rows, angle2, fontSize) :
    new Uint8ClampedArray(cols * rows * 4);

  const protect1 = createProtectionMask(mask1, cols, rows, protectionRadius);
  const protect2 = createProtectionMask(mask2, cols, rows, protectionRadius);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      const inText1 = mask1[idx] < 128;
      const inText2 = mask2[idx] < 128;
      const inProt1 = !inText1 && protect1[idx] > 0;
      const inProt2 = !inText2 && protect2[idx] > 0;

      let color;
      if (inText1) {
        color = bgColors[Math.floor(Math.random() * bgColors.length)];
      } else if (inText2) {
        color = textColors[Math.floor(Math.random() * textColors.length)];
      } else if (inProt1 && !inProt2) {
        color = textColors[Math.floor(Math.random() * textColors.length)];
      } else if (inProt2 && !inProt1) {
        color = bgColors[Math.floor(Math.random() * bgColors.length)];
      } else {
        color = Math.random() * 100 < textNoise
          ? textColors[Math.floor(Math.random() * textColors.length)]
          : bgColors[Math.floor(Math.random() * bgColors.length)];
      }

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
  name: 'Pixel Double Contour',
  generate: generatePixelDoubleContourMap,
  options: {
    backgroundColors: '#FFF5F5, #FFE3E3, #FFA8A8, #FFC9C9, #FF6B6B, #FF8787, #FA5252, #E03131, #C92A2A, #F03E3E',
    textColors: '#E8F5E9, #C8E6C9, #A5D6A7, #81C784, #66BB6A, #4CAF50, #43A047, #388E3C, #2E7D32, #1B5E20',
    pixelSize: 5,
    hiddenText: 'Secret1',
    hiddenText2: 'Secret2',
    textSize: 25,
    textX: 30,
    textY: 50,
    textX2: 70,
    textY2: 50,
    textAngle: 0,
    textAngle2: 0,
    textNoise: 10,
    protectionRadius: 2
  },
  visibleOptions: [
    'backgroundColors', 'textColors', 'pixelSize',
    'hiddenText', 'hiddenText2',
    'textSize',
    'textX', 'textY', 'textX2', 'textY2',
    'textAngle', 'textAngle2',
    'textNoise', 'protectionRadius'
  ]
};
