import React, { useRef } from 'react';
import { VideoRef } from '../types';
import { PRESET_VIDEO_REFS } from '../data/presets';
import { Video, Upload, CheckCircle2, Activity, Play } from 'lucide-react';

interface VideoRefInputProps {
  selectedVideoRef: VideoRef;
  onSelectVideoRef: (ref: VideoRef) => void;
  onCustomUpload: (file: File) => void;
}

export const VideoRefInput: React.FC<VideoRefInputProps> = ({
  selectedVideoRef,
  onSelectVideoRef,
  onCustomUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCustomUpload(file);
    }
  };

  return (
    <div className="bg-[#10121a]/80 rounded-2xl p-5 border border-white/[0.08] shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-luxury text-white font-display uppercase">
            1. Input Video Ref (Clone Chuyển Động)
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-label text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full border border-sky-400/20">
          <Activity className="w-3 h-3 animate-pulse" />
          <span>DensePose Motion Tracking</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-content leading-relaxed mb-4">
        Video tham chiếu dùng để sao chép chuyển động dáng đi, xoay người 360°, hoặc động tác cầm tay OOTD của người mẫu thời trang.
      </p>

      {/* Selected Ref preview banner */}
      <div className="mb-4 bg-black/40 rounded-xl p-3.5 border border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={selectedVideoRef.thumbnailUrl}
            alt={selectedVideoRef.title}
            className="w-14 h-16 rounded-lg object-cover border border-amber-400/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">{selectedVideoRef.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                {selectedVideoRef.duration}s
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{selectedVideoRef.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Motion Keypoints Đã Khóa
              </span>
              <span className="text-[10px] text-slate-500">• {selectedVideoRef.fps} FPS</span>
            </div>
          </div>
        </div>

        {/* Upload Custom button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-xs text-slate-300 border border-white/[0.08] transition-all hover:text-white"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tải Video Lên</span>
          </button>
        </div>
      </div>

      {/* Preset Reference Videos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {PRESET_VIDEO_REFS.map((refItem) => {
          const isSelected = selectedVideoRef.id === refItem.id;
          return (
            <button
              key={refItem.id}
              onClick={() => onSelectVideoRef(refItem)}
              className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'border-white/[0.08] hover:border-white/[0.2] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="relative aspect-[4/5] w-full bg-slate-900">
                <img
                  src={refItem.thumbnailUrl}
                  alt={refItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-amber-300 border border-white/10">
                  {refItem.duration}s
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold text-white truncate">{refItem.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{refItem.category}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
