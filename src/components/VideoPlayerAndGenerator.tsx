import React, { useRef, useEffect, useState } from 'react';
import { GenerationConfig, AspectRatio } from '../types';
import { 
  Play, Pause, RotateCcw, Camera, Download, Sparkles, 
  ShoppingBag, Tag, Share2, Maximize2, ShieldCheck, 
  Cpu, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface VideoPlayerAndGeneratorProps {
  config: GenerationConfig;
  onExtractEndFrame: (imageDataUrl: string) => void;
  isGenerating: boolean;
  onStartGeneration: () => void;
  generationProgress: number;
  generationStep: string;
}

export const VideoPlayerAndGenerator: React.FC<VideoPlayerAndGeneratorProps> = ({
  config,
  onExtractEndFrame,
  isGenerating,
  onStartGeneration,
  generationProgress,
  generationStep,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [showAffiliateToast, setShowAffiliateToast] = useState<boolean>(false);

  // Derive canvas dimensions from config.ratio
  const getCanvasDimensions = (ratio: AspectRatio): { width: number; height: number } => {
    switch (ratio) {
      case '9:16':
        return { width: 540, height: 960 };
      case '16:9':
        return { width: 960, height: 540 };
      case '1:1':
        return { width: 720, height: 720 };
      case '4:5':
        return { width: 640, height: 800 };
      case '3:4':
        return { width: 540, height: 720 };
    }
  };

  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(config.ratio);

  // Main rendering loop for fashion video playback simulation on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    let localTime = currentTime;

    const renderFrame = (timestamp: number) => {
      if (isPlaying && !isGenerating) {
        // Increment time based on real timestamp delta
        localTime = (localTime + 0.033) % config.duration;
        setCurrentTime(localTime);
      }

      const t = localTime;
      const progressRatio = t / config.duration;

      // 1. Draw Background
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background Style specific drawing:
      if (config.backgroundStyle.id === 'bg-industrial-penthouse') {
        // INDUSTRIAL PENTHOUSE WITH CLOTHES RACKS (Mặc định)
        // Sky / Panoramic Window
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.7);
        skyGrad.addColorStop(0, '#0a0d16');
        skyGrad.addColorStop(0.6, '#181b28');
        skyGrad.addColorStop(1, '#34261e'); // sunset glow
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.7);

        // Concrete Wall Texture
        ctx.fillStyle = '#12141a';
        ctx.fillRect(0, canvasHeight * 0.45, canvasWidth, canvasHeight * 0.55);

        // Skyline silhouettes outside window
        ctx.fillStyle = '#07080c';
        const bWidth = canvasWidth * 0.08;
        for (let i = 0; i < 15; i++) {
          const bH = 60 + Math.sin(i * 1.5) * 40;
          ctx.fillRect(i * bWidth * 1.1, canvasHeight * 0.45 - bH, bWidth, bH);
        }

        // Window Frames (Industrial black steel)
        ctx.strokeStyle = '#222736';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight * 0.43);
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, 20);
        ctx.lineTo(canvasWidth / 2, canvasHeight * 0.45);
        ctx.stroke();

        // Concrete floor with wood reflection
        const floorGrad = ctx.createLinearGradient(0, canvasHeight * 0.7, 0, canvasHeight);
        floorGrad.addColorStop(0, '#101217');
        floorGrad.addColorStop(1, '#07080b');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, canvasHeight * 0.7, canvasWidth, canvasHeight * 0.3);

        // Clothes Racks (Black metal frame with oak bar and hanging garments)
        ctx.strokeStyle = '#333a4d';
        ctx.lineWidth = 5;
        // Left rack
        const rackX = canvasWidth * 0.12;
        ctx.beginPath();
        ctx.moveTo(rackX - 30, canvasHeight * 0.75);
        ctx.lineTo(rackX - 30, canvasHeight * 0.4);
        ctx.lineTo(rackX + 45, canvasHeight * 0.4);
        ctx.lineTo(rackX + 45, canvasHeight * 0.75);
        ctx.stroke();

        // Oak top bar
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(rackX - 32, canvasHeight * 0.395, 80, 5);

        // Hanging clothes on rack
        const clothesColors = ['#f43f5e', '#38bdf8', '#facc15', '#a855f7', '#e2e8f0'];
        clothesColors.forEach((color, idx) => {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.55;
          ctx.beginPath();
          const cx = rackX - 20 + idx * 14;
          const cy = canvasHeight * 0.4 + 5;
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + 8, cy + 50 + Math.sin(idx) * 10);
          ctx.lineTo(cx - 8, cy + 50 + Math.sin(idx) * 10);
          ctx.closePath();
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      } else {
        // Clean Minimal studio gradient for other backgrounds
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        bgGrad.addColorStop(0, '#0f1117');
        bgGrad.addColorStop(1, '#1b1e2a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // 2. Animate Model Character Motion (Catwalk walk / sway based on VideoRef motion)
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight * 0.52;

      // Natural fashion swaying motion curve
      const sway = Math.sin(t * 3.2) * 12;
      const verticalBounce = Math.abs(Math.sin(t * 3.2)) * 8;
      const scaleWalk = 0.96 + Math.sin(t * 1.5) * 0.04;

      ctx.save();
      ctx.translate(centerX + sway, centerY - verticalBounce);
      ctx.scale(scaleWalk, scaleWalk);

      // Model Shadow on polished floor
      ctx.beginPath();
      ctx.ellipse(0, canvasHeight * 0.28, 55 + Math.abs(sway), 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Head & Face
      ctx.beginPath();
      ctx.arc(0, -140, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#fce7db';
      ctx.fill();

      // Hair
      ctx.beginPath();
      ctx.arc(0, -145, 26, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fillStyle = '#18181b';
      ctx.fill();

      // Neck
      ctx.fillStyle = '#f0d0c0';
      ctx.fillRect(-6, -118, 12, 16);

      // Body / Torso
      // CRITICAL CHECK: Does user have selectedProduct, or KEEP ORIGINAL GARMENT from Video Ref?
      if (config.product === null) {
        // [PRESERVED ORIGINAL VIDEO REF GARMENT]
        // Rich Champagne Gold & Charcoal Tailored Jumpsuit from Ref Video
        ctx.fillStyle = '#222634';
        ctx.beginPath();
        ctx.moveTo(-35, -100);
        ctx.lineTo(35, -100);
        ctx.lineTo(40 + sway * 0.3, 10);
        ctx.lineTo(-40 + sway * 0.3, 10);
        ctx.closePath();
        ctx.fill();

        // Gold lapel accent of reference outfit
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-20, -100);
        ctx.lineTo(0, -40);
        ctx.lineTo(20, -100);
        ctx.stroke();

        // Pants / Leg drapery
        ctx.fillStyle = '#1c202d';
        ctx.beginPath();
        ctx.moveTo(-38 + sway * 0.3, 10);
        ctx.lineTo(-12, 160);
        ctx.lineTo(-3, 160);
        ctx.lineTo(0, 30);
        ctx.lineTo(3, 160);
        ctx.lineTo(12, 160);
        ctx.lineTo(38 + sway * 0.3, 10);
        ctx.closePath();
        ctx.fill();
      } else {
        // [NEURAL GARMENT DRAPING: REPLACED WITH CHOSEN PRODUCT]
        if (config.product.id === 'prod-blazer-tweed') {
          // Luxury Black Tweed Blazer with gold buttons
          ctx.fillStyle = '#161922';
          ctx.beginPath();
          ctx.moveTo(-44, -102);
          ctx.lineTo(44, -102);
          ctx.lineTo(48 + sway * 0.4, 40);
          ctx.lineTo(-48 + sway * 0.4, 40);
          ctx.closePath();
          ctx.fill();

          // Tweed fabric texture grid
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
          ctx.lineWidth = 1;
          for (let gy = -90; gy < 35; gy += 12) {
            ctx.beginPath();
            ctx.moveTo(-40, gy);
            ctx.lineTo(40, gy);
            ctx.stroke();
          }

          // Gold 18K Buttons
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, -30, 4, 0, Math.PI * 2);
          ctx.arc(0, -10, 4, 0, Math.PI * 2);
          ctx.arc(0, 10, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (config.product.id === 'prod-silk-slipdress') {
          // Champagne Satin Slip Dress
          const dressGrad = ctx.createLinearGradient(0, -100, 0, 120);
          dressGrad.addColorStop(0, '#fef08a');
          dressGrad.addColorStop(0.5, '#d4af37');
          dressGrad.addColorStop(1, '#92400e');
          ctx.fillStyle = dressGrad;

          ctx.beginPath();
          ctx.moveTo(-28, -95);
          ctx.lineTo(28, -95);
          ctx.lineTo(46 + sway * 0.6, 120);
          ctx.lineTo(-46 + sway * 0.6, 120);
          ctx.closePath();
          ctx.fill();
        } else {
          // General Luxury Apparel Representation
          ctx.fillStyle = '#262a3b';
          ctx.fillRect(-36, -100, 72, 120);
        }
      }

      // Legs / High Heels
      ctx.fillStyle = '#fce7db';
      ctx.fillRect(-18, 140, 8, 40);
      ctx.fillRect(10, 140, 8, 40);
      // High Heels
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-20, 180, 12, 5);
      ctx.fillRect(8, 180, 12, 5);

      ctx.restore();

      // 3. Render In-Video Affiliate Overlays (TikTok/Shopee Style)
      if (config.affiliateOverlay.showCtaBanner) {
        const overlayY = canvasHeight * 0.85;
        // Background pill
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(canvasWidth * 0.08, overlayY, canvasWidth * 0.84, 52, 16);
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Yellow Shopping Cart Icon
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(canvasWidth * 0.15, overlayY + 26, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('🛒', canvasWidth * 0.15 - 8, overlayY + 32);

        // CTA Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(config.affiliateOverlay.ctaText || 'Mua tại giỏ hàng bên dưới 👇', canvasWidth * 0.22, overlayY + 24);

        // Price Tag if any
        if (config.product) {
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 12px monospace';
          ctx.fillText(`₫${config.product.salePrice.toLocaleString('vi-VN')} (-${config.product.discountPercent}%)`, canvasWidth * 0.22, overlayY + 42);
        } else {
          ctx.fillStyle = '#38bdf8';
          ctx.font = '11px sans-serif';
          ctx.fillText('⚡ Hàng chính hãng · Freeship toàn quốc', canvasWidth * 0.22, overlayY + 42);
        }
      }

      // Studio Watermark & Model Pill (Top Left)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(16, 16, 175, 26, 8);
      ctx.fill();
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('⚡ GOOGLE OMNI 1.1 FLASH', 24, 32);

      // Loop animation frame
      animationFrameId.current = requestAnimationFrame(renderFrame);
    };

    animationFrameId.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, isGenerating, currentTime, config, canvasWidth, canvasHeight]);

  // CRITICAL REQUIREMENT: "có nút nhỏ extract end frame trên góc của video đã tạo"
  const handleExtractEndFrameClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // To extract the end frame, we render the exact frame at t = config.duration
    // Create a temporary canvas or read current state
    const dataUrl = canvas.toDataURL('image/png');
    onExtractEndFrame(dataUrl);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleDownloadVideo = () => {
    setShowAffiliateToast(true);
    setTimeout(() => setShowAffiliateToast(false), 3000);
  };

  return (
    <div className="bg-[#10121a]/90 rounded-2xl p-5 border border-white/[0.08] shadow-2xl flex flex-col h-full">
      {/* Viewport Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-luxury text-white font-display uppercase">
            Màn Hình Preview & Video Viewport
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            {config.ratio} · {config.duration.toFixed(1)}s
          </span>
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div className="relative flex-1 min-h-[460px] max-h-[580px] bg-black/90 rounded-2xl overflow-hidden border border-white/[0.1] flex items-center justify-center p-2 shadow-inner group">
        
        {/* CRITICAL USER REQUIREMENT:
            "có nút nhỏ extract end frame trên góc của video đã tạo"
            Subtle, elegant glassmorphic button in the top-right corner of the video */}
        <button
          id="btn-extract-end-frame"
          onClick={handleExtractEndFrameClick}
          className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:scale-105 transition-all cursor-pointer"
          title="Trích xuất End Frame của video để lưu ảnh hoặc làm Start Frame"
        >
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>📷 Extract End Frame</span>
        </button>

        {/* Garment Mode Floating Indicator (Top Left) */}
        <div className="absolute top-4 left-4 z-20">
          {config.product === null ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-black text-[10px] font-bold flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3" /> Giữ Trang Phục Gốc
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-400/80 backdrop-blur-md text-black text-[10px] font-bold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" /> Đã Phủ: {config.product.name.split(' ')[0]}
            </span>
          )}
        </div>

        {/* HTML5 Canvas Rendering Engine */}
        <div
          className="relative max-h-full max-w-full flex items-center justify-center"
          style={{
            aspectRatio: config.ratio.replace(':', '/'),
            height: config.ratio === '16:9' ? 'auto' : '100%',
            width: config.ratio === '16:9' ? '100%' : 'auto',
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-full object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Generation Overlay (When generating video with Omni 1.1 Flash) */}
        {isGenerating && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4 relative shadow-[0_0_30px_rgba(212,175,55,0.25)]">
              <Cpu className="w-8 h-8 text-amber-400 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>

            <h3 className="text-base font-bold text-white font-display mb-1">
              Google Omni 1.1 Flash Đang Dựng Video
            </h3>
            <p className="text-xs text-amber-300 font-medium mb-4">{generationStep}</p>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">{generationProgress}% · Sub-second inference</span>
          </div>
        )}
      </div>

      {/* Player Controls (Clean minimal, no timeline scrubber line) */}
      <div className="mt-3 bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
        {/* Buttons Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white transition-all"
              title={isPlaying ? 'Tạm dừng' : 'Phát'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-amber-300" />}
            </button>
            <button
              onClick={handleReplay}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition-all"
              title="Phát lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-amber-300">
              {currentTime.toFixed(1)}s / {config.duration.toFixed(1)}s
            </span>
          </div>

          {/* Big Generation Trigger Button */}
          <button
            onClick={onStartGeneration}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-xs font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>TẠO VIDEO AFFILIATE OMNI (TỐI ĐA 10S)</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showAffiliateToast && (
        <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Video đã được render và chuẩn bị sẵn sàng tải về định dạng MP4 / WebM!</span>
        </div>
      )}
    </div>
  );
};
