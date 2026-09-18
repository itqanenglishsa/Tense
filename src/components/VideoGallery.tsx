import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Film, Play, Volume2, 
  Clock, FileVideo, X, Sparkles, BookOpen, AlertCircle,
  Upload, RefreshCw, Trash2, Settings, ShieldAlert, Check
} from 'lucide-react';
import { 
  getDeviceVideo, 
  saveDeviceVideo, 
  deleteDeviceVideo, 
  formatFileSize, 
  StoredDeviceVideo 
} from '../utils/videoStorage';
import { getTenseVideos, getDefaultVideoForTense } from '../data/tenseVideos';
import { EducationalVideo } from '../types';

export interface VideoGalleryProps {
  /**
   * معرف الزمن لتحميل الفيديو الخاص به
   */
  tenseId: string;

  /**
   * اسم الزمن باللغة العربية
   */
  tenseNameAr?: string;

  /**
   * اسم الزمن باللغة الإنجليزية
   */
  tenseNameEn?: string;

  /**
   * رابط فيديو بديل أو افتراضي (اختياري)
   */
  videoUrl?: string;

  /**
   * دالة إغلاق المشغل
   */
  onClose?: () => void;

  /**
   * حالة ظهور المكون
   */
  isOpen?: boolean;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  tenseId,
  tenseNameAr = 'الزمن',
  tenseNameEn = '',
  videoUrl: customVideoUrl,
  onClose,
  isOpen = true,
}) => {
  const localVideoFiles: Record<string, string> = {
    present_simple: 'simple_present.mp4',
    present_continuous: 'present_progressive.mp4',
    present_perfect: 'present_perfect.mp4',
    present_perfect_continuous: 'present_perfect_progressive.mp4',
    past_simple: 'simple_past.mp4',
    past_continuous: 'past_progressive.mp4',
    past_perfect: 'past_perfect.mp4',
    past_perfect_continuous: 'past_perfect_progressive.mp4',
    future_simple: 'simple_future.mp4',
    future_continuous: 'future_progressive.mp4',
    future_perfect: 'future_perfect.mp4',
    future_perfect_continuous: 'future_perfect_continuous.mp4',
  };
  const localVideoUrl = localVideoFiles[tenseId]
    ? `/videos/${localVideoFiles[tenseId]}`
    : null;

  const [deviceVideo, setDeviceVideo] = useState<StoredDeviceVideo | null>(null);
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeSource, setActiveSource] = useState<'curriculum' | 'device'>('curriculum');

  // إرفاق ملف فيديو من الجهاز
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // قائمة الفيديوهات التعليمية المعتمدة للزمن
  const educationalVideos = useMemo(() => {
    const list = getTenseVideos(tenseId);
    if (list.length > 0) return list;
    if (customVideoUrl) {
      return [{
        id: `${tenseId}_custom`,
        titleAr: `شرح ${tenseNameAr}`,
        titleEn: tenseNameEn || 'English Grammar',
        videoUrl: customVideoUrl,
        duration: '10:00',
        channelName: 'English Learning',
        summaryAr: `شرح مرئي لقواعد واستخدامات زمن ${tenseNameAr}.`
      }];
    }
    return [{
      id: `${tenseId}_default`,
      titleAr: `شرح ${tenseNameAr}`,
      titleEn: tenseNameEn || 'English Grammar',
      videoUrl: getDefaultVideoForTense(tenseId),
      duration: '10:00',
      channelName: 'English Grammar Hub',
      summaryAr: `شرح مرئي لقواعد واستخدامات زمن ${tenseNameAr}.`
    }];
  }, [tenseId, customVideoUrl, tenseNameAr, tenseNameEn]);

  const activeVideo = educationalVideos[0];
  const videoSourceUrl = videoObjectUrl || activeVideo?.videoUrl;

  // التحقق مما إذا كان الرابط يتبع ليوتيوب أو فيديو محلي
  const isYoutube = useMemo(() => {
    if (!videoSourceUrl) return false;
    return videoSourceUrl.includes('youtube.com') || videoSourceUrl.includes('youtu.be');
  }, [videoSourceUrl]);

  // استخراج معرّف يوتيوب إن وجد
  const youtubeId = useMemo(() => {
    if (!videoSourceUrl || !isYoutube) return null;
    const match = videoSourceUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    return match ? match[1] : null;
  }, [videoSourceUrl, isYoutube]);

  // استرجاع الفيديو المرفوع مسبقاً أو استخدام الرابط المحلي المحدد
  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    const loadSavedVideo = async () => {
      setIsLoading(true);
      try {
        const saved = await getDeviceVideo(tenseId);
        if (active && saved) {
          setDeviceVideo(saved);
          createdUrl = URL.createObjectURL(saved.blob);
          setVideoObjectUrl(createdUrl);
          setActiveSource('device');
        } else if (active) {
          // استخدام الرابط المحلي المباشر القادم من ملف tenseVideos.ts
          setVideoObjectUrl(null);
          setActiveSource('curriculum');
        }
      } catch (err) {
        console.error('Failed to load video for view:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadSavedVideo();

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [tenseId]);

  // معالجة اختيار ملف فيديو من الجهاز
  const processVideoFile = async (file: File) => {
    setUploadError(null);

    if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name)) {
      setUploadError('نوع الملف غير صالح. يُرجى اختيار ملف فيديو بصيغة (MP4, WebM, MOV).');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setUploadError('حجم ملف الفيديو كبير جداً. الحد الأقصى المسموح به هو 500 ميغابايت.');
      return;
    }

    try {
      setIsLoading(true);
      if (videoObjectUrl && !videoObjectUrl.startsWith('/videos/')) {
        URL.revokeObjectURL(videoObjectUrl);
      }

      const saved = await saveDeviceVideo(tenseId, file);
      setDeviceVideo(saved);
      const localUrl = URL.createObjectURL(saved.blob);
      setVideoObjectUrl(localUrl);
      setActiveSource('device');
      setIsUploading(false);
    } catch (err) {
      console.error('Error saving video:', err);
      setUploadError('حدث خطأ أثناء حفظ الفيديو في الذاكرة المحلية للجهاز.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processVideoFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processVideoFile(files[0]);
    }
  };

  const handleDeleteVideo = async () => {
    try {
      if (videoObjectUrl && !videoObjectUrl.startsWith('/videos/')) {
        URL.revokeObjectURL(videoObjectUrl);
      }
      await deleteDeviceVideo(tenseId);
      setDeviceVideo(null);
      setVideoObjectUrl(null);
      setActiveSource('curriculum');
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  // تغيير سرعة التشغيل للفيديو المحلي
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = speed;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-300"
      dir="rtl"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v"
        className="hidden"
      />

      {/* Header Bar */}
      <div className="bg-slate-950/90 px-4 sm:px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-arabic">
                فيديو الشرح المعتمد: {tenseNameAr}
              </h3>
              {tenseNameEn && (
                <span className="hidden sm:inline text-xs text-slate-400 font-mono" dir="ltr">
                  ({tenseNameEn})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-arabic flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>مقطع تعليمي موثق ومطابق لمحتوى الدرس وأمثلته</span>
            </p>
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="إغلاق المشغل"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 space-y-5">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 font-arabic space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">جاري تجهيز مشغل الفيديو...</p>
          </div>
        ) : isTeacherMode ? (
          /* ========================================================
             واجهة إدارة المعلم: إرفاق واستبدال وحذف مقطع الفيديو
             ======================================================== */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400 flex items-center justify-center mx-auto">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-arabic">
                  لوحة إدارة المعلم: مقطع شرح {tenseNameAr}
                </h4>
                <p className="text-xs text-slate-400 font-arabic mt-1">
                  يمكنك رفع فيديو شرح خاص بك ليظهر لطلابك كفيديو معتمد لهذا الزمن
                </p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-amber-500 bg-amber-950/20 text-amber-300'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-900/40 text-slate-400'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-arabic font-bold text-slate-200">
                  اسحب ملف الفيديو وأفلته هنا، أو اضغط للاختيار من جهازك
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-arabic">
                  الصيغ المدعومة: MP4, WebM, MOV (الحد الأقصى: 500 ميغابايت)
                </p>
              </div>

              {uploadError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-arabic flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {deviceVideo && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs">
                  <div className="flex items-center gap-2">
                    <FileVideo className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-slate-300">{deviceVideo.fileName}</span>
                    <span className="text-slate-500 font-mono">({formatFileSize(deviceVideo.fileSize)})</span>
                  </div>
                  <button
                    onClick={handleDeleteVideo}
                    className="p-1.5 text-red-400 hover:bg-red-950/40 rounded transition cursor-pointer"
                    title="حذف الفيديو المرفوع"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : isYoutube && youtubeId ? (
          /* ========================================================
             مشغل يوتيوب (في حال استخدام رابط يوتيوب)
             ======================================================== */
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title={activeVideo?.titleAr || tenseNameAr}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {activeVideo && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-400 flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-arabic">
                      {activeVideo.titleAr}
                    </h4>
                    <span className="text-xs text-slate-400 font-arabic">{activeVideo.channelName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================
             مشغل الفيديو المحلي (ملفات MP4 المحلية)
             ======================================================== */
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
              <video
                ref={videoPlayerRef}
                key={videoSourceUrl}
                src={videoSourceUrl}
                controls
                controlsList="nodownload"
                playsInline
                className="w-full h-full object-contain"
                onLoadedMetadata={() => {
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.playbackRate = playbackSpeed;
                  }
                }}
              >
                متصفحك لا يدعم مشغل الفيديو المباشر.
              </video>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-400 flex items-center justify-center shrink-0">
                  <FileVideo className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-arabic line-clamp-1">
                    {activeVideo?.titleAr || `شرح ${tenseNameAr}`}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-arabic mt-0.5">
                    <span className="text-emerald-400 font-medium">ملف فيديو محلي معتمد</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{activeVideo?.duration || '10:00'}</span>
                  </div>
                </div>
              </div>

              {/* سرعة التشغيل */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5 text-xs font-mono">
                <span className="px-2 text-[11px] text-slate-300 font-arabic font-semibold">
                  السرعة:
                </span>
                {[0.75, 1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2 py-1 rounded-md transition cursor-pointer ${
                      playbackSpeed === speed
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Video Summary */}
            {activeVideo?.summaryAr && (
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 font-arabic leading-relaxed">
                <span className="font-bold text-blue-400 ml-1">ملخص محتوى المقطع:</span>
                <span>{activeVideo.summaryAr}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};