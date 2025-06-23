import { generatePixelMap } from './modes/pixel.js';
import { setupPreview, setupMaskUpload } from './utils.js';

window.generate = () => generatePixelMap();

setupPreview();
setupMaskUpload();
