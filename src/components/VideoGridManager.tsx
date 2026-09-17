import React, { useState } from 'react';
import { VideoClipItem } from '../types';
import { VideoGridItemCard } from './VideoGridItemCard';
import { Tooltip } from './Tooltip';
import { 
  Sparkles, Plus, Play, Pause, LayoutGrid, Grid, 
  ArrowRightCircle, CheckCircle2, Film, Layers 
} from 'lucide-react';

interface VideoGridManagerProps {
  clips: VideoClipItem[];
  selectedClipId: string;
  onSelectClip: (id: string) => void;
  onGenerateClip: (id: string) => void;
  onBatchGenerate: () => void;
  onAddNewClip: () => void;
  onDuplicateClip: (id: string) => void;
  onDeleteClip: (id: string) => void;
  onExtractEndFrame: (clipId: string, dataUrl: string) => void;
  onChainClipEndToNextStart: (sourceClipId: string) => void;
  onAutoChainAllClips: () => void;
  isAnyGenerating: boolean;
  allPlaying: boolean;
  onTogglePlayAll: () => void;
}

export const VideoGridManager: React.FC<VideoGridManagerProps> = ({
  clips,
  selectedClipId,
  onSelectClip,
  onGenerateClip,
  onBatchGenerate,
  onAddNewClip,
  onDuplicateClip,
  onDeleteClip,
  onExtractEndFrame,
  onChainClipEndToNextStart,
  onAutoChainAllClips,
  isAnyGenerating,
  allPlaying,
  onTogglePlayAll,
}) => {
  const [columns, setColumns] = useState<2 | 3 | 4>(3);

  // Dynamic grid column class
  const getGridColsClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
    }
  };

  const completedCount = clips.filter((c) => c.status === 'completed').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f6f1] overflow-hidden">
      {/* 1. Grid Manager Top Bar */}
      <div className="px-4 sm:px-6 py-3 bg-[#ffffff] border-b border-[#e7e2d9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#faf5ee] border border-[#e8dfd2] flex items-center justify-center text-[#c25e2e]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1c1917] tracking-luxury-tight font-display">
                Video Grid Studio
              </h2>
              <span className="text-[11px] font-medium font-label text-[#2e7d32] bg-[#f5f9f5] px-2 py-0.5 rounded-full border border-[#d6e7d6]">
                {completedCount}/{clips.length} Đã Tạo
              </span>
            </div>
            <p className="text-xs text-[#78716c] font-content leading-relaxed">
              Quản lý đồng thời · Tối đa 10s · Trích xuất End Frame & Nối chuỗi linh hoạt
            </p>
          </div>
        </div>

        {/* Action Controls & Column Layout Switcher - Minimalist Icons with Tooltips */}
        <div className="flex items-center gap-2">
          {/* Column selector */}
          <div className="hidden sm:flex items-center bg-[#f5f2eb] p-1 rounded-xl border border-[#ded8cf]">
            {[2, 3, 4].map((col) => (
              <Tooltip key={col} content={`Bố cục hiển thị ${col} cột`} position="bottom">
                <button
                  onClick={() => setColumns(col as 2 | 3 | 4)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    columns === col
                      ? 'bg-[#ffffff] text-[#1c1917] shadow-xs'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                  aria-label={`${col} cột`}
                >
                  {col} Cột
                </button>
              </Tooltip>
            ))}
          </div>

          {/* Auto-Chain frames button */}
          <Tooltip content="Auto-chain: Tự động nối End Frame từng clip sang Start Frame clip kế tiếp" position="bottom">
            <button
              onClick={onAutoChainAllClips}
              className="p-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f7f5f1] text-[#57534e] hover:text-[#1c1917] border border-[#e5ded3] transition-all hover:scale-105 active:scale-95"
              aria-label="Auto-Chain khung hình"
            >
              <ArrowRightCircle className="w-4 h-4 text-[#c25e2e]" />
            </button>
          </Tooltip>

          {/* Add clip button */}
          <Tooltip content="Thêm clip mới vào Video Grid" position="bottom">
            <button
              onClick={onAddNewClip}
              className="p-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f7f5f1] text-[#1c1917] border border-[#e5ded3] transition-all hover:scale-105 active:scale-95"
              aria-label="Thêm video mới"
            >
              <Plus className="w-4 h-4 text-[#c25e2e]" />
            </button>
          </Tooltip>

          {/* Batch generate button */}
          <Tooltip content={isAnyGenerating ? 'Đang render batch...' : 'Tạo tất cả video trong grid với Omni 1.1 Flash'} position="bottom">
            <button
              onClick={onBatchGenerate}
              disabled={isAnyGenerating}
              className="p-2.5 rounded-xl bg-[#c25e2e] hover:bg-[#a94f24] text-white shadow-xs transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
              aria-label="Tạo tất cả video"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 2. Scrollable Video Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <div className={`grid gap-4 ${getGridColsClass()}`}>
          {clips.map((clip, index) => (
            <VideoGridItemCard
              key={clip.id}
              clip={clip}
              clipIndex={index}
              isSelected={clip.id === selectedClipId}
              onSelect={() => onSelectClip(clip.id)}
              onGenerate={() => onGenerateClip(clip.id)}
              onExtractEndFrame={(dataUrl) => onExtractEndFrame(clip.id, dataUrl)}
              onChainToNext={() => onChainClipEndToNextStart(clip.id)}
              onDuplicate={() => onDuplicateClip(clip.id)}
              onDelete={() => onDeleteClip(clip.id)}
              canDelete={clips.length > 1}
              isAnyGenerating={isAnyGenerating}
            />
          ))}

          {/* "+ Thêm Video Mới" Interactive Grid Card */}
          <button
            onClick={onAddNewClip}
            className="rounded-3xl border-2 border-dashed border-[#e2d8ca] hover:border-[#ea580c] hover:bg-[#fffbf6] transition-all p-6 flex flex-col items-center justify-center text-center min-h-[360px] group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#ffffff] group-hover:bg-[#ffedd5] border border-[#e5ded4] group-hover:border-[#fed7aa] flex items-center justify-center text-[#78716c] group-hover:text-[#ea580c] mb-3 transition-colors shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#44403c] group-hover:text-[#ea580c] transition-colors">
              Thêm Video Mới Vào Grid
            </h3>
            <p className="text-xs text-[#a8a29e] mt-1 max-w-[200px]">
              Tạo thêm biến thể trang phục, góc quay hoặc bối cảnh mới
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
