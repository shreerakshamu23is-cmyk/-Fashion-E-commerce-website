import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientAssetsDir = path.resolve(__dirname, '../client/public/assets');
const serverUploadsDir = path.resolve(__dirname, '../server/public/uploads');

[clientAssetsDir, serverUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const tShirtOutlineFront = `
  <!-- Relaxed Fit T-Shirt Silhouette -->
  <g opacity="0.85">
    <!-- Main Body & Sleeves -->
    <path d="M480 340 C 530 385, 670 385, 720 340 L 890 410 L 820 620 L 740 570 L 740 1260 L 460 1260 L 460 570 L 380 620 L 310 410 Z" fill="#141414" stroke="#2d2d2d" stroke-width="2"/>
    <!-- Ribbed Crewneck Collar -->
    <path d="M480 340 C 530 400, 670 400, 720 340 C 670 370, 530 370, 480 340 Z" fill="#1b1b1b" stroke="#c5a059" stroke-opacity="0.4" stroke-width="1.5"/>
    <path d="M500 355 C 540 410, 660 410, 700 355" fill="none" stroke="#282828" stroke-width="1"/>
    <!-- Dropped Shoulder Seamlines -->
    <line x1="480" y1="340" x2="800" y2="470" stroke="#262626" stroke-width="1.5"/>
    <line x1="720" y1="340" x2="400" y2="470" stroke="#262626" stroke-width="1.5"/>
    <!-- Sleeve Concealed Hems -->
    <line x1="820" y1="620" x2="740" y2="570" stroke="#333" stroke-width="2"/>
    <line x1="380" y1="620" x2="310" y2="410" stroke="#333" stroke-width="2"/>
    <!-- Bottom Hem Concealed Seam -->
    <line x1="460" y1="1230" x2="740" y2="1230" stroke="#2a2a2a" stroke-dasharray="4,4" stroke-width="1.5"/>
    <line x1="460" y1="1260" x2="740" y2="1260" stroke="#333" stroke-width="2"/>
    <!-- Minimalist Quiet Battles Brass Chest Emblem -->
    <circle cx="530" cy="520" r="4" fill="#c5a059"/>
    <line x1="522" y1="520" x2="538" y2="520" stroke="#c5a059" stroke-width="1"/>
  </g>
`;

const tShirtOutlineBack = `
  <!-- Rear Relaxed Fit T-Shirt Silhouette -->
  <g opacity="0.85">
    <!-- Main Body & Sleeves -->
    <path d="M480 340 C 540 355, 660 355, 720 340 L 890 410 L 820 620 L 740 570 L 740 1260 L 460 1260 L 460 570 L 380 620 L 310 410 Z" fill="#131313" stroke="#2d2d2d" stroke-width="2"/>
    <!-- Rear Crewneck Collar Line -->
    <path d="M480 340 C 540 365, 660 365, 720 340" fill="none" stroke="#333" stroke-width="2"/>
    <!-- Center Spine Seam -->
    <line x1="600" y1="360" x2="600" y2="1260" stroke="#222" stroke-width="1.5"/>
    <!-- Archival Neck Label Patch -->
    <rect x="560" y="380" width="80" height="32" fill="#0b0b0b" stroke="#c5a059" stroke-opacity="0.5" stroke-width="1"/>
    <line x1="570" y1="396" x2="630" y2="396" stroke="#c5a059" stroke-width="1"/>
    <!-- Bottom Hem -->
    <line x1="460" y1="1230" x2="740" y2="1230" stroke="#2a2a2a" stroke-dasharray="4,4" stroke-width="1.5"/>
  </g>
`;

const chapters = [
  {
    num: '01',
    title: 'THE BEGINNING',
    file: 'chapter-01.svg',
    subtitle: 'THE UNSEEN CRUCIBLE',
    accent: '#8c7047',
    desc: 'Before the world watches, the architecture of endurance is forged in quiet.',
    shapes: `
      <circle cx="600" cy="700" r="320" fill="none" stroke="#222" stroke-width="1.5"/>
      <circle cx="600" cy="700" r="180" fill="none" stroke="#c5a059" stroke-opacity="0.3" stroke-width="1"/>
      <line x1="600" y1="200" x2="600" y2="1200" stroke="#2c2c2c" stroke-width="1"/>
      <line x1="200" y1="700" x2="1000" y2="700" stroke="#2c2c2c" stroke-width="1"/>
      <path d="M450 600 L600 450 L750 600 L600 750 Z" fill="#141414" stroke="#c5a059" stroke-opacity="0.4" stroke-width="1.5"/>
    `,
  },
  {
    num: '02',
    title: 'THE SILENCE',
    file: 'chapter-02.svg',
    subtitle: 'THE WEIGHT WITHOUT SOUND',
    accent: '#c5a059',
    desc: 'Words dissolve. Only the garment rests between inner turmoil and the world.',
    shapes: `
      <rect x="360" y="380" width="480" height="740" fill="#121212" stroke="#262626" stroke-width="1"/>
      <rect x="420" y="440" width="360" height="620" fill="none" stroke="#c5a059" stroke-opacity="0.25" stroke-width="1"/>
      <path d="M420 500 C 500 750, 700 750, 780 500" fill="none" stroke="#f4f0e8" stroke-opacity="0.2" stroke-width="1.5"/>
      <line x1="600" y1="380" x2="600" y2="1120" stroke="#c5a059" stroke-dasharray="4,6" stroke-width="1.5"/>
    `,
  },
  {
    num: '03',
    title: 'THE STRUGGLE',
    file: 'chapter-03.svg',
    subtitle: 'FIBERS UNDER TENSION',
    accent: '#9b7b38',
    desc: 'Every seam pulled taut. The raw friction between vulnerability and defiance.',
    shapes: `
      <line x1="300" y1="350" x2="900" y2="1050" stroke="#2f2f2f" stroke-width="2"/>
      <line x1="900" y1="350" x2="300" y2="1050" stroke="#2f2f2f" stroke-width="2"/>
      <polygon points="600,420 780,750 600,1080 420,750" fill="#151515" stroke="#c5a059" stroke-opacity="0.5" stroke-width="1.5"/>
      <circle cx="600" cy="750" r="6" fill="#c5a059"/>
    `,
  },
  {
    num: '04',
    title: 'THE STRENGTH',
    file: 'chapter-04.svg',
    subtitle: 'COTTON COMPOSURE',
    accent: '#c5a059',
    desc: 'Solidarity found in structured organic cotton. A shield that does not brag.',
    shapes: `
      <rect x="380" y="350" width="440" height="800" rx="4" fill="#141414" stroke="#2e2e2e" stroke-width="1"/>
      <path d="M440 350 L600 650 L760 350" fill="none" stroke="#c5a059" stroke-width="2"/>
      <line x1="380" y1="750" x2="820" y2="750" stroke="#333" stroke-width="1.5"/>
      <line x1="480" y1="750" x2="480" y2="1150" stroke="#c5a059" stroke-opacity="0.3" stroke-width="1"/>
      <line x1="720" y1="750" x2="720" y2="1150" stroke="#c5a059" stroke-opacity="0.3" stroke-width="1"/>
    `,
  },
  {
    num: '05',
    title: 'THE BECOMING',
    file: 'chapter-05.svg',
    subtitle: 'TRANSCENDENCE OF SCARS',
    accent: '#dfc282',
    desc: 'The wearer is no longer defending against the battle; the battle has become armor.',
    shapes: `
      <circle cx="600" cy="720" r="280" fill="none" stroke="#2a2a2a" stroke-width="1"/>
      <circle cx="600" cy="720" r="140" fill="#161514" stroke="#c5a059" stroke-width="1.5"/>
      <line x1="600" y1="260" x2="600" y2="440" stroke="#c5a059" stroke-width="1.5"/>
      <line x1="600" y1="1000" x2="600" y2="1180" stroke="#c5a059" stroke-width="1.5"/>
      <path d="M480 720 L720 720" stroke="#f4f0e8" stroke-opacity="0.4" stroke-width="1"/>
    `,
  },
];

function generateChapterSVG(chap) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
  <defs>
    <radialGradient id="grad-${chap.num}" cx="50%" cy="48%" r="65%">
      <stop offset="0%" stop-color="#1c1916" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#111111" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#090909" stop-opacity="1"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="#0c0c0c"/>
  <rect width="1200" height="1500" fill="url(#grad-${chap.num})"/>

  <g opacity="0.12" stroke="#f4f0e8" stroke-width="0.5">
    <line x1="120" y1="0" x2="120" y2="1500"/>
    <line x1="1080" y1="0" x2="1080" y2="1500"/>
    <line x1="0" y1="150" x2="1200" y2="1500"/>
    <line x1="0" y1="1350" x2="1200" y2="1350"/>
  </g>

  <g>
    ${chap.shapes}
  </g>

  <rect x="70" y="70" width="1060" height="1360" fill="none" stroke="${chap.accent}" stroke-opacity="0.25" stroke-width="1"/>

  <text x="120" y="140" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="14" letter-spacing="0.35em">CHAPTER ${chap.num} // SERIES 01</text>
  <text x="1080" y="140" text-anchor="end" fill="${chap.accent}" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.25em">ARCHIVAL EDITION</text>

  <text x="600" y="1230" text-anchor="middle" fill="#f4f0e8" font-family="'Cormorant Garamond', Georgia, serif" font-size="52" font-weight="300" letter-spacing="0.1em">${chap.title}</text>
  <text x="600" y="1275" text-anchor="middle" fill="${chap.accent}" font-family="'Inter', sans-serif" font-size="14" letter-spacing="0.4em">${chap.subtitle}</text>
  <text x="600" y="1320" text-anchor="middle" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.12em">${chap.desc}</text>
</svg>`;
}

const products = [
  {
    file: 'product-01-main.svg',
    title: 'THE GENTLE ARMOR T-SHIRT',
    angle: 'STUDIO FRONT VIEW',
    shapes: tShirtOutlineFront,
  },
  {
    file: 'product-01-detail.svg',
    title: 'CONCEALED SEAMS &amp; RIBBED COLLAR',
    angle: 'MACRO DETAIL 01',
    shapes: `
      <!-- Macro texture grid -->
      <g stroke="#1a1a1a" stroke-width="1">
        <line x1="200" y1="200" x2="1000" y2="1000"/>
        <line x1="250" y1="200" x2="1000" y2="950"/>
        <line x1="300" y1="200" x2="1000" y2="900"/>
        <line x1="200" y1="250" x2="950" y2="1000"/>
      </g>
      <!-- Collar Rib & Seam Focus -->
      <path d="M350 500 C 480 680, 720 680, 850 500" fill="none" stroke="#c5a059" stroke-width="6"/>
      <path d="M360 520 C 490 690, 710 690, 840 520" fill="none" stroke="#f4f0e8" stroke-opacity="0.3" stroke-dasharray="4,6" stroke-width="2"/>
      <circle cx="600" cy="700" r="160" fill="#131313" stroke="#282828" stroke-width="2"/>
      <circle cx="600" cy="700" r="140" fill="none" stroke="#c5a059" stroke-width="2"/>
      <text x="600" y="695" text-anchor="middle" fill="#f4f0e8" font-family="'Cormorant Garamond', serif" font-size="22" letter-spacing="0.2em">QUIET BATTLES</text>
      <text x="600" y="725" text-anchor="middle" fill="#c5a059" font-family="'Inter', sans-serif" font-size="12" letter-spacing="0.3em">CONCEALED SEAMS</text>
    `,
  },
  {
    file: 'product-01-back.svg',
    title: 'RELAXED FIT &amp; ARCHITECTURAL REAR',
    angle: 'REAR PROFILE',
    shapes: tShirtOutlineBack,
  },
  {
    file: 'product-01-texture.svg',
    title: 'HEAVYWEIGHT ORGANIC COTTON',
    angle: 'FABRIC GRAIN STUDY',
    shapes: `
      <!-- Interlocking knit patterns -->
      <g stroke="#262626" stroke-width="1.5" opacity="0.7">
        <line x1="100" y1="300" x2="1100" y2="300"/>
        <line x1="100" y1="400" x2="1100" y2="400"/>
        <line x1="100" y1="500" x2="1100" y2="500"/>
        <line x1="100" y1="600" x2="1100" y2="600"/>
        <line x1="100" y1="700" x2="1100" y2="700"/>
        <line x1="100" y1="800" x2="1100" y2="800"/>
        <line x1="100" y1="900" x2="1100" y2="900"/>
        <line x1="100" y1="1000" x2="1100" y2="1000"/>
      </g>
      <rect x="400" y="550" width="400" height="400" fill="#151412" stroke="#c5a059" stroke-opacity="0.4" stroke-width="1.5"/>
      <circle cx="600" cy="750" r="120" fill="none" stroke="#c5a059" stroke-opacity="0.6" stroke-dasharray="3,3" stroke-width="1"/>
      <text x="600" y="745" text-anchor="middle" fill="#f4f0e8" font-family="'Inter', sans-serif" font-size="14" letter-spacing="0.3em">GARMENT-WASHED FINISH</text>
      <text x="600" y="775" text-anchor="middle" fill="#c5a059" font-family="'Inter', sans-serif" font-size="12" letter-spacing="0.2em">100% ORGANIC COTTON</text>
    `,
  },
];

function generateProductSVG(prod) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" width="100%" height="100%">
  <defs>
    <radialGradient id="pgrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1f1c18" stop-opacity="0.9"/>
      <stop offset="65%" stop-color="#121212" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1500" fill="#0d0d0d"/>
  <rect width="1200" height="1500" fill="url(#pgrad)"/>

  <rect x="60" y="60" width="1080" height="1380" fill="none" stroke="#262626" stroke-width="1"/>
  <rect x="75" y="75" width="1050" height="1350" fill="none" stroke="#c5a059" stroke-opacity="0.15" stroke-width="1"/>

  <g>
    ${prod.shapes}
  </g>

  <text x="110" y="130" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.3em">GARMENT ARCHIVE // 01</text>
  <text x="1090" y="130" text-anchor="end" fill="#c5a059" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.25em">${prod.angle}</text>

  <text x="600" y="1380" text-anchor="middle" fill="#f4f0e8" font-family="'Cormorant Garamond', Georgia, serif" font-size="36" font-weight="300" letter-spacing="0.12em">${prod.title}</text>
  <text x="600" y="1415" text-anchor="middle" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.3em">CRAFTED FOR EMOTIONAL ENDURANCE // ₹999</text>
</svg>`;
}

const series01CoverSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="100%" height="100%">
  <defs>
    <radialGradient id="vignette" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#24211d" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#121212" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
  </defs>
  
  <rect width="1200" height="1600" fill="#0e0e0e"/>
  <rect width="1200" height="1600" fill="url(#vignette)"/>
  
  <!-- Relaxed T-Shirt Silhouette Outline -->
  <g opacity="0.75">
    <path d="M480 440 C 530 485, 670 485, 720 440 L 890 510 L 820 720 L 740 670 L 740 1360 L 460 1360 L 460 670 L 380 720 L 310 510 Z" fill="#141414" stroke="#2d2d2d" stroke-width="2"/>
    <path d="M480 440 C 530 500, 670 500, 720 440" fill="none" stroke="#c5a059" stroke-opacity="0.5" stroke-width="2"/>
    <line x1="600" y1="460" x2="600" y2="1360" stroke="#333333" stroke-dasharray="6,6" stroke-width="1.5"/>
  </g>
  
  <rect x="60" y="60" width="1080" height="1480" fill="none" stroke="#c5a059" stroke-opacity="0.2" stroke-width="1"/>
  <rect x="80" y="80" width="1040" height="1440" fill="none" stroke="#f4f0e8" stroke-opacity="0.05" stroke-width="1"/>

  <text x="100" y="140" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="14" letter-spacing="0.4em">01 // COLLECTION ARCHIVE</text>
  <text x="1100" y="140" text-anchor="end" fill="#c5a059" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.3em">PERMANENT ARCHIVE</text>
  
  <text x="600" y="1420" text-anchor="middle" fill="#f4f0e8" font-family="'Cormorant Garamond', Georgia, serif" font-size="48" font-weight="300" letter-spacing="0.15em">SERIES 01 : THE GENTLE ARMOR™</text>
  <text x="600" y="1465" text-anchor="middle" fill="#c5a059" font-family="'Inter', sans-serif" font-size="14" letter-spacing="0.35em">WEAR YOUR BATTLES.</text>
  <text x="600" y="1505" text-anchor="middle" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.25em">FABRIC: ORGANIC COTTON // FIT: RELAXED // 5 CHAPTERS</text>
</svg>`;

const heroSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="heroVignette" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#231f1a" stop-opacity="0.85"/>
      <stop offset="50%" stop-color="#111111" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#090909" stop-opacity="1"/>
    </radialGradient>
  </defs>

  <rect width="1920" height="1080" fill="#0a0a0a"/>
  <rect width="1920" height="1080" fill="url(#heroVignette)"/>

  <!-- Relaxed fit T-shirt outline in subtle ambient glow -->
  <g opacity="0.45">
    <path d="M840 280 C 890 325, 1030 325, 1080 280 L 1250 350 L 1180 560 L 1100 510 L 1100 980 L 820 980 L 820 510 L 740 560 L 670 350 Z" fill="#111111" stroke="#2e2e2e" stroke-width="2"/>
    <path d="M840 280 C 890 340, 1030 340, 1080 280" fill="none" stroke="#c5a059" stroke-opacity="0.5" stroke-width="2"/>
  </g>

  <rect x="80" y="80" width="1760" height="920" fill="none" stroke="#262626" stroke-width="1"/>
  <rect x="100" y="100" width="1720" height="880" fill="none" stroke="#c5a059" stroke-opacity="0.1" stroke-width="1"/>

  <text x="140" y="160" fill="#a1a1aa" font-family="'Inter', sans-serif" font-size="14" letter-spacing="0.35em">QUIET BATTLES™ // ARCHIVAL EDITION</text>
  <text x="1780" y="160" text-anchor="end" fill="#c5a059" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.25em">EST. 2026</text>
</svg>`;

const brandStorySVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1400" width="100%" height="100%">
  <defs>
    <radialGradient id="bsGrad" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#1d1b18" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="1400" fill="#0b0b0b"/>
  <rect width="1200" height="1400" fill="url(#bsGrad)"/>

  <g stroke="#333" stroke-width="1" opacity="0.6">
    <line x1="200" y1="200" x2="1000" y2="200"/>
    <line x1="200" y1="400" x2="1000" y2="400"/>
    <line x1="200" y1="600" x2="1000" y2="600"/>
    <line x1="200" y1="800" x2="1000" y2="800"/>
    <line x1="200" y1="1000" x2="1000" y2="1000"/>
    <line x1="200" y1="1200" x2="1000" y2="1200"/>
  </g>

  <!-- Pattern markings -->
  <path d="M400 350 C 450 395, 590 395, 640 350 L 810 420 L 740 630 L 660 580 L 660 1050 L 380 1050 L 380 580 L 300 630 L 230 420 Z" fill="none" stroke="#f4f0e8" stroke-dasharray="6,8" stroke-opacity="0.4" stroke-width="1.5"/>
  <circle cx="600" cy="650" r="180" fill="none" stroke="#c5a059" stroke-opacity="0.3" stroke-width="1.5"/>
  <circle cx="600" cy="650" r="4" fill="#c5a059"/>

  <text x="600" y="1120" text-anchor="middle" fill="#f4f0e8" font-family="'Cormorant Garamond', Georgia, serif" font-size="38" font-weight="300" letter-spacing="0.1em">THE UNSEEN WEIGHT WE CARRY</text>
  <text x="600" y="1160" text-anchor="middle" fill="#c5a059" font-family="'Inter', sans-serif" font-size="13" letter-spacing="0.3em">ATELIER MANIFESTO // NOISELESS DIGNITY</text>
</svg>`;

function saveBoth(filename, content) {
  fs.writeFileSync(path.join(clientAssetsDir, filename), content, 'utf8');
  fs.writeFileSync(path.join(serverUploadsDir, filename), content, 'utf8');
}

chapters.forEach((chap) => saveBoth(chap.file, generateChapterSVG(chap)));
products.forEach((prod) => saveBoth(prod.file, generateProductSVG(prod)));
saveBoth('series-01-cover.svg', series01CoverSVG);
saveBoth('hero-cinematic.svg', heroSVG);
saveBoth('brand-story.svg', brandStorySVG);

console.log('Regenerated all assets with T-shirt silhouettes and organic cotton copy.');
