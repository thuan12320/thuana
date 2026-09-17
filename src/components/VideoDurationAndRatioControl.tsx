import React from 'react';
import { AspectRatio } from '../types';
import { Clock, Smartphone, Monitor, Square, LayoutTemplate } from 'lucide-react';

interface VideoDurationAndRatioControlProps {
  duration: number; // 1.0 to 10.0s
  onChangeDuration: (newDuration: number) => void;
  ratio: AspectRatio;
  onChangeRatio: (newRatio: AspectRatio) => void;
}

export const VideoDurationAndRatioControl: React.FC<VideoDurationAndRatioControlProps> = ({
  duration,
  onChangeDuration,
  ratio,
  onChangeRatio,
}) => {
  const RATIO_OPTIONS: { id: AspectRatio; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: '9:16',
      label: '9:16',
      icon: <Smartphone className="w-4 h-4" />,
      desc: 'TikTok · Reels · Shorts · Shopee Video (Tối ưu)',
    },
    {
      id: '16:9',
      label: '16:9',
      icon: <Monitor className="w-4 h-4" />,
      desc: 'YouTube ngang · Web Video',
    },
    {
      id: '1:1',
      label: '1:1',
      icon: <Square className="w-4 h-4" />,
      desc: 'Instagram Feed · Facebook Post',
    },
    {
      id: '4:5',
      label: '4:5',
      icon: <LayoutTemplate className="w-4 h-4" />,
      desc: 'Facebook & Instagram Sponsored Ads',
    },
  ];

  const PRESET_DURATIONS = [
    { seconds: 1.5, label: '1.5s', note: 'Hook nhanh' },
    { seconds: 2.5, label: '2.5s', note: 'Chuẩn Story' },
    { seconds: 4.0, label: '4.0s', note: 'Tối ưu Affiliate ★' },
    { seconds: 5.0, label: '5.0s', note: 'Tối đa (1/2 chuẩn)' },
  ];

  const frameCount = Math.round(duration * 30);

  return (
    <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#ece4d8] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#c25e2e]" />
          <h2 className="text-xs font-semibold tracking-luxury text-[#1c1917] uppercase font-display">
            Thời lượng & Tỉ lệ khung hình
          </h2>
        </div>
        <span className="text-[11px] font-medium font-label text-[#7c4d28] bg-[#f7ede2] px-2.5 py-0.5 rounded-full border border-[#edd5c0]">
          Độ dài ngắn: Max 5.0s (Giảm 1/2)
        </span>
      </div>

      {/* Duration Control Section */}
      <div className="mb-6 bg-[#faf8f4] p-4 rounded-xl border border-[#ede3d4]">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-xs text-[#78716c]">Độ dài Video Affiliate:</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-[#c25e2e] font-mono">{duration.toFixed(1)}s</span>
              <span className="text-xs text-[#a8a29e] font-mono">({frameCount} frames @ 30fps)</span>
            </div>
          </div>
          <span className="text-[11px] text-[#78716c]">Tối đa: 5.0 giây (1/2 tiêu chuẩn)</span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="1.0"
          max="5.0"
          step="0.5"
          value={Math.min(duration, 5.0)}
          onChange={(e) => onChangeDuration(parseFloat(e.target.value))}
          className="w-full h-2 bg-[#e8dfd2] rounded-lg appearance-none cursor-pointer accent-[#c25e2e] mb-3"
        />

        {/* Quick presets */}
        <div className="grid grid-cols-4 gap-2">
          {PRESET_DURATIONS.map((preset) => {
            const isSelected = duration === preset.seconds;
            return (
              <button
                key={preset.seconds}
                onClick={() => onChangeDuration(preset.seconds)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all text-center flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#f7ede2] text-[#c25e2e] border border-[#e4be9c] shadow-2xs'
                    : 'bg-[#ffffff] hover:bg-[#f5efe4] text-[#78716c] border border-[#e5ded3]'
                }`}
              >
                <span className="font-bold">{preset.label}</span>
                <span className="text-[10px] text-[#a8a29e] truncate w-full">{preset.note}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div>
        <label className="block text-xs font-medium text-[#44403c] mb-2.5">
          Tỉ lệ khung hình (Ratio Selector):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {RATIO_OPTIONS.map((item) => {
            const isSelected = ratio === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeRatio(item.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#fdfaf6] border-[#c25e2e] text-[#1c1917] shadow-2xs'
                    : 'bg-[#ffffff] hover:bg-[#fcfaf7] border-[#ece4d8] text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#f7ede2] text-[#c25e2e]' : 'bg-[#f5efe5] text-[#78716c]'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-[#c25e2e] text-white' : 'bg-[#f0eae0] text-[#78716c]'}`}>
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] leading-tight text-[#78716c]">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
