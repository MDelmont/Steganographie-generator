export default {
  name: 'L*a*b* Distance Steganography',
  generate: generateLabStego,
  options: {
    message: '55',
    method: 'palette', // or 'cube'
    cubeSize: 3,
    bitsPerPixel: 8,
    key: ''
  },
  visibleOptions: ['message', 'method', 'cubeSize', 'bitsPerPixel', 'key']
};

function generateLabStego() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const message = document.getElementById('message').value;
  const method = document.getElementById('method').value;
  const cubeSize = parseInt(document.getElementById('cubeSize').value) || 3;
  const bitsPerPixel = parseInt(document.getElementById('bitsPerPixel').value) || 8;
  const key = document.getElementById('key').value;

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // TODO: Convert RGB pixels to L*a*b*
  const labPixels = [];
  for (let i = 0; i < data.length; i += 4) {
    const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
    labPixels.push(rgbToLab(rgb));
  }

  // TODO: Use key to optionally permute pixel order
  // TODO: Encode message bits by modulating the ΔEab distance
  // between successive pixels according to the chosen method

  // TODO: Convert modified L*a*b* pixels back to RGB
  for (let i = 0; i < labPixels.length; i++) {
    const rgb = labToRgb(labPixels[i]);
    data[i * 4] = rgb.r;
    data[i * 4 + 1] = rgb.g;
    data[i * 4 + 2] = rgb.b;
  }

  ctx.putImageData(imgData, 0, 0);
}

function rgbToLab(rgb) {
  // TODO: implement RGB -> L*a*b* conversion
  return { l: 0, a: 0, b: 0 };
}

function labToRgb(lab) {
  // TODO: implement L*a*b* -> RGB conversion
  return { r: 0, g: 0, b: 0 };
}

function deltaE(lab1, lab2) {
  // TODO: implement ΔEab computation
  return 0;
}
