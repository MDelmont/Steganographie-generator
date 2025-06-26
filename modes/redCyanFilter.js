import { parseColors, maskImage } from '../utils.js';

// Plages de couleurs par défaut pour l'effet filtre rouge/cyan
const DEFAULT_BRIGHT_UNDER_RED = [
  ['#fdd', '#faa'],
  ['#fcc', '#f66']
];

const DEFAULT_DARK_UNDER_RED = [
  ['#055', '#202'],
  ['#144', '#011']
];

// Fonction pour générer une couleur aléatoire dans une plage donnée
function randomColorFromRanges(ranges) {
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  const [min, max] = range;
  
  // Conversion hex à RGB
  const minR = parseInt(min.slice(1, 3), 16);
  const minG = parseInt(min.slice(3, 5) || min.slice(1, 3), 16);
  const minB = parseInt(min.slice(5, 7) || min.slice(1, 3), 16);
  
  const maxR = parseInt(max.slice(1, 3), 16);
  const maxG = parseInt(max.slice(3, 5) || max.slice(1, 3), 16);
  const maxB = parseInt(max.slice(5, 7) || max.slice(1, 3), 16);
  
  const r = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
  const g = Math.floor(Math.random() * (maxG - minG + 1)) + minG;
  const b = Math.floor(Math.random() * (maxB - minB + 1)) + minB;
  
  return `rgb(${r}, ${g}, ${b})`;
}

export function generateRedCyanMap() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Utilisation des couleurs de fond et de texte existantes
  const brightRanges = [[document.getElementById('backgroundColors').value.split(',')[0].trim(), document.getElementById('backgroundColors').value.split(',').pop().trim()]];
  const darkRanges = [[document.getElementById('textColors').value.split(',')[0].trim(), document.getElementById('textColors').value.split(',').pop().trim()]];
  
  const text = document.getElementById('hiddenText').value.trim();
  const pixelSize = parseInt(document.getElementById('pixelSize').value);
  const textSizePercent = parseFloat(document.getElementById('textSize').value);
  const posXPercent = parseFloat(document.getElementById('textX').value);
  const posYPercent = parseFloat(document.getElementById('textY').value);
  const angleDeg = parseFloat(document.getElementById('textAngle').value);
  const borderSize = 2; // Taille de bordure fixe pour l'instant

  if (!text) {
    alert("Veuillez fournir un texte à cacher.");
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

  // Création d'un masque pour la bordure
  if (borderSize > 0) {
    tctx.save();
    tctx.translate(centerX, centerY);
    tctx.rotate(angleRad);
    tctx.lineWidth = borderSize * 2;
    tctx.strokeStyle = 'black';
    tctx.strokeText(text, 0, 0);
    tctx.restore();
  }

  const mask = tctx.getImageData(0, 0, cols, rows).data;

  // Génération de l'image avec les couleurs appropriées
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const index = (y * cols + x) * 4;
      const isText = mask[index] < 128;
      
      // Choisir la couleur en fonction de la position
      let color;
      if (isText) {
        // Zone de texte : couleurs sombres sous filtre rouge
        color = randomColorFromRanges(darkRanges);
      } else {
        // Zone de fond : mélange aléatoire des deux groupes
        const useBright = Math.random() > 0.5;
        color = useBright 
          ? randomColorFromRanges(brightRanges)
          : randomColorFromRanges(darkRanges);
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  // Application du masque si défini
  if (maskImage) {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  }
}

export default {
  name: 'Filtre Rouge/Cyan',
  generate: generateRedCyanMap,
  options: {
    backgroundColors: '#fdd, #f66',
    textColors: '#055, #202',
    pixelSize: 5,
    hiddenText: 'Hello',
    textSize: 25,
    textX: 50,
    textY: 50,
    textAngle: 0
  },
  visibleOptions: [
    'backgroundColors', 'textColors', 'pixelSize', 'hiddenText', 'textSize',
    'textX', 'textY', 'textAngle'
  ]
};
