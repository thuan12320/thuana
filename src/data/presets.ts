import { BackgroundStyle, ModelActor, ProductItem, VideoRef } from '../types';

// Helper to make SVG data URLs for instant, offline-ready, crisp luxury aesthetic pastel graphics
export function makeSvgThumb(bgGradient: string, iconContent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGradient}
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="20" y="20" width="360" height="460" rx="16" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1.5"/>
    ${iconContent}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_VIDEO_REFS: VideoRef[] = [
  {
    id: 'ref-runway-catwalk',
    title: 'Runway Catwalk 360°',
    category: 'Chuyển động sàn diễn',
    duration: 8.5,
    motionType: 'catwalk',
    fps: 30,
    description: 'Người mẫu sải bước tự tin, xoay người 360° phô diễn toàn bộ phom dáng quần áo trước sau.',
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fdfbf7"/><stop offset="100%" stop-color="#f5ede2"/>`,
      `<circle cx="200" cy="140" r="45" fill="#e9c46a" opacity="0.4"/>
       <path d="M160 210 Q200 180 240 210 L260 380 L200 420 L140 380 Z" fill="#d8cbb8" stroke="#c09a58" stroke-width="2"/>
       <line x1="170" y1="260" x2="230" y2="260" stroke="#c09a58" stroke-width="1.5" stroke-dasharray="4"/>
       <text x="200" y="450" fill="#2d3748" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">RUNWAY CATWALK 360°</text>
       <text x="200" y="472" fill="#718096" font-size="11" font-family="sans-serif" text-anchor="middle">DensePose Motion: 98.4%</text>`
    ),
  },
  {
    id: 'ref-mirror-ootd',
    title: 'Mirror OOTD Outfit Check',
    category: 'Tự quay trước gương',
    duration: 7.0,
    motionType: 'mirror_ootd',
    fps: 30,
    description: 'Phong cách quay OOTD cầm điện thoại trước gương, phóng to chi tiết vải và phụ kiện rất hút lượt mua.',
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fef7f2"/><stop offset="100%" stop-color="#fbe3d5"/>`,
      `<rect x="120" y="100" width="160" height="280" rx="20" fill="none" stroke="#d97757" stroke-width="2"/>
       <rect x="175" y="180" width="50" height="90" rx="8" fill="#e79c82" opacity="0.5"/>
       <circle cx="200" cy="150" r="28" fill="#fdfaf7" opacity="0.8"/>
       <text x="200" y="450" fill="#2d3748" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">MIRROR OOTD CHECK</text>
       <text x="200" y="472" fill="#8c6a58" font-size="11" font-family="sans-serif" text-anchor="middle">Viral Affiliate POV</text>`
    ),
  },
  {
    id: 'ref-studio-spin',
    title: 'Studio Minimal Drapery',
    category: 'Studio thời trang cao cấp',
    duration: 10.0,
    motionType: 'studio_spin',
    fps: 30,
    description: 'Ánh sáng nghệ thuật quét qua chất vải, góc quay chậm cận cảnh độ rủ và đường may tinh xảo.',
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#f0f7f6"/><stop offset="100%" stop-color="#d8ebe7"/>`,
      `<path d="M130 140 C190 120, 210 240, 270 210 C240 330, 160 320, 130 140 Z" fill="#88c0b5" opacity="0.4" stroke="#529b8e" stroke-width="2"/>
       <circle cx="200" cy="120" r="32" fill="#d4af37" opacity="0.3"/>
       <text x="200" y="450" fill="#2d3748" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">STUDIO DRAPERY</text>
       <text x="200" y="472" fill="#4a7c73" font-size="11" font-family="sans-serif" text-anchor="middle">High-End Slow Mo</text>`
    ),
  },
  {
    id: 'ref-streetwear-walk',
    title: 'Parisian Street Walk',
    category: 'Đường phố thanh lịch',
    duration: 6.5,
    motionType: 'street_walk',
    fps: 30,
    description: 'Sải bước tự nhiên trên đường phố sang trọng, ánh nắng tự nhiên làm nổi bật chuyển động trang phục.',
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fcf9f2"/><stop offset="100%" stop-color="#ede3d1"/>`,
      `<path d="M120 400 L180 180 L220 180 L280 400 Z" fill="#c4b59f" stroke="#a48e72" stroke-width="1.5"/>
       <circle cx="200" cy="120" r="30" fill="#e9c46a" opacity="0.4"/>
       <text x="200" y="450" fill="#2d3748" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">PARISIAN STREET WALK</text>
       <text x="200" y="472" fill="#7d6a52" font-size="11" font-family="sans-serif" text-anchor="middle">Urban Natural Motion</text>`
    ),
  },
];

export const PRESET_MODELS: ModelActor[] = [
  {
    id: 'model-linh-chi',
    name: 'Linh Chi',
    vibe: 'Châu Á thanh lịch, nét thanh tú, phù hợp thời trang công sở & đầm dạ tiệc',
    ethnicity: 'East Asian',
    height: '1m72',
    avatarUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fff5f5"/><stop offset="100%" stop-color="#fed7d7"/>`,
      `<circle cx="200" cy="180" r="70" fill="#fbb6ce" opacity="0.6"/>
       <path d="M150 160 Q200 120 250 160 Q200 230 150 160 Z" fill="#2d3748"/>
       <circle cx="180" cy="180" r="6" fill="#2d3748"/>
       <circle cx="220" cy="180" r="6" fill="#2d3748"/>
       <path d="M185 210 Q200 220 215 210" stroke="#e53e3e" stroke-width="2" fill="none"/>
       <path d="M110 370 C130 270, 270 270, 290 370 Z" fill="#f687b3" opacity="0.4" stroke="#ed64a6" stroke-width="1.5"/>
       <text x="200" y="440" fill="#2d3748" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="700">LINH CHI</text>
       <text x="200" y="465" fill="#b83280" font-size="12" font-family="sans-serif" text-anchor="middle">Asian Studio Chic · 1m72</text>`
    ),
  },
  {
    id: 'model-sophia',
    name: 'Sophia Laurent',
    vibe: 'Haute Couture sắc lạnh, phong thái thời trang Milan/Paris cổ điển',
    ethnicity: 'European High-Fashion',
    height: '1m78',
    avatarUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#f0f9ff"/><stop offset="100%" stop-color="#bae6fd"/>`,
      `<circle cx="200" cy="180" r="70" fill="#7dd3fc" opacity="0.5"/>
       <path d="M140 140 Q200 100 260 140 L260 250 Q200 270 140 250 Z" fill="#1e293b" opacity="0.7"/>
       <circle cx="180" cy="180" r="6" fill="#0284c7"/>
       <circle cx="220" cy="180" r="6" fill="#0284c7"/>
       <path d="M185 215 Q200 225 215 215" stroke="#0284c7" stroke-width="2" fill="none"/>
       <path d="M100 370 C120 260, 280 260, 300 370 Z" fill="#38bdf8" opacity="0.3" stroke="#0284c7" stroke-width="1.5"/>
       <text x="200" y="440" fill="#1e293b" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="700">SOPHIA LAURENT</text>
       <text x="200" y="465" fill="#0369a1" font-size="12" font-family="sans-serif" text-anchor="middle">Haute Couture · 1m78</text>`
    ),
  },
  {
    id: 'model-marcus',
    name: 'Marcus Vance',
    vibe: 'Hiện đại, nam tính, phom dáng chuẩn cho streetwear & áo khoác măng tô',
    ethnicity: 'Urban Contemporary',
    height: '1m85',
    avatarUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#f7fee7"/><stop offset="100%" stop-color="#d9f99d"/>`,
      `<circle cx="200" cy="180" r="70" fill="#a3e635" opacity="0.5"/>
       <rect x="150" y="120" width="100" height="50" rx="10" fill="#3f6212" opacity="0.7"/>
       <circle cx="180" cy="180" r="6" fill="#15803d"/>
       <circle cx="220" cy="180" r="6" fill="#15803d"/>
       <path d="M100 370 C120 270, 280 270, 300 370 Z" fill="#84cc16" opacity="0.3" stroke="#4d7c0f" stroke-width="1.5"/>
       <text x="200" y="440" fill="#1e293b" font-size="16" font-family="sans-serif" text-anchor="middle" font-weight="700">MARCUS VANCE</text>
       <text x="200" y="465" fill="#4d7c0f" font-size="12" font-family="sans-serif" text-anchor="middle">Contemporary Urban · 1m85</text>`
    ),
  },
];

export const PRESET_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-blazer-tweed',
    name: 'Blazer Dạ Tweed Cúc Vàng Luxury',
    category: 'Áo khoác / Blazer',
    originalPrice: 1250000,
    salePrice: 689000,
    discountPercent: 45,
    affiliateCode: 'LUMI-BLAZER-45',
    uspTag: 'Dạ tweed dệt kim tuyến · Cúc mạ vàng 18K',
    description: 'Thiết kế dáng suông nhẹ thời thượng, tôn dáng vai và phối hợp hoàn hảo cùng quần suông hoặc đầm midi.',
    imageUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fdfbf7"/><stop offset="100%" stop-color="#faeedb"/>`,
      `<path d="M120 120 L200 210 L280 120 L330 240 L290 420 L110 420 L70 240 Z" fill="#e8dacb" stroke="#c09a58" stroke-width="2.5"/>
       <circle cx="200" cy="250" r="7" fill="#c09a58"/>
       <circle cx="200" cy="300" r="7" fill="#c09a58"/>
       <circle cx="200" cy="350" r="7" fill="#c09a58"/>`
    ),
  },
  {
    id: 'prod-silk-slipdress',
    name: 'Đầm Lụa Satin Champagne Draping',
    category: 'Đầm thiết kế',
    originalPrice: 950000,
    salePrice: 489000,
    discountPercent: 48,
    affiliateCode: 'LUMI-SILK-48',
    uspTag: 'Lụa Satin 100D óng ả · Cắt xéo bay tà',
    description: 'Chất liệu lụa dập rủ mềm mượt, ôm trọn đường cong cơ thể, chuyển động ánh kim cực kỳ bắt sáng khi lên video.',
    imageUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fef9f3"/><stop offset="100%" stop-color="#f7ebd9"/>`,
      `<path d="M160 110 L240 110 L265 220 L295 430 L105 430 L135 220 Z" fill="#e2c8a2" stroke="#b7791f" stroke-width="2.5"/>
       <line x1="160" y1="110" x2="145" y2="60" stroke="#b7791f" stroke-width="2"/>
       <line x1="240" y1="110" x2="255" y2="60" stroke="#b7791f" stroke-width="2"/>`
    ),
  },
  {
    id: 'prod-trench-coat',
    name: 'Măng Tô Kaki Dáng Dài Khuy Sừng',
    category: 'Áo khoác dài',
    originalPrice: 1680000,
    salePrice: 890000,
    discountPercent: 47,
    affiliateCode: 'LUMI-TRENCH-89',
    uspTag: 'Kaki Nhật chống nước nhẹ · Phom đứng dáng',
    description: 'Mẫu áo khoác kinh điển cho mọi tín đồ thời trang mùa thu đông, tạo hiệu ứng vạt áo tung bay ấn tượng khi sải bước.',
    imageUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fbf9f4"/><stop offset="100%" stop-color="#ebd8c1"/>`,
      `<path d="M130 90 L200 140 L270 90 L325 430 L75 430 Z" fill="#d2bba0" stroke="#8d6b4f" stroke-width="2.5"/>
       <line x1="110" y1="260" x2="290" y2="260" stroke="#8d6b4f" stroke-width="2.5"/>
       <circle cx="200" cy="200" r="5" fill="#8d6b4f"/>
       <circle cx="200" cy="320" r="5" fill="#8d6b4f"/>`
    ),
  },
  {
    id: 'prod-leather-bag',
    name: 'Túi Xách Nappa Mini Crossbody',
    category: 'Phụ kiện / Túi xách',
    originalPrice: 850000,
    salePrice: 420000,
    discountPercent: 50,
    affiliateCode: 'LUMI-BAG-50',
    uspTag: 'Da Nappa mềm mịn · Khóa mạ Titan không gỉ',
    description: 'Phụ kiện điểm nhấn tôn vinh toàn bộ set đồ với phom túi cứng cáp và quai xích kim loại sang chảnh.',
    imageUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#fdf2f8"/><stop offset="100%" stop-color="#fbcfe8"/>`,
      `<rect x="110" y="190" width="180" height="150" rx="18" fill="#f472b6" opacity="0.75" stroke="#db2777" stroke-width="2.5"/>
       <path d="M150 190 C150 110, 250 110, 250 190" stroke="#d97706" stroke-width="3" fill="none"/>
       <circle cx="200" cy="265" r="10" fill="#d97706"/>`
    ),
  },
];

// CRITICAL REQUIREMENT: "có nút background style để chọn mặc định là industrial penthouse style có các kệ quần áo"
export const PRESET_BACKGROUNDS: BackgroundStyle[] = [
  {
    id: 'bg-industrial-penthouse',
    name: 'Industrial Penthouse (Kệ quần áo)',
    isDefault: true,
    description: 'Căn hộ penthouse công nghiệp cao cấp, kệ treo quần áo bằng thép đen & gỗ sồi, tường bê tông mài, kính panorama view hoàng hôn thành phố, ánh đèn studio ấm áp.',
    tags: ['Mặc định (Default)', 'Kệ quần áo thép đen', 'Tường bê tông mài', 'Skyline kính Panorama'],
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#faf6f0"/><stop offset="100%" stop-color="#eedfc9"/>`,
      `<!-- Industrial Penthouse with clothes racks vector representation -->
       <rect x="30" y="60" width="340" height="220" fill="#f5ede0" stroke="#d4c3ab" stroke-width="1.5"/>
       <!-- Panorama window with skyline -->
       <line x1="200" y1="60" x2="200" y2="280" stroke="#cbb497" stroke-width="2"/>
       <line x1="30" y1="160" x2="370" y2="160" stroke="#cbb497" stroke-width="1"/>
       <!-- Skyline silhouettes -->
       <rect x="50" y="190" width="35" height="90" fill="#dfcfb8"/>
       <rect x="95" y="170" width="40" height="110" fill="#dfcfb8"/>
       <rect x="230" y="180" width="50" height="100" fill="#dfcfb8"/>
       <rect x="290" y="150" width="35" height="130" fill="#dfcfb8"/>
       <!-- Clothes racks with hanging garments -->
       <line x1="50" y1="310" x2="160" y2="310" stroke="#b45309" stroke-width="3"/>
       <line x1="60" y1="310" x2="60" y2="390" stroke="#78716c" stroke-width="2.5"/>
       <line x1="150" y1="310" x2="150" y2="390" stroke="#78716c" stroke-width="2.5"/>
       <!-- Hanging clothes on rack -->
       <path d="M75 315 L85 365 L70 365 Z" fill="#38bdf8" opacity="0.85"/>
       <path d="M95 315 L108 375 L90 375 Z" fill="#f43f5e" opacity="0.85"/>
       <path d="M120 315 L135 370 L115 370 Z" fill="#eab308" opacity="0.85"/>
       <!-- Floor wooden planks reflection -->
       <line x1="30" y1="390" x2="370" y2="390" stroke="#cbb497" stroke-width="1"/>
       <text x="200" y="435" fill="#292524" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">INDUSTRIAL PENTHOUSE</text>
       <text x="200" y="458" fill="#b45309" font-size="12" font-family="sans-serif" text-anchor="middle" font-weight="600">★ BỐI CẢNH MẶC ĐỊNH</text>
       <text x="200" y="478" fill="#78716c" font-size="11" font-family="sans-serif" text-anchor="middle">Kệ quần áo · Trần bê tông thô</text>`
    ),
  },
  {
    id: 'bg-parisian-haussmann',
    name: 'Parisian Haussmann Interior',
    description: 'Căn hộ kiến trúc Haussmann Paris, tường phào chỉ trắng ngà, lò sưởi đá cẩm thạch trắng, sàn gỗ xương cá cổ điển.',
    tags: ['Kiến trúc Pháp', 'Lò sưởi cẩm thạch', 'Sàn gỗ xương cá'],
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#faf8f5"/><stop offset="100%" stop-color="#f0ebe1"/>`,
      `<rect x="60" y="80" width="280" height="240" fill="#f5f0e6" stroke="#d5c7b3"/>
       <rect x="130" y="180" width="140" height="140" fill="#eae0d0" stroke="#a48c71" stroke-width="1.5"/>
       <text x="200" y="440" fill="#292524" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">PARISIAN HAUSSMANN</text>
       <text x="200" y="465" fill="#78716c" font-size="11" font-family="sans-serif" text-anchor="middle">Luxury French Classic</text>`
    ),
  },
  {
    id: 'bg-white-cyclorama',
    name: 'Clean White Cyclorama Studio',
    description: 'Phòng studio thương mại phông trắng vô cực, đèn softbox chiếu sáng đồng đều, tập trung tuyệt đối vào chi tiết sản phẩm.',
    tags: ['Phông vô cực', 'Ánh sáng Softbox', 'Tối giản thương mại'],
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#e2e8f0"/>`,
      `<rect x="50" y="70" width="300" height="260" rx="20" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
       <circle cx="200" cy="180" r="50" fill="#f1f5f9" opacity="0.8"/>
       <text x="200" y="440" fill="#1e293b" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">WHITE CYCLORAMA</text>
       <text x="200" y="465" fill="#64748b" font-size="11" font-family="sans-serif" text-anchor="middle">E-commerce Infinity Studio</text>`
    ),
  },
  {
    id: 'bg-cyberpunk-atelier',
    name: 'Cyberpunk Luxury Atelier',
    description: 'Xưởng thiết kế tương lai tối sầm, điểm xuyết ánh sáng neon màu hổ phách vàng & xanh lam titan, tạo hiệu ứng thời thượng đột phá.',
    tags: ['Ánh sáng Neon', 'Tương lai Dark-Tech', 'Sáng tạo Viral'],
    thumbnailUrl: makeSvgThumb(
      `<stop offset="0%" stop-color="#faf5ff"/><stop offset="100%" stop-color="#e9d5ff"/>`,
      `<line x1="40" y1="120" x2="360" y2="120" stroke="#c084fc" stroke-width="2"/>
       <line x1="80" y1="280" x2="320" y2="280" stroke="#38bdf8" stroke-width="2"/>
       <text x="200" y="440" fill="#1e293b" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="700">CYBER ATELIER</text>
       <text x="200" y="465" fill="#9333ea" font-size="11" font-family="sans-serif" text-anchor="middle">Neon Noir Fashion</text>`
    ),
  },
];
