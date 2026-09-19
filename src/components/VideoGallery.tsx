import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Film, Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw,
  Maximize2, Clock, X, Sparkles, HardDrive
} from 'lucide-react';
import { getTenseVideos, getDefaultVideoForTense } from '../data/tenseVideos';

export interface VideoGalleryProps {
  tenseId: string;
  tenseNameAr?: string;
  tenseNameEn?: string;
  videoUrl?: string;
  onClose?: () => void;
  isOpen?: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  tenseId,
  tenseNameAr = 'الزمن',
  tenseNameEn = '',
  videoUrl: customVideoUrl,
  onClose,
  isOpen = true,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(`/videos/${tenseId}.mp4`);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Educational video definitions from curriculum data
  const educationalVideos = useMemo(() => {
    const list = getTenseVideos(tenseId);
    if (list.length > 0) return list;
    return [{
      id: `${tenseId}_default`,
      titleAr: `شرح ${tenseNameAr}`,
      titleEn: tenseNameEn || 'English Grammar',
      videoUrl: customVideoUrl || getDefaultVideoForTense(tenseId),
      duration: '05:00',
      channelName: 'درس تعليمي محلي',
      summaryAr: `شرح مرئي لقواعد واستخدامات وتراكيب زمن ${tenseNameAr}.`
    }];
  }, [tenseId, customVideoUrl, tenseNameAr, tenseNameEn]);

  const activeVideo = educationalVideos[0];
  const timestamps = activeVideo?.timestamps || [];

  // Determine current active chapter based on video currentTime
  const currentChapter = useMemo(() => {
    if (!timestamps || timestamps.length === 0) return null;
    let found = timestamps[0];
    for (let i = timestamps.length - 1; i >= 0; i--) {
      if (currentTime >= timestamps[i].timeInSeconds) {
        found = timestamps[i];
        break;
      }
    }
    return found;
  }, [timestamps, currentTime]);

  // Load video directly from local server path
const loadVideo = useCallback(() => {
  setIsLoading(true);

  const videoUrl =
    customVideoUrl ||
    educationalVideos[0]?.videoUrl ||
    getDefaultVideoForTense(tenseId);

  setVideoSrc(videoUrl);
  setIsLoading(false);
}, [customVideoUrl, educationalVideos, tenseId]);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // Video playback controls
  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (timeInSeconds: number) => {
    if (!videoPlayerRef.current) return;
    videoPlayerRef.current.currentTime = Math.max(0, Math.min(timeInSeconds, duration || 9999));
    if (!isPlaying) {
      videoPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (!videoPlayerRef.current) return;
    handleSeek(videoPlayerRef.current.currentTime + seconds);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (!videoPlayerRef.current) return;
    const nextMuted = !isMuted;
    videoPlayerRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        videoPlayerRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoPlayerRef.current.muted = false;
      }
    }
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      id={`video-gallery-${tenseId}`}
      className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300"
      dir="rtl"
    >
      {/* Header Bar */}
      <div className="bg-slate-950/90 px-4 sm:px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-arabic">
                {activeVideo.titleAr}
              </h3>
              {tenseNameEn && (
                <span className="hidden sm:inline text-xs text-slate-400 font-mono" dir="ltr">
                  ({tenseNameEn})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-arabic flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <HardDrive className="w-3 h-3" />
                مشغل محلي مباشر (بدون يوتيوب أو إعلانات)
              </span>
              <span>•</span>
              <span className="text-slate-400">القناة التعليمية: {activeVideo.channelName}</span>
            </p>
          </div>
        </div>

        {/* Close button if provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="إغلاق المشغل"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-5">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 font-arabic space-y-3">
            <div className="w-9 h-9 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">جاري تجهيز مشغل الفيديو المحلي...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Custom Video Container */}
            <div className="group relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
              <video
                ref={videoPlayerRef}
                src={videoSrc}
                playsInline
                controls={false}
                preload="metadata"
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => {
                  if (videoPlayerRef.current) {
                    setCurrentTime(videoPlayerRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoPlayerRef.current) {
                    setDuration(videoPlayerRef.current.duration);
                    videoPlayerRef.current.playbackRate = playbackSpeed;
                  }
                }}
              >
                متصفحك لا يدعم مشغل الفيديو المباشر.
              </video>

              {/* Big Play Button Overlay when paused */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer backdrop-blur-xs"
                  title="تشغيل"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              )}

              {/* Video Overlay Info Chip */}
              {currentChapter && (
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-white font-arabic flex items-center gap-2 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="font-bold">{currentChapter.label}</span>
                </div>
              )}

              {/* Bottom Custom Control Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-3 sm:p-4 space-y-2 opacity-95 transition-opacity">
                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.5}
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Control Buttons & Timestamp */}
                <div className="flex items-center justify-between gap-3 text-white">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-lg hover:bg-white/10 transition cursor-pointer text-white"
                      title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      onClick={() => skipSeconds(-10)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                      title="تراجع 10 ثوانٍ"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => skipSeconds(10)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer text-slate-300 hover:text-white"
                      title="تقديم 10 ثوانٍ"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Time Counter */}
                    <div className="text-xs font-mono text-slate-300 select-none mr-1" dir="ltr">
                      <span>{formatTime(currentTime)}</span>
                      <span className="mx-1 text-slate-500">/</span>
                      <span>{formatTime(duration || 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Volume Slider */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 text-[11px] font-mono">
                      {[0.75, 1, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-1.5 py-0.5 rounded transition cursor-pointer ${
                            playbackSpeed === speed
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    {/* Fullscreen Toggle */}
                    <button
                      onClick={toggleFullScreen}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                      title="شاشة كاملة"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Details Card */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-arabic">
                    {activeVideo.titleAr}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-arabic mt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800/60 text-[11px] font-semibold">
                      {activeVideo.channelName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-slate-300" dir="ltr">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {activeVideo.duration}
                    </span>
                    {activeVideo.titleEn && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400 font-mono text-[11px]" dir="ltr">
                          {activeVideo.titleEn}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Timestamps & Chapters */}
            {timestamps && timestamps.length > 0 && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-arabic">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>فصول وتوقيتات الشرح المعتمدة (انقر للانتقال المباشر)</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-arabic">
                    {timestamps.length} فصول تعليمية
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {timestamps.map((ts, idx) => {
                    const isSelected = currentChapter?.timeInSeconds === ts.timeInSeconds;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSeek(ts.timeInSeconds)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-right transition cursor-pointer text-xs font-arabic border ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-xs'
                            : 'bg-slate-900/60 hover:bg-slate-850 text-slate-300 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-slate-600'}`} />
                          <span className="truncate">{ts.label}</span>
                        </div>
                        <span 
                          className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0 ml-1.5"
                          dir="ltr"
                        >
                          {formatTime(ts.timeInSeconds)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Lesson Summary */}
            {activeVideo?.summaryAr && (
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 font-arabic leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span>ملخص محتوى المقطع والشرح:</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed pr-5">
                  {activeVideo.summaryAr}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
