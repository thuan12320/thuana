import React, { useState } from 'react';
import { 
  AspectRatio, 
  BackgroundStyle, 
  GenerationConfig, 
  ModelActor, 
  ProductItem, 
  VideoClipItem, 
  VideoRef,
  ActiveStudioSection
} from './types';
import { 
  PRESET_BACKGROUNDS, 
  PRESET_MODELS, 
  PRESET_PRODUCTS, 
  PRESET_VIDEO_REFS 
} from './data/presets';

import { Header } from './components/Header';
import { SmartOptionPanel } from './components/SmartOptionPanel';
import { VideoGridManager } from './components/VideoGridManager';
import { NanoBananaImageStudio } from './components/NanoBananaImageStudio';
import { EndFrameModal } from './components/EndFrameModal';
import { PromptInspectorModal } from './components/PromptInspectorModal';
import { UserGuideModal } from './components/UserGuideModal';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const defaultBg = PRESET_BACKGROUNDS.find((bg) => bg.isDefault) || PRESET_BACKGROUNDS[0];

  // Active section: 'video-grid' (Google Omni 1.1 Flash) or 'nanobanana-image' (Google gemini-3-pro-image)
  const [activeSection, setActiveSection] = useState<ActiveStudioSection>('video-grid');

  // Initialize multi-video collection (Grid of fashion clips) with halved durations (1/2 độ dài)
  const [clips, setClips] = useState<VideoClipItem[]>([
    {
      id: 'clip-1',
      title: 'Runway Catwalk 360°',
      status: 'completed',
      progress: 100,
      generationStep: 'Hoàn tất render Omni 1.1 Flash',
      createdAt: Date.now() - 30000,
      config: {
        duration: 4.0, // Halved from 8.5s
        ratio: '9:16',
        videoRef: PRESET_VIDEO_REFS[0],
        actor: PRESET_MODELS[0], // Linh Chi
        product: PRESET_PRODUCTS[0], // Blazer Tweed
        backgroundStyle: defaultBg, // Industrial Penthouse with clothes racks (Default)
        enableStartFrame: false,
        startFrameImage: null,
        affiliateOverlay: {
          showCtaBanner: true,
          ctaText: 'Mua tại giỏ hàng bên dưới 👇',
          showPriceTag: true,
          showDiscountBadge: true,
          cartPlatform: 'tiktok',
        },
      },
    },
    {
      id: 'clip-2',
      title: 'Mirror OOTD Outfit Check',
      status: 'completed',
      progress: 100,
      generationStep: 'Hoàn tất render Omni 1.1 Flash',
      createdAt: Date.now() - 20000,
      config: {
        duration: 3.5, // Halved from 7.0s
        ratio: '9:16',
        videoRef: PRESET_VIDEO_REFS[1],
        actor: PRESET_MODELS[1], // Sophia Laurent
        product: null, // [CRITICAL]: null means KEEP ORIGINAL GARMENT of Video Ref!
        backgroundStyle: defaultBg, // Industrial Penthouse (Default)
        enableStartFrame: true,
        startFrameImage: null,
        affiliateOverlay: {
          showCtaBanner: true,
          ctaText: 'Giảm 50% chỉ hôm nay 🔥',
          showPriceTag: true,
          showDiscountBadge: true,
          cartPlatform: 'shopee',
        },
      },
    },
    {
      id: 'clip-3',
      title: 'Studio Minimal Drapery',
      status: 'completed',
      progress: 100,
      generationStep: 'Hoàn tất render Omni 1.1 Flash',
      createdAt: Date.now() - 10000,
      config: {
        duration: 5.0, // Halved from 10.0s (Max 5s)
        ratio: '9:16',
        videoRef: PRESET_VIDEO_REFS[2],
        actor: PRESET_MODELS[2], // Marcus Vance
        product: PRESET_PRODUCTS[2], // Trench coat
        backgroundStyle: defaultBg, // Industrial Penthouse (Default)
        enableStartFrame: false,
        startFrameImage: null,
        affiliateOverlay: {
          showCtaBanner: true,
          ctaText: 'Săn deal măng tô thời thượng ⚡',
          showPriceTag: true,
          showDiscountBadge: true,
          cartPlatform: 'reels',
        },
      },
    },
  ]);

  // Selected clip for inspector panel
  const [selectedClipId, setSelectedClipId] = useState<string>('clip-1');

  // Modals state
  const [isEndFrameModalOpen, setIsEndFrameModalOpen] = useState<boolean>(false);
  const [extractedEndFrameUrl, setExtractedEndFrameUrl] = useState<string | null>(null);
  const [extractedSourceClipTitle, setExtractedSourceClipTitle] = useState<string>('');
  const [isPromptInspectorOpen, setIsPromptInspectorOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Global play/pause toggle
  const [allPlaying, setAllPlaying] = useState<boolean>(true);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Find active clip
  const activeClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  // Update active clip's configuration
  const handleUpdateActiveConfig = (updater: (prev: GenerationConfig) => GenerationConfig) => {
    setClips((prevClips) =>
      prevClips.map((c) => {
        if (c.id === selectedClipId) {
          return {
            ...c,
            config: updater(c.config),
          };
        }
        return c;
      })
    );
  };

  // Apply current active configuration to ALL clips in the grid
  const handleApplyConfigToAll = () => {
    const sourceConfig = activeClip.config;
    setClips((prevClips) =>
      prevClips.map((c) => ({
        ...c,
        config: {
          ...c.config,
          duration: sourceConfig.duration,
          ratio: sourceConfig.ratio,
          backgroundStyle: sourceConfig.backgroundStyle,
          affiliateOverlay: { ...sourceConfig.affiliateOverlay },
        },
      }))
    );
    showToast(`Đã áp dụng tỉ lệ (${sourceConfig.ratio}), thời lượng (${sourceConfig.duration}s) và bối cảnh cho tất cả ${clips.length} clip!`);
  };

  // Generation sequence simulator for a single clip with Omni 1.1 Flash
  const handleGenerateClip = (clipId: string) => {
    const targetClip = clips.find((c) => c.id === clipId);
    if (!targetClip) return;

    // Set initial generating status
    setClips((prev) =>
      prev.map((c) =>
        c.id === clipId
          ? {
              ...c,
              status: 'generating',
              progress: 5,
              generationStep: 'Khởi tạo Google Omni 1.1 Flash Multimodal Tensor...',
            }
          : c
      )
    );

    const steps = [
      { p: 25, text: 'Trích xuất DensePose Keypoints từ Video Ref...' },
      { p: 50, text: targetClip.config.product === null
        ? '[Quy Tắc] Khóa & Bảo tồn 100% trang phục gốc Video Ref...'
        : `Neural Garment Draping: Bọc vải "${targetClip.config.product.name}"...`
      },
      { p: 75, text: `Tổng hợp bối cảnh: ${targetClip.config.backgroundStyle.name}...` },
      { p: 95, text: 'Chèn nhãn Affiliate CTA & Render 30 FPS Tensor...' },
      { p: 100, text: 'Hoàn tất video Omni 1.1 Flash!' },
    ];

    let stepIndex = 0;
    const timer = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setClips((prev) =>
          prev.map((c) =>
            c.id === clipId
              ? {
                  ...c,
                  progress: step.p,
                  generationStep: step.text,
                }
              : c
          )
        );
        stepIndex++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setClips((prev) =>
            prev.map((c) =>
              c.id === clipId
                ? {
                    ...c,
                    status: 'completed',
                    progress: 100,
                    generationStep: 'Đã hoàn tất',
                  }
                : c
            )
          );
          showToast(`Render thành công: ${targetClip.title} với Google Omni 1.1 Flash!`);
        }, 300);
      }
    }, 400);
  };

  // Batch generate ALL clips simultaneously
  const handleBatchGenerate = () => {
    clips.forEach((clip, index) => {
      setTimeout(() => {
        handleGenerateClip(clip.id);
      }, index * 200);
    });
    showToast(`Đang đồng loạt kích hoạt Google Omni 1.1 Flash render ${clips.length} clip...`);
  };

  // Add a new clip
  const handleAddNewClip = () => {
    const newIndex = clips.length + 1;
    const newClipId = `clip-${Date.now()}`;
    const newClip: VideoClipItem = {
      id: newClipId,
      title: `Clip #${newIndex}: Fashion Look`,
      status: 'completed',
      progress: 100,
      generationStep: 'Sẵn sàng',
      createdAt: Date.now(),
      config: {
        duration: 8.0,
        ratio: '9:16',
        videoRef: PRESET_VIDEO_REFS[newIndex % PRESET_VIDEO_REFS.length],
        actor: PRESET_MODELS[newIndex % PRESET_MODELS.length],
        product: PRESET_PRODUCTS[newIndex % PRESET_PRODUCTS.length],
        backgroundStyle: defaultBg,
        enableStartFrame: false,
        startFrameImage: null,
        affiliateOverlay: {
          showCtaBanner: true,
          ctaText: 'Mua tại giỏ hàng bên dưới 👇',
          showPriceTag: true,
          showDiscountBadge: true,
          cartPlatform: 'tiktok',
        },
      },
    };
    setClips((prev) => [...prev, newClip]);
    setSelectedClipId(newClipId);
    showToast(`Đã thêm Clip #${newIndex} vào Video Grid!`);
  };

  // Duplicate an existing clip
  const handleDuplicateClip = (id: string) => {
    const target = clips.find((c) => c.id === id);
    if (!target) return;
    const newId = `clip-${Date.now()}`;
    const cloned: VideoClipItem = {
      ...target,
      id: newId,
      title: `${target.title} (Bản sao)`,
      createdAt: Date.now(),
    };
    setClips((prev) => [...prev, cloned]);
    setSelectedClipId(newId);
    showToast(`Đã nhân bản "${target.title}" thành công!`);
  };

  // Delete a clip
  const handleDeleteClip = (id: string) => {
    if (clips.length <= 1) {
      showToast('Cần giữ lại ít nhất 1 clip trong grid!');
      return;
    }
    const remaining = clips.filter((c) => c.id !== id);
    setClips(remaining);
    if (selectedClipId === id) {
      setSelectedClipId(remaining[0].id);
    }
    showToast('Đã xóa clip khỏi grid.');
  };

  // CRITICAL REQUIREMENT: "có nút nhỏ extract end frame trên góc của video đã tạo"
  const handleExtractEndFrame = (clipId: string, dataUrl: string) => {
    const sourceClip = clips.find((c) => c.id === clipId);
    setExtractedEndFrameUrl(dataUrl);
    setExtractedSourceClipTitle(sourceClip?.title || '');
    setIsEndFrameModalOpen(true);

    // Save endFrameUrl in clip object
    setClips((prev) =>
      prev.map((c) => (c.id === clipId ? { ...c, endFrameUrl: dataUrl } : c))
    );
  };

  // Chain End Frame of a clip to next clip's Start Frame
  const handleChainClipEndToNextStart = (sourceClipId: string) => {
    const sourceIndex = clips.findIndex((c) => c.id === sourceClipId);
    if (sourceIndex === -1) return;

    const nextIndex = (sourceIndex + 1) % clips.length;
    const nextClip = clips[nextIndex];
    const sourceClip = clips[sourceIndex];

    // Grab or generate frame data
    const frameData = sourceClip.endFrameUrl || PRESET_VIDEO_REFS[0].thumbnailUrl;

    setClips((prev) =>
      prev.map((c, idx) => {
        if (idx === nextIndex) {
          return {
            ...c,
            config: {
              ...c.config,
              enableStartFrame: true,
              startFrameImage: frameData,
            },
          };
        }
        return c;
      })
    );

    showToast(`Đã nối End Frame của "${sourceClip.title}" sang Start Frame của "${nextClip.title}"!`);
  };

  // Auto-chain all clips in sequence (Clip 1 -> Clip 2 -> Clip 3)
  const handleAutoChainAllClips = () => {
    if (clips.length < 2) {
      showToast('Cần ít nhất 2 clip để thực hiện chuỗi nối!');
      return;
    }

    setClips((prev) => {
      return prev.map((c, idx) => {
        if (idx === 0) return c; // first clip starts cleanly
        const prevClip = prev[idx - 1];
        return {
          ...c,
          config: {
            ...c.config,
            enableStartFrame: true,
            startFrameImage: prevClip.endFrameUrl || prevClip.config.videoRef.thumbnailUrl,
          },
        };
      });
    });

    showToast(`Đã tự động nối chuỗi End-to-Start cho toàn bộ ${clips.length} video trong grid!`);
  };

  // Set extracted end frame as start frame of active clip
  const handleSetExtractedAsStartFrame = () => {
    if (extractedEndFrameUrl) {
      handleUpdateActiveConfig((prev) => ({
        ...prev,
        enableStartFrame: true,
        startFrameImage: extractedEndFrameUrl,
      }));
      showToast('Đã cài đặt End Frame thành Start Frame cho clip đang chọn!');
    }
  };

  // NanoBanana Pro Image Studio Bridges
  const handleUseImageAsStartFrame = (imageDataUrl: string, promptText: string) => {
    handleUpdateActiveConfig((prev) => ({
      ...prev,
      enableStartFrame: true,
      startFrameImage: imageDataUrl,
    }));
    setActiveSection('video-grid');
    showToast('Đã gán ảnh NanoBanana Pro làm Start Frame cho clip đang chọn!');
  };

  const handleCreateNewClipWithImage = (imageDataUrl: string, promptText: string) => {
    const newClipId = `clip-${Date.now()}`;
    const newClip: VideoClipItem = {
      id: newClipId,
      title: `Lookbook ${clips.length + 1}`,
      status: 'completed',
      progress: 100,
      generationStep: 'Tạo từ NanoBanana Pro Master',
      createdAt: Date.now(),
      config: {
        ...activeClip.config,
        duration: 4.0,
        enableStartFrame: true,
        startFrameImage: imageDataUrl,
      },
    };
    setClips((prev) => [...prev, newClip]);
    setSelectedClipId(newClipId);
    setActiveSection('video-grid');
    showToast('Đã tạo clip mới trong Video Grid từ ảnh NanoBanana Pro!');
  };

  const isAnyGenerating = clips.some((c) => c.status === 'generating');

  return (
    <div className="h-screen w-screen flex flex-col bg-[#faf8f5] text-[#1e242f] overflow-hidden selection:bg-[#fed7aa] selection:text-[#9a3412]">
      {/* 1. Top Header Navigation */}
      <Header
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
        clipCount={clips.length}
        selectedClipTitle={activeClip.title}
        onBatchGenerate={handleBatchGenerate}
        isAnyGenerating={isAnyGenerating}
        onAddNewClip={handleAddNewClip}
        allPlaying={allPlaying}
        onTogglePlayAll={() => setAllPlaying(!allPlaying)}
      />

      {/* 2. Main Studio Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
        {activeSection === 'video-grid' ? (
          <>
            {/* LEFT: Smart Option Panel (Gói gọn trong 1 khung hình, linh hoạt điều khiển) */}
            <SmartOptionPanel
              activeClip={activeClip}
              clips={clips}
              onSelectClip={(id) => setSelectedClipId(id)}
              onUpdateActiveConfig={handleUpdateActiveConfig}
              onApplyConfigToAll={handleApplyConfigToAll}
              onGenerateCurrentClip={() => handleGenerateClip(activeClip.id)}
              isGeneratingCurrent={activeClip.status === 'generating'}
              onChainEndFrameToNext={() => handleChainClipEndToNextStart(activeClip.id)}
              onAddNewClip={handleAddNewClip}
              onDeleteClip={handleDeleteClip}
            />

            {/* RIGHT: Video Grid Manager (Quản lý & tạo nhiều video đồng thời) */}
            <VideoGridManager
              clips={clips}
              selectedClipId={selectedClipId}
              onSelectClip={(id) => setSelectedClipId(id)}
              onGenerateClip={(id) => handleGenerateClip(id)}
              onBatchGenerate={handleBatchGenerate}
              onAddNewClip={handleAddNewClip}
              onDuplicateClip={handleDuplicateClip}
              onDeleteClip={handleDeleteClip}
              onExtractEndFrame={handleExtractEndFrame}
              onChainClipEndToNextStart={handleChainClipEndToNextStart}
              onAutoChainAllClips={handleAutoChainAllClips}
              isAnyGenerating={isAnyGenerating}
              allPlaying={allPlaying}
              onTogglePlayAll={() => setAllPlaying(!allPlaying)}
            />
          </>
        ) : (
          /* SECTION RIÊNG: NanoBanana Pro Image Studio */
          <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 max-w-[1700px] mx-auto w-full">
            <NanoBananaImageStudio
              onUseAsStartFrame={handleUseImageAsStartFrame}
              onCreateNewClipWithFrame={handleCreateNewClipWithImage}
            />
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#292524] text-[#f5f5f4] text-xs font-semibold shadow-2xl border border-[#44403c] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#fbbf24]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* End Frame Modal */}
      <EndFrameModal
        isOpen={isEndFrameModalOpen}
        onClose={() => setIsEndFrameModalOpen(false)}
        imageUrl={extractedEndFrameUrl}
        onSetAsStartFrame={handleSetExtractedAsStartFrame}
        clipTitle={extractedSourceClipTitle}
      />

      {/* Google Omni 1.1 Flash Prompt Inspector Modal */}
      <PromptInspectorModal
        isOpen={isPromptInspectorOpen}
        onClose={() => setIsPromptInspectorOpen(false)}
        config={activeClip.config}
        clipTitle={activeClip.title}
      />

      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
