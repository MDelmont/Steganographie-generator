import { parseColors, maskImage } from '../utils.js';

// Fonction pour calculer la distance minimale entre un point et le texte
function getMinDistanceToText(x, y, textMask, width, height, pixelSize) {
  const radius = 2; // Rayon de recherche autour du point
  let minDistance = Infinity;
  
  // Vérifier les pixels dans un rayon autour du point
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      
      // Vérifier les limites
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const idx = (ny * width + nx) * 4;
        if (textMask[idx] < 128) { // Si c'est du texte
          const distance = Math.sqrt(dx*dx + dy*dy);
          if (distance < minDistance) {
            minDistance = distance;
          }
        }
      }
    }
  }
  
  return minDistance;
}

export function generatePixelContourMap() {
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
  const protectionRadius = parseFloat(document.getElementById('protectionRadius')?.value) || 0; // Rayon de protection réglable

  if (!text || bgColors.length === 0 || textColors.length === 0) {
    alert("Veuillez fournir un texte, des couleurs de fond et de texte.");
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.floor(canvas.width / pixelSize);
  const rows = Math.floor(canvas.height / pixelSize);

  // Création d'un canvas temporaire pour le masque de texte
  const temp = document.createElement('canvas');
  temp.width = cols;
  temp.height = rows;
  const tctx = temp.getContext('2d');

  // Dessin du texte sur le canvas temporaire
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

  // Création d'un masque pour la zone de protection
  const protectionMask = document.createElement('canvas');
  protectionMask.width = cols;
  protectionMask.height = rows;
  const pctx = protectionMask.getContext('2d');
  
  // Dessiner le texte initial
  pctx.fillStyle = 'white';
  pctx.fillRect(0, 0, cols, rows);
  pctx.save();
  pctx.translate(centerX, centerY);
  pctx.rotate(angleRad);
  pctx.font = `bold ${fontSize}px monospace`;
  pctx.textAlign = 'center';
  pctx.textBaseline = 'middle';
  pctx.fillStyle = 'black';
  pctx.fillText(text, 0, 0);
  pctx.restore();

  // Récupérer les données des masques
  const mask = tctx.getImageData(0, 0, cols, rows).data;
  
  // Créer un nouveau masque pour la zone protégée
  const protectionData = new Uint8ClampedArray(mask.length);
  
  // Remplir le masque de protection
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      
      // Si c'est un pixel de texte, marquer la zone protégée
      if (mask[idx] < 128) {
        // Marquer le pixel de texte
        protectionData[idx] = 255;
        protectionData[idx + 3] = 255;
        
        // Marquer la zone de protection autour
        const radius = Math.max(1, Math.floor(protectionRadius));
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const nIdx = (ny * cols + nx) * 4;
              // Vérifier la distance pour un contour plus lisse
              const distance = Math.sqrt(dx*dx + dy*dy);
              if (distance <= radius) {
                protectionData[nIdx] = 255;
                protectionData[nIdx + 3] = 255;
              }
            }
          }
        }
      }
    }
  }

  // Génération de l'image avec la zone de protection
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = (y * cols + x) * 4;
      const isText = mask[index] < 128;
      const isProtected = protectionData[index] > 0; // Zone protégée
      
      let color;
      if (isText) {
        // Zone de texte : utiliser les couleurs de texte
        color = textColors[Math.floor(Math.random() * textColors.length)];
      } else if (isProtected) {
        // Zone protégée : utiliser uniquement les couleurs de fond (pas de bruit)
        color = bgColors[Math.floor(Math.random() * bgColors.length)];
      } else {
        // Zone éloignée : appliquer le bruit selon la probabilité
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
  name: 'Pixel avec Contour',
  generate: generatePixelContourMap,
  options: {
    backgroundColors: '#FFF5F5, #FFE3E3, #FFA8A8, #FFC9C9, #FF6B6B, #FF8787, #FA5252, #E03131, #C92A2A, #F03E3E',
    textColors: '#E8F5E9, #C8E6C9, #A5D6A7, #81C784, #66BB6A, #4CAF50, #43A047, #388E3C, #2E7D32, #1B5E20',
    pixelSize: 5,
    hiddenText: 'Hello',
    textSize: 25,
    textX: 50,
    textY: 50,
    textAngle: 0,
    textNoise: 10,
    protectionRadius: 2
  },
  visibleOptions: [
    'backgroundColors', 'textColors', 'pixelSize', 'hiddenText', 'textSize',
    'textX', 'textY', 'textAngle', 'textNoise', 'protectionRadius'
  ]
};
