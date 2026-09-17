import React, { useRef, useEffect, useState } from 'react';
import { AspectRatio, VideoClipItem } from '../types';
import { 
  Play, Pause, RotateCcw, Camera, Download, Sparkles, 
  ShieldCheck, Cpu, ArrowRightCircle, Copy, Edit3, Trash2
} from 'lucide-react';
import { Tooltip } from './Tooltip';

interface VideoGridItemCardProps {
  clip: VideoClipItem;
  clipIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  onGenerate: () => void;
  onExtractEndFrame: (dataUrl: string) => void;
  onChainToNext: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canDelete: boolean;
  isAnyGenerating: boolean;
}

export const VideoGridItemCard: React.FC<VideoGridItemCardProps> = ({
  clip,
  clipIndex,
  isSelected,
  onSelect,
  onGenerate,
  onExtractEndFrame,
  onChainToNext,
  onDuplicate,
  onDelete,
  canDelete,
  isAnyGenerating,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const config = clip.config;

  // Aspect ratio canvas dimensions
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

  // Canvas render animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = currentTime;
    let animId: number;

    const render = () => {
      if (isPlaying && clip.status !== 'generating') {
        localTime = (localTime + 0.033) % config.duration;
        setCurrentTime(localTime);
      }

      const t = localTime;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Draw Background
      if (config.backgroundStyle.id === 'bg-industrial-penthouse') {
        // Aesthetic Bright Daylight Industrial Penthouse with clothes racks
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.7);
        skyGrad.addColorStop(0, '#fefbf6');
        skyGrad.addColorStop(0.5, '#f5efe4');
        skyGrad.addColorStop(1, '#fde8d7'); // warm sunlit horizon
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.7);

        // Concrete polished wall
        ctx.fillStyle = '#ece5d9';
        ctx.fillRect(0, canvasHeight * 0.45, canvasWidth, canvasHeight * 0.55);

        // Modern city skyline silhouettes outside panorama glass
        ctx.fillStyle = '#dfd5c5';
        const bWidth = canvasWidth * 0.08;
        for (let i = 0; i < 15; i++) {
          const bH = 50 + Math.sin(i * 1.6) * 35;
          ctx.fillRect(i * bWidth * 1.1, canvasHeight * 0.45 - bH, bWidth, bH);
        }

        // Industrial steel window frame
        ctx.strokeStyle = '#c5b8a5';
        ctx.lineWidth = 3;
        ctx.strokeRect(16, 16, canvasWidth - 32, canvasHeight * 0.43);
        ctx.beginPath();
        ctx.moveTo(canvasWidth / 2, 16);
        ctx.lineTo(canvasWidth / 2, canvasHeight * 0.45);
        ctx.stroke();

        // Warm light oak wooden floor
        const floorGrad = ctx.createLinearGradient(0, canvasHeight * 0.7, 0, canvasHeight);
        floorGrad.addColorStop(0, '#e5d7c3');
        floorGrad.addColorStop(1, '#d8c4ab');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, canvasHeight * 0.7, canvasWidth, canvasHeight * 0.3);

        // Wooden planks perspective lines
        ctx.strokeStyle = 'rgba(180, 160, 135, 0.4)';
        ctx.lineWidth = 1;
        for (let x = -100; x < canvasWidth + 100; x += 60) {
          ctx.beginPath();
          ctx.moveTo(canvasWidth / 2, canvasHeight * 0.7);
          ctx.lineTo(x, canvasHeight);
          ctx.stroke();
        }

        // Clothes rack on left (Industrial steel + oak rod)
        const rackX = canvasWidth * 0.14;
        ctx.strokeStyle = '#8d7b68';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(rackX - 25, canvasHeight * 0.75);
        ctx.lineTo(rackX - 25, canvasHeight * 0.42);
        ctx.lineTo(rackX + 40, canvasHeight * 0.42);
        ctx.lineTo(rackX + 40, canvasHeight * 0.75);
        ctx.stroke();

        // Warm oak top rod
        ctx.fillStyle = '#b45309';
        ctx.fillRect(rackX - 28, canvasHeight * 0.415, 72, 4);

        // Hanging pastel clothes
        const clothesColors = ['#f43f5e', '#38bdf8', '#fbbf24', '#c084fc', '#4ade80'];
        clothesColors.forEach((color, idx) => {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          const cx = rackX - 18 + idx * 12;
          const cy = canvasHeight * 0.42 + 4;
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + 6, cy + 45 + Math.sin(idx) * 8);
          ctx.lineTo(cx - 6, cy + 45 + Math.sin(idx) * 8);
          ctx.closePath();
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      } else {
        // Clean neutral pastel background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        bgGrad.addColorStop(0, '#faf8f5');
        bgGrad.addColorStop(1, '#f0eae1');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // 2. Animate Model Character & Garment
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight * 0.52;
      const sway = Math.sin(t * 3.2) * 12;
      const verticalBounce = Math.abs(Math.sin(t * 3.2)) * 7;
      const scaleWalk = 0.96 + Math.sin(t * 1.5) * 0.04;

      ctx.save();
      ctx.translate(centerX + sway, centerY - verticalBounce);
      ctx.scale(scaleWalk, scaleWalk);

      // Model soft shadow
      ctx.beginPath();
      ctx.ellipse(0, canvasHeight * 0.28, 50 + Math.abs(sway), 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 80, 60, 0.18)';
      ctx.fill();

      // Head & Skin
      ctx.beginPath();
      ctx.arc(0, -140, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#fce7db';
      ctx.fill();

      // Hair
      ctx.beginPath();
      ctx.arc(0, -145, 26, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fillStyle = '#2d2420';
      ctx.fill();

      // Body / Torso
      // CRITICAL CHECK: selectedProduct === null => KEEP ORIGINAL GARMENT!
      if (config.product === null) {
        // Preserved Original Video Ref Garment (Chic Tailored Jumpsuit)
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.moveTo(-35, -100);
        ctx.lineTo(35, -100);
        ctx.lineTo(40 + sway * 0.3, 10);
        ctx.lineTo(-40 + sway * 0.3, 10);
        ctx.closePath();
        ctx.fill();

        // Lapel line
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-20, -100);
        ctx.lineTo(0, -40);
        ctx.lineTo(20, -100);
        ctx.stroke();

        // Pants
        ctx.fillStyle = '#1f2937';
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
        // Replaced with Selected Product
        if (config.product.id === 'prod-blazer-tweed') {
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(-44, -102);
          ctx.lineTo(44, -102);
          ctx.lineTo(48 + sway * 0.4, 40);
          ctx.lineTo(-48 + sway * 0.4, 40);
          ctx.closePath();
          ctx.fill();

          // Gold buttons
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(0, -30, 4, 0, Math.PI * 2);
          ctx.arc(0, 5, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (config.product.id === 'prod-silk-slipdress') {
          // Champagne silk
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(-25, -95);
          ctx.lineTo(25, -95);
          ctx.lineTo(45 + sway * 0.6, 120);
          ctx.lineTo(-45 + sway * 0.6, 120);
          ctx.closePath();
          ctx.fill();
        } else {
          // Custom / other garments
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(-38, -100);
          ctx.lineTo(38, -100);
          ctx.lineTo(42 + sway * 0.4, 60);
          ctx.lineTo(-42 + sway * 0.4, 60);
          ctx.closePath();
          ctx.fill();
        }

        // Legs
        ctx.fillStyle = '#fce7db';
        ctx.fillRect(-15, 70, 10, 100);
        ctx.fillRect(5, 70, 10, 100);
      }

      ctx.restore();

      // 3. Affiliate CTA Overlay
      if (config.affiliateOverlay.showCtaBanner) {
        ctx.save();
        const bannerH = 46;
        const bannerY = canvasHeight - bannerH - 24;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.5;

        // Rounded pill banner
        ctx.beginPath();
        ctx.roundRect(24, bannerY, canvasWidth - 48, bannerH, 23);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#c2410c';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(config.affiliateOverlay.ctaText, canvasWidth / 2, bannerY + 28);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, config, clip.status, canvasWidth, canvasHeight]);

  // Handle extract end frame click
  const handleExtractEndFrame = (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onExtractEndFrame(dataUrl);
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl bg-[#ffffff] border transition-all duration-200 overflow-hidden shadow-xs flex flex-col cursor-pointer ${
        isSelected
          ? 'border-[#c25e2e] ring-2 ring-[#c25e2e]/20'
          : 'border-[#e8e2d8] hover:border-[#d5ccc0]'
      }`}
    >
      {/* 1. Card Header */}
      <div className="px-3.5 py-2.5 bg-[#faf8f4] border-b border-[#ece4d8] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-5 h-5 rounded-full bg-[#f2ebe0] text-[#786c5f] text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {clipIndex + 1}
          </span>
          <h3 className="text-xs font-semibold text-[#1c1917] truncate font-display tracking-luxury-tight">
            {clip.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[11px] font-mono font-medium text-[#78716c] bg-[#ffffff] px-2 py-0.5 rounded-lg border border-[#e5dfd5]">
            {config.ratio} · {config.duration.toFixed(1)}s
          </span>

          {clip.status === 'completed' && (
            <span className="text-[11px] font-medium font-label text-[#2e7d32] bg-[#f5f9f5] px-2 py-0.5 rounded-lg border border-[#d6e7d6]">
              Đã Render
            </span>
          )}
          {clip.status === 'generating' && (
            <span className="text-[11px] font-medium font-label text-[#b45309] bg-[#fffbeb] px-2 py-0.5 rounded-lg border border-[#fef08a] animate-pulse">
              Đang tạo {clip.progress}%
            </span>
          )}
        </div>
      </div>

      {/* 2. Card Viewport with Canvas Player - Compact height (50% reduction) with clean borderless view, no bottom line */}
      <div className="relative h-44 sm:h-52 bg-[#f5f2eb] overflow-hidden flex items-center justify-center group">
        {/* Top-Right Mini Control Group: Play/Pause & Extract End Frame (Icon-only with Tooltips) */}
        <div className="absolute top-2 right-2 z-30 flex items-center gap-1.5">
          <Tooltip content={isPlaying ? "Tạm dừng video" : "Phát tiếp video"} position="left">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="p-1.5 rounded-full bg-[#ffffff]/90 hover:bg-[#ffffff] text-[#57534e] hover:text-[#1c1917] border border-[#e2dad0] shadow-2xs hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 sm:opacity-90"
              aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-[#c25e2e]" />}
            </button>
          </Tooltip>

          <Tooltip content="Trích xuất End Frame của video này" position="left">
            <button
              onClick={handleExtractEndFrame}
              className="p-1.5 rounded-full bg-[#ffffff]/95 hover:bg-[#ffffff] text-[#c25e2e] border border-[#e2dad0] shadow-2xs hover:border-[#c25e2e] hover:scale-105 active:scale-95 transition-all"
              aria-label="Trích xuất End Frame"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>

        {/* Garment status pill (Top Left) */}
        <div className="absolute top-2 left-2 z-20">
          {config.product === null ? (
            <span className="px-2 py-0.5 rounded-full bg-[#ffffff]/95 text-[#2e7d32] text-[10px] font-medium flex items-center gap-1 border border-[#d6e7d6] shadow-2xs">
              <ShieldCheck className="w-2.5 h-2.5" /> Giữ đồ gốc
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#ffffff]/95 text-[#78542b] text-[10px] font-medium flex items-center gap-1 border border-[#ebdccb] shadow-2xs truncate max-w-[120px]">
              <Sparkles className="w-2.5 h-2.5 text-[#c25e2e]" /> {config.product.name.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Canvas Engine */}
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
            className="w-full h-full object-contain"
          />
        </div>

        {/* Generating Overlay */}
        {clip.status === 'generating' && (
          <div className="absolute inset-0 z-40 bg-[#ffffff]/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-[#faf5ee] border border-[#e8dfd2] flex items-center justify-center mb-1.5">
              <Cpu className="w-4 h-4 text-[#c25e2e] animate-spin" />
            </div>
            <div className="text-[11px] font-semibold text-[#1c1917] mb-0.5">
              Google Omni 1.1 Flash
            </div>
            <div className="text-[10px] text-[#78716c] font-normal mb-2 truncate max-w-[170px]">
              {clip.generationStep}
            </div>
            <div className="w-32 h-1 bg-[#f0eae0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c25e2e] transition-all duration-300 rounded-full"
                style={{ width: `${clip.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Card Footer Actions - Minimalist Icons with Hover Descriptions */}
      <div className="p-2 bg-[#ffffff] border-t border-[#ece4d8] flex items-center justify-between gap-1.5">
        <Tooltip content="Tạo lại video này với Omni 1.1 Flash" position="top" className="flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerate();
            }}
            disabled={isAnyGenerating}
            className="w-full py-2 px-2.5 rounded-xl bg-[#faf5ee] hover:bg-[#f3ece0] text-[#c25e2e] border border-[#ebdccb] flex items-center justify-center transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95"
            aria-label="Tạo lại video"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content="Nối tiếp: Đặt End Frame làm Start Frame clip kế" position="top">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChainToNext();
            }}
            className="p-2 rounded-xl bg-[#ffffff] hover:bg-[#f7f5f1] text-[#57534e] hover:text-[#1c1917] border border-[#e5ded3] transition-all hover:scale-105 active:scale-95"
            aria-label="Nối tiếp End Frame"
          >
            <ArrowRightCircle className="w-3.5 h-3.5 text-[#78716c]" />
          </button>
        </Tooltip>

        <Tooltip content="Nhân bản clip này" position="top">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-2 rounded-xl text-[#78716c] hover:bg-[#f7f5f1] hover:text-[#1c1917] border border-[#e5ded3] transition-all hover:scale-105 active:scale-95"
            aria-label="Nhân bản clip"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {canDelete && (
          <Tooltip content="Xóa clip này khỏi grid" position="top">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-xl text-[#a84d4d] hover:bg-[#fdf2f2] border border-[#f5d5d5] transition-all hover:scale-105 active:scale-95"
              aria-label="Xóa clip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
