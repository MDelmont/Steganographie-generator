# Steganographie Generator

Cette application permet de générer des images pixelisées dans lesquelles un texte est dissimulé par différentes méthodes de stéganographie. Chaque mode s’appuie sur un algorithme spécifique pour camoufler le message.

## Palette par défaut

Le générateur utilise par défaut une palette de dix couleurs de fond et une palette de dix couleurs de texte :

- **Couleurs de fond :** `#FFF5F5`, `#FFE3E3`, `#FFA8A8`, `#FFC9C9`, `#FF6B6B`, `#FF8787`, `#FA5252`, `#E03131`, `#C92A2A`, `#F03E3E`
- **Couleurs du texte :** `#E8F5E9`, `#C8E6C9`, `#A5D6A7`, `#81C784`, `#66BB6A`, `#4CAF50`, `#43A047`, `#388E3C`, `#2E7D32`, `#1B5E20`

Ces valeurs sont pré‑remplies et peuvent être modifiées dans l’interface.

## Modes disponibles

### Pixel
Créé une mosaïque de pixels colorés. Les pixels correspondant au texte utilisent la palette de texte tandis que le reste utilise celle de fond avec éventuellement du bruit.

### Pixel Smooth
Identique au mode *Pixel* mais applique un flou optionnel pour adoucir l’image.

### Pixel Double Contour
Variante du mode *Pixel avec Contour* permettant d’inscrire deux textes
distincts. Le premier est dessiné avec la palette de fond et son pourtour est
bruité avec les couleurs de texte. Le second utilise la palette de texte et est
protégé par du bruit aux couleurs de fond. Les autres réglages (taille des
pixels, bruit, zone de protection…) s’appliquent aux deux inscriptions.

### RGB Alterné
Ajuste uniquement l’un des canaux `R`, `G` ou `B` pour coder le texte. Les autres canaux conservent des valeurs aléatoires, ce qui rend l’inscription plus discrète.

### Dichromatique
Utilise deux canaux de couleur complémentaires pour encoder le message (par défaut `RB`). Cela crée un contraste chromatique particulier.

### Contraste Différentiel
Mélange la couleur de fond et celle du texte selon un facteur de contraste configurable, produisant une différence très faible entre le message et l’arrière‑plan.

### Anaglyphe
Encode le texte en rouge et cyan pour obtenir un effet d’anaglyphe (lecture possible avec des lunettes 3D).

### Filtre Physique
Semblable au contraste différentiel mais avec un contraste fixe très faible (5 %), pensé pour être révélé à l’aide d’un filtre physique.

### Inversion Chromatique
Inverse les composantes de couleur du texte par rapport à la palette fournie, donnant un effet de négatif.

### L*a*b* Distance Steganography
Encode un message binaire en modulant les distances de couleur entre paires de pixels dans l'espace L*a*b*. Permet un contrôle fin du nombre de bits par pixel et deux méthodes de modification (palette ou cube).

## Utilisation

1. Choisissez un mode dans la liste.
2. Modifiez si besoin les couleurs, la taille des pixels et les paramètres du texte.
3. Cliquez sur **Générer** pour obtenir l’image.
4. Vous pouvez également appliquer un masque SVG pour limiter la zone d’affichage.

