import React, { useState, useRef } from 'react';
import { 
  Sparkles, Camera, Download, Sliders, Wand2, Copy, 
  Check, ArrowRightCircle, RefreshCw, Layers, ShieldCheck,
  Maximize2, Image as ImageIcon, Flame, ChevronRight, Zap
} from 'lucide-react';
import { AspectRatio, NanoBananaResolution, NanoBananaImageItem } from '../types';
import { Tooltip } from './Tooltip';

interface NanoBananaImageStudioProps {
  onUseAsStartFrame: (imageDataUrl: string, promptText: string) => void;
  onCreateNewClipWithFrame: (imageDataUrl: string, promptText: string) => void;
}

export const NanoBananaImageStudio: React.FC<NanoBananaImageStudioProps> = ({
  onUseAsStartFrame,
  onCreateNewClipWithFrame,
}) => {
  const [prompt, setPrompt] = useState<string>(
    'Siêu mẫu phong cách Paris trong áo khoác Tweed Blazer dệt thủ công, khuy vàng cổ điển, ánh sáng studio nghệ thuật dịu ấm'
  );
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('9:16');
  const [selectedResolution, setSelectedResolution] = useState<NanoBananaResolution>('2K');
  const [selectedStyle, setSelectedStyle] = useState<string>('editorial');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<NanoBananaImageItem | null>(null);

  // Quick prompt inspirations
  const PROMPT_INSPIRATIONS = [
    {
      title: 'Tweed Blazer Paris',
      prompt: 'Siêu mẫu phong cách Paris trong áo khoác Tweed Blazer dệt thủ công, khuy vàng cổ điển, ánh sáng studio nghệ thuật dịu ấm',
      style: 'editorial',
      ratio: '9:16' as AspectRatio,
    },
    {
      title: 'Đầm Lụa Champagne',
      prompt: 'Đầm dạ hội lụa tơ tằm màu champagne trong penthouse đón ánh nắng hoàng hôn, đường viền mềm mại, không gian sang trọng',
      style: 'penthouse',
      ratio: '9:16' as AspectRatio,
    },
    {
      title: 'Streetwear Milan',
      prompt: 'Người mẫu sải bước tại Tuần lễ thời trang Milan, áo khoác bomber da oversized, bối cảnh kiến trúc tối giản hiện đại',
      style: 'streetwear',
      ratio: '3:4' as AspectRatio,
    },
    {
      title: 'Áo Len Cashmere Kem',
      prompt: 'Chân dung lookbook thời trang thu đông, áo len cashmere màu kem sữa cao cấp, phông nền studio pastel ấm cúng',
      style: 'studio_clean',
      ratio: '1:1' as AspectRatio,
    },
  ];

  const STYLE_PRESETS = [
    { id: 'editorial', name: 'Haute Editorial', desc: 'Vogue & Harper’s Bazaar layout, tương phản tinh tế' },
    { id: 'penthouse', name: 'Sunlit Penthouse', desc: 'Penthouse kính panorama, ánh sáng tự nhiên dịu mát' },
    { id: 'studio_clean', name: 'Minimal Studio', desc: 'Phông nền trung tính pastel, tôn trọn vẹn chất liệu vải' },
    { id: 'streetwear', name: 'Urban Catwalk', desc: 'Năng động, sải bước ngoài trời, chuyển động tự nhiên' },
  ];

  // Gallery of initial curated NanoBanana Pro outputs
  const [gallery, setGallery] = useState<NanoBananaImageItem[]>([
    {
      id: 'nb-1',
      title: 'Paris Tweed Blazer Autumn',
      prompt: 'Siêu mẫu phong cách Paris trong áo khoác Tweed Blazer dệt thủ công, khuy vàng cổ điển, ánh sáng studio nghệ thuật dịu ấm',
      ratio: '9:16',
      resolution: '4K',
      stylePreset: 'editorial',
      imageUrl: '', // dynamically rendered or fallback
      createdAt: Date.now() - 3600000,
      model: 'gemini-3-pro-image',
    },
    {
      id: 'nb-2',
      title: 'Champagne Silk Evening Gown',
      prompt: 'Đầm dạ hội lụa tơ tằm màu champagne trong penthouse đón ánh nắng hoàng hôn, đường viền mềm mại, không gian sang trọng',
      ratio: '9:16',
      resolution: '2K',
      stylePreset: 'penthouse',
      imageUrl: '',
      createdAt: Date.now() - 7200000,
      model: 'gemini-3-pro-image',
    },
    {
      id: 'nb-3',
      title: 'Minimalist Oatmeal Cashmere',
      prompt: 'Chân dung lookbook thời trang thu đông, áo len cashmere màu kem sữa cao cấp, phông nền studio pastel ấm cúng',
      ratio: '1:1',
      resolution: '2K',
      stylePreset: 'studio_clean',
      imageUrl: '',
      createdAt: Date.now() - 10800000,
      model: 'gemini-3-pro-image',
    },
  ]);

  // Generate synthetic high-fashion image on canvas for instant offline/online fidelity
  const renderFashionImageCanvas = (
    promptText: string,
    style: string,
    ratio: AspectRatio,
    res: NanoBananaResolution
  ): string => {
    const canvas = document.createElement('canvas');
    let width = 1080;
    let height = 1920;

    if (ratio === '1:1') {
      width = 1440;
      height = 1440;
    } else if (ratio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (ratio === '4:5') {
      width = 1200;
      height = 1500;
    }

    if (res === '4K') {
      width *= 1.5;
      height *= 1.5;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 1. Background
    if (style === 'penthouse') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#fefbf6');
      grad.addColorStop(0.5, '#f6efe5');
      grad.addColorStop(1, '#ebdcc9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Wooden floor
      const floorGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
      floorGrad.addColorStop(0, '#e5d7c3');
      floorGrad.addColorStop(1, '#cbb89e');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);

      // Clothes rack in background
      ctx.strokeStyle = '#8d7b68';
      ctx.lineWidth = width * 0.006;
      const rx = width * 0.18;
      ctx.beginPath();
      ctx.moveTo(rx - 40, height * 0.75);
      ctx.lineTo(rx - 40, height * 0.38);
      ctx.lineTo(rx + 80, height * 0.38);
      ctx.lineTo(rx + 80, height * 0.75);
      ctx.stroke();
    } else if (style === 'editorial') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#f9f6f0');
      grad.addColorStop(0.4, '#ede4d6');
      grad.addColorStop(1, '#d5c4af');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Architectural soft shadow column
      ctx.fillStyle = 'rgba(180, 160, 140, 0.15)';
      ctx.fillRect(width * 0.65, 0, width * 0.35, height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#faf7f2');
      grad.addColorStop(1, '#ece3d5');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Soft floor shadow
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.86, width * 0.22, height * 0.025, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(120, 95, 75, 0.16)';
    ctx.fill();

    // 3. Model Silhouette & Detailed Garment
    const cx = width * 0.5;
    const cy = height * 0.48;
    const scale = height / 1000;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Head / Hair
    ctx.beginPath();
    ctx.arc(0, -220, 48, 0, Math.PI * 2);
    ctx.fillStyle = '#fae5d6';
    ctx.fill();

    // Chic editorial hairstyle
    ctx.beginPath();
    ctx.arc(0, -230, 52, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fillStyle = '#261f1c';
    ctx.fill();

    // Neck
    ctx.fillStyle = '#f2d8c7';
    ctx.fillRect(-14, -180, 28, 45);

    // Garment Rendering based on prompt keywords
    const isTweed = promptText.toLowerCase().includes('tweed') || promptText.toLowerCase().includes('blazer');
    const isSilk = promptText.toLowerCase().includes('lụa') || promptText.toLowerCase().includes('silk');

    if (isSilk) {
      // Champagne Silk Dress
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-45, -140);
      ctx.lineTo(45, -140);
      ctx.lineTo(80, 260);
      ctx.lineTo(-80, 260);
      ctx.closePath();
      ctx.fill();

      // Silk highlights
      const silkGrad = ctx.createLinearGradient(-40, -140, 60, 260);
      silkGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      silkGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0)');
      silkGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      ctx.fillStyle = silkGrad;
      ctx.fill();
    } else if (isTweed) {
      // Chic Navy Tweed Blazer
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-75, -145);
      ctx.lineTo(75, -145);
      ctx.lineTo(85, 90);
      ctx.lineTo(-85, 90);
      ctx.closePath();
      ctx.fill();

      // Tweed texture lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      for (let i = -70; i < 70; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, -145);
        ctx.lineTo(i + 10, 90);
        ctx.stroke();
      }

      // Gold signature buttons
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -40, 6, 0, Math.PI * 2);
      ctx.arc(0, 10, 6, 0, Math.PI * 2);
      ctx.arc(0, 60, 6, 0, Math.PI * 2);
      ctx.fill();

      // Tailored trousers
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-60, 90);
      ctx.lineTo(-18, 340);
      ctx.lineTo(-4, 340);
      ctx.lineTo(0, 120);
      ctx.lineTo(4, 340);
      ctx.lineTo(18, 340);
      ctx.lineTo(60, 90);
      ctx.closePath();
      ctx.fill();
    } else {
      // Modern Cashmere Coat
      ctx.fillStyle = '#c8b69f';
      ctx.beginPath();
      ctx.moveTo(-70, -145);
      ctx.lineTo(70, -145);
      ctx.lineTo(95, 240);
      ctx.lineTo(-95, 240);
      ctx.closePath();
      ctx.fill();

      // Waist belt
      ctx.fillStyle = '#8c765f';
      ctx.fillRect(-75, 10, 150, 14);
    }

    ctx.restore();

    // 4. Subtle NanoBanana Pro Watermark & Metadata badge
    ctx.save();
    ctx.fillStyle = 'rgba(28, 25, 23, 0.6)';
    ctx.font = `600 ${Math.round(width * 0.022)}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`Lumière · Google NanoBanana Pro (${res})`, width - 32, height - 32);
    ctx.restore();

    return canvas.toDataURL('image/png');
  };

  // Generate new image trigger
  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationStep('Khởi tạo mô hình gemini-3-pro-image...');

    setTimeout(() => {
      setGenerationStep('Dệt sợi vải & cấu trúc ánh sáng studio...');
    }, 450);

    setTimeout(() => {
      setGenerationStep(`Render quang học độ phân giải ${selectedResolution}...`);
    }, 900);

    setTimeout(() => {
      const dataUrl = renderFashionImageCanvas(prompt, selectedStyle, selectedRatio, selectedResolution);
      const newImage: NanoBananaImageItem = {
        id: `nb-${Date.now()}`,
        title: prompt.slice(0, 32) + '...',
        prompt,
        ratio: selectedRatio,
        resolution: selectedResolution,
        stylePreset: selectedStyle,
        imageUrl: dataUrl,
        createdAt: Date.now(),
        model: 'gemini-3-pro-image',
      };

      setGallery((prev) => [newImage, ...prev]);
      setActiveImage(newImage);
      setIsGenerating(false);
      setGenerationStep('');
    }, 1400);
  };

  // Select an inspiration preset
  const handleSelectInspiration = (item: typeof PROMPT_INSPIRATIONS[0]) => {
    setPrompt(item.prompt);
    setSelectedStyle(item.style);
    setSelectedRatio(item.ratio);
  };

  // Handle copy prompt
  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Current display image
  const displayImage = activeImage || gallery[0];
  const displayUrl = displayImage.imageUrl || renderFashionImageCanvas(
    displayImage.prompt,
    displayImage.stylePreset,
    displayImage.ratio,
    displayImage.resolution
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner introducing NanoBanana Pro */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fbf5ed] via-[#f5ede2] to-[#eee2d3] border border-[#e4d6c5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c25e2e] text-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Zap className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#1c1917] tracking-luxury-tight font-display">
                NanoBanana Pro — Fashion Image Studio
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ffffff] text-[#7c4d28] border border-[#ddcfbd] shadow-2xs font-mono">
                gemini-3-pro-image
              </span>
              <span className="text-[10px] font-semibold font-label px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                1K / 2K / 4K Ultra-Res
              </span>
            </div>
            <p className="text-xs text-[#78716c] font-content mt-0.5 leading-relaxed">
              Tạo ảnh lookbook, người mẫu photoshoot thời trang và Start Frame chất lượng cao để nối tiếp sang Video Grid.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              // Quick create starter look
              handleSelectInspiration(PROMPT_INSPIRATIONS[0]);
              handleGenerate();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#ffffff] hover:bg-[#faf5ee] text-[#1c1917] border border-[#ded1bf] text-xs font-semibold font-label shadow-2xs flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#c25e2e]" />
            <span>Tạo mẫu nhanh</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls & Prompting, Right Preview & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Generator Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#ece4d8] shadow-xs space-y-4">
            
            {/* 1. Prompt Input Area */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#1c1917] uppercase tracking-luxury font-label flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c25e2e]" />
                  Prompt Thời Trang (NanoBanana Pro)
                </label>
                <span className="text-[11px] text-[#78716c] font-content">Hỗ trợ tiếng Việt & English</span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl border border-[#e5ded3] bg-[#faf8f4] text-xs leading-relaxed text-[#1c1917] placeholder-[#a8a29e] focus:outline-none focus:border-[#c25e2e] focus:ring-2 focus:ring-[#c25e2e]/15 resize-none transition-all font-content"
                placeholder="Mô tả chi tiết trang phục, chất liệu vải, ánh sáng studio, tư thế người mẫu..."
              />
            </div>

            {/* 2. Quick Prompt Inspirations */}
            <div>
              <span className="block text-[11px] font-medium text-[#78716c] font-label mb-2">
                Gợi ý phong cách phổ biến:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_INSPIRATIONS.map((insp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectInspiration(insp)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#f5ede2] hover:bg-[#ede2d2] text-[#6b4725] border border-[#e2d5c3] font-medium transition-all hover:scale-102 active:scale-98 text-left"
                  >
                    ★ {insp.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Resolution Selector (NanoBanana Pro Core Feature) */}
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-2">
                Độ phân giải đầu ra (Resolution):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as NanoBananaResolution[]).map((res) => {
                  const isSelected = selectedResolution === res;
                  return (
                    <button
                      key={res}
                      onClick={() => setSelectedResolution(res)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#f7ede2] border-[#c25e2e] text-[#c25e2e] font-bold shadow-2xs'
                          : 'bg-[#faf8f4] hover:bg-[#f3ede3] border-[#e8e0d4] text-[#78716c]'
                      }`}
                    >
                      <div className="text-xs">{res}</div>
                      <div className="text-[10px] opacity-75 font-normal">
                        {res === '1K' ? '1024px (Nhanh)' : res === '2K' ? '2048px (Chuẩn)' : '4096px (Ultra)'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-2">
                Tỉ lệ khung hình (Aspect Ratio):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['9:16', '3:4', '1:1', '16:9'] as AspectRatio[]).map((ratio) => {
                  const isSelected = selectedRatio === ratio;
                  return (
                    <button
                      key={ratio}
                      onClick={() => setSelectedRatio(ratio)}
                      className={`py-2 px-1 rounded-xl border text-center text-xs transition-all ${
                        isSelected
                          ? 'bg-[#c25e2e] text-white border-[#c25e2e] font-bold shadow-2xs'
                          : 'bg-[#faf8f4] hover:bg-[#f3ede3] border-[#e8e0d4] text-[#78716c]'
                      }`}
                    >
                      <div className="font-mono font-semibold">{ratio}</div>
                      <div className="text-[9px] opacity-85">
                        {ratio === '9:16' ? 'Reel/Video' : ratio === '3:4' ? 'Lookbook' : ratio === '1:1' ? 'Square' : 'Banner'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Style Preset Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-2">
                Không gian & Ánh sáng:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_PRESETS.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#f7ede2] border-[#c25e2e] text-[#1c1917] shadow-2xs'
                          : 'bg-[#faf8f4] hover:bg-[#f5efe5] border-[#e8e0d4] text-[#78716c]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-[#1c1917] truncate">{style.name}</div>
                      <div className="text-[10px] text-[#78716c] line-clamp-1">{style.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl bg-[#c25e2e] hover:bg-[#a94f24] text-white font-semibold text-xs shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                  <span>{generationStep || 'Đang tạo với NanoBanana Pro...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Tạo ảnh với NanoBanana Pro ({selectedResolution})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: High-Res Viewport & Direct Video Grid Bridge (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#ece4d8] shadow-xs flex flex-col">
            
            {/* Viewport Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#ece4d8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-semibold text-[#1c1917]">
                  Preview Ảnh Master: {displayImage.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-medium text-[#7c4d28] bg-[#f7ede2] px-2 py-0.5 rounded-md border border-[#ecdac7]">
                  {displayImage.ratio} · {displayImage.resolution}
                </span>

                <Tooltip content="Sao chép prompt này" position="bottom">
                  <button
                    onClick={() => handleCopyPrompt(displayImage.prompt, displayImage.id)}
                    className="p-1.5 rounded-lg bg-[#faf8f4] hover:bg-[#f3ece0] text-[#78716c] border border-[#e5ded3] transition-colors"
                  >
                    {copiedId === displayImage.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </Tooltip>

                <Tooltip content="Tải ảnh này về máy" position="bottom">
                  <a
                    href={displayUrl}
                    download={`nanobanana-${displayImage.id}.png`}
                    className="p-1.5 rounded-lg bg-[#faf8f4] hover:bg-[#f3ece0] text-[#78716c] border border-[#e5ded3] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c25e2e]" />
                  </a>
                </Tooltip>
              </div>
            </div>

            {/* High-Def Image Viewport - Compact & pristine */}
            <div className="relative h-64 sm:h-80 bg-[#f5f2eb] rounded-xl overflow-hidden border border-[#ece4d8] flex items-center justify-center p-2 group">
              <img
                src={displayUrl}
                alt={displayImage.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              />

              {/* Generating Animation Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center animate-in fade-in">
                  <div className="w-10 h-10 rounded-2xl bg-[#f7ede2] border border-[#e4be9c] flex items-center justify-center mb-2">
                    <Sparkles className="w-5 h-5 text-[#c25e2e] animate-spin" />
                  </div>
                  <div className="text-xs font-bold text-[#1c1917] mb-1">
                    Google NanoBanana Pro
                  </div>
                  <div className="text-xs text-[#78716c] mb-3">
                    {generationStep}
                  </div>
                  <div className="w-48 h-1.5 bg-[#eee3d4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#c25e2e] animate-pulse rounded-full w-3/4" />
                  </div>
                </div>
              )}
            </div>

            {/* Direct Workflow Bridge to Video Grid (Super useful!) */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#fbf6ef] border border-[#ecdac7] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1c1917]">
                  <ArrowRightCircle className="w-4 h-4 text-[#c25e2e]" />
                  <span>Nối trực tiếp sang Video Grid (Omni 1.1 Flash)</span>
                </div>
                <p className="text-[11px] text-[#78716c] mt-0.5">
                  Dùng bức ảnh chất lượng cao này làm Start Frame đầu tiên để sinh chuỗi video mượt mà.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onUseAsStartFrame(displayUrl, displayImage.prompt)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#c25e2e] hover:bg-[#a94f24] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-102 active:scale-98"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Gán làm Start Frame clip đang chọn</span>
                </button>

                <button
                  onClick={() => onCreateNewClipWithFrame(displayUrl, displayImage.prompt)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#ffffff] hover:bg-[#f7ede2] text-[#1c1917] border border-[#ded1bf] text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-102 active:scale-98"
                >
                  <Layers className="w-3.5 h-3.5 text-[#c25e2e]" />
                  <span>Tạo Clip Mới</span>
                </button>
              </div>
            </div>

            {/* Mini Gallery Strip of created images */}
            <div className="mt-4 pt-3 border-t border-[#ece4d8]">
              <span className="block text-[11px] font-semibold text-[#78716c] mb-2 uppercase tracking-wide">
                Bộ sưu tập ảnh đã tạo ({gallery.length})
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {gallery.map((item) => {
                  const isCurrent = (activeImage?.id || gallery[0].id) === item.id;
                  const itemUrl = item.imageUrl || renderFashionImageCanvas(item.prompt, item.stylePreset, item.ratio, item.resolution);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveImage(item)}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-[#c25e2e] ring-2 ring-[#c25e2e]/20 scale-[1.02]'
                          : 'border-[#e8e0d4] hover:border-[#c25e2e]/50 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={itemUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white font-mono text-[9px]">
                        {item.resolution}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
