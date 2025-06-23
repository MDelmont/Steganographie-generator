export function parseColors(str) {
  return str.split(',')
    .map(s => s.trim())
    .filter(s => /^#?([0-9A-F]{3}){1,2}$/i.test(s))
    .map(c => c.startsWith('#') ? c : '#' + c);
}

export function setupPreview() {
  const update = (inputId, previewId) => {
    const colors = parseColors(document.getElementById(inputId).value);
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    colors.forEach(color => {
      const box = document.createElement('div');
      box.className = 'color-box';
      box.style.backgroundColor = color;
      preview.appendChild(box);
    });
  };

  document.getElementById('backgroundColors').addEventListener('input', () =>
    update('backgroundColors', 'bgColorPreview'));
  document.getElementById('textColors').addEventListener('input', () =>
    update('textColors', 'textColorPreview'));

  update('backgroundColors', 'bgColorPreview');
  update('textColors', 'textColorPreview');
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
