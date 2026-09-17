import React from 'react';
import { Sparkles, Cpu, Film, HelpCircle, Layers, Plus, Play, Pause, Image as ImageIcon, Video } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { ActiveStudioSection } from '../types';

interface HeaderProps {
  activeSection: ActiveStudioSection;
  onChangeSection: (section: ActiveStudioSection) => void;
  onOpenGuide: () => void;
  onOpenPromptInspector: () => void;
  clipCount: number;
  selectedClipTitle: string;
  onBatchGenerate: () => void;
  isAnyGenerating: boolean;
  onAddNewClip: () => void;
  allPlaying: boolean;
  onTogglePlayAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onChangeSection,
  onOpenGuide,
  onOpenPromptInspector,
  clipCount,
  selectedClipTitle,
  onBatchGenerate,
  isAnyGenerating,
  onAddNewClip,
  allPlaying,
  onTogglePlayAll,
}) => {
  return (
    <header className="border-b border-[#ded3c2] bg-gradient-to-r from-[#fbf6ef] via-[#f4eadc] to-[#ede1d0] shadow-[0_4px_20px_-4px_rgba(50,35,20,0.08)] sticky top-0 z-40 transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand identity - Refined & Distinct */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c25e2e] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-luxury-tight text-[#1c1917] font-display">
                Lumière Omni
              </span>
              <span className="text-[11px] font-medium font-label px-2 py-0.5 rounded-full bg-white/90 text-[#7c4d28] border border-[#ded2c1] shadow-2xs">
                Pastel Studio
              </span>
            </div>
            <p className="text-xs text-[#78716c] font-content hidden sm:block">
              Omni 1.1 Flash Video Grid & NanoBanana Pro Image Studio
            </p>
          </div>
        </div>

        {/* Center: Section Switcher (Video Grid vs NanoBanana Pro Image Studio) */}
        <div className="flex items-center p-1 rounded-xl bg-[#f0e6d8] border border-[#dfd2c0] shadow-inner">
          <Tooltip content="Chuyển sang Studio Video Grid đa clip (Google Omni 1.1 Flash)" position="bottom">
            <button
              onClick={() => onChangeSection('video-grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === 'video-grid'
                  ? 'bg-[#ffffff] text-[#1c1917] shadow-xs border border-[#ddd0be]'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#c25e2e]" />
              <span className="hidden sm:inline">Video Grid</span>
              <span className="font-mono text-[10px] text-[#78716c]">({clipCount})</span>
            </button>
          </Tooltip>

          <Tooltip content="Chuyển sang Section tạo ảnh Lookbook & Start Frame bằng NanoBanana Pro" position="bottom">
            <button
              onClick={() => onChangeSection('nanobanana-image')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSection === 'nanobanana-image'
                  ? 'bg-[#ffffff] text-[#1c1917] shadow-xs border border-[#ddd0be]'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#c25e2e]" />
              <span>NanoBanana Pro</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300/60 text-[9px] font-bold">
                MỚI
              </span>
            </button>
          </Tooltip>
        </div>

        {/* Right actions: Minimalist Icons with Descriptions on Hover */}
        <div className="flex items-center gap-2">
          {activeSection === 'video-grid' && (
            <>
              {/* Add clip button */}
              <Tooltip content="Thêm clip mới vào Video Grid" position="bottom">
                <button
                  onClick={onAddNewClip}
                  className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#1c1917] border border-[#dcd1bf] shadow-2xs transition-all hover:scale-105 active:scale-95"
                  aria-label="Thêm clip mới"
                >
                  <Plus className="w-4 h-4 text-[#c25e2e]" />
                </button>
              </Tooltip>

              {/* Toggle play/pause all */}
              <Tooltip content={allPlaying ? 'Tạm dừng tất cả video' : 'Phát tất cả video'} position="bottom">
                <button
                  onClick={onTogglePlayAll}
                  className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#1c1917] border border-[#dcd1bf] shadow-2xs transition-all hover:scale-105 active:scale-95"
                  aria-label={allPlaying ? 'Tạm dừng' : 'Phát tất cả'}
                >
                  {allPlaying ? <Pause className="w-4 h-4 text-[#c25e2e]" /> : <Play className="w-4 h-4 text-[#c25e2e]" />}
                </button>
              </Tooltip>

              {/* Batch Generate button (Primary) */}
              <Tooltip content={isAnyGenerating ? 'Đang tạo batch clip...' : 'Tạo tất cả video với Omni 1.1 Flash'} position="bottom">
                <button
                  onClick={onBatchGenerate}
                  disabled={isAnyGenerating}
                  className="p-2.5 rounded-xl bg-[#c25e2e] hover:bg-[#a94f24] text-white shadow-sm hover:shadow transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
                  aria-label="Tạo tất cả"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </Tooltip>

              <div className="h-5 w-px bg-[#dcd0bd] mx-1 hidden xl:block" />
            </>
          )}

          {/* Omni prompt preview */}
          <Tooltip content="Xem định dạng Omni 1.1 Flash Prompt" position="bottom">
            <button
              onClick={onOpenPromptInspector}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#57534e] hover:text-[#1c1917] border border-[#dcd1bf] shadow-2xs transition-all hover:scale-105 active:scale-95"
              aria-label="Xem prompt"
            >
              <Film className="w-4 h-4 text-[#78716c]" />
            </button>
          </Tooltip>

          {/* Guide button */}
          <Tooltip content="Hướng dẫn sử dụng & Mẹo Omni 1.1" position="bottom">
            <button
              onClick={onOpenGuide}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#57534e] hover:text-[#1c1917] border border-[#dcd1bf] shadow-2xs transition-all hover:scale-105 active:scale-95"
              aria-label="Hướng dẫn sử dụng"
            >
              <HelpCircle className="w-4 h-4 text-[#78716c]" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
