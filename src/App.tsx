import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { allTenses, getTenseById } from './data/tensesData';
import { UserOverallProgress } from './types';
import { Navbar } from './components/Navbar';
import { CourseOverview } from './components/CourseOverview';
import { TenseLesson } from './components/TenseLesson';
import { TenseTimeline } from './components/TenseTimeline';
import { TenseComparison } from './components/TenseComparison';
import { TenseCheatSheetModal } from './components/TenseCheatSheetModal';
import { AITutorModal } from './components/AITutorModal';
import { StudentDashboard } from './components/StudentDashboard';
import { IrregularVerbsModal } from './components/modals/IrregularVerbsModal';

const PROGRESS_STORAGE_KEY = 'english_tenses_master_progress_v1';

export default function App() {
  const [selectedTenseId, setSelectedTenseId] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showStudentDashboard, setShowStudentDashboard] = useState(false);
  const [showIrregularVerbs, setShowIrregularVerbs] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Initialize progress from localStorage
  const [userProgress, setUserProgress] = useState<UserOverallProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load progress from storage:', e);
    }
    return {};
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.warn('Failed to save progress to storage:', e);
    }
  }, [userProgress]);

  // Automatically scroll to the top of the page whenever navigating between course overview and lessons or switching tenses
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTenseId]);

  const activeTense = selectedTenseId ? getTenseById(selectedTenseId) || null : null;

  // Handlers for student progress
  const handleUpdateLessonProgress = useCallback((tenseId: string, lessonNumber: number) => {
    setUserProgress(prev => {
      const currentTenseProg = prev[tenseId];
      const existingLessons = currentTenseProg?.completedLessons || [];
      if (existingLessons.includes(lessonNumber)) {
        return prev;
      }

      const updatedLessons = [...existingLessons, lessonNumber];

      return {
        ...prev,
        [tenseId]: {
          ...(currentTenseProg || {
            tenseId,
            completedLessons: [],
            examPassed: false,
          }),
          completedLessons: updatedLessons,
        },
      };
    });
  }, []);

  const handleSaveFreeSentence = useCallback((
    tenseId: string,
    sentence: string,
    score: number,
    feedback: string
  ) => {
    setUserProgress(prev => {
      const currentTenseProg = prev[tenseId] || {
        tenseId,
        completedLessons: [],
        examPassed: false,
      };

      const existingSentences = currentTenseProg.freeSentences || [];
      const newSentenceEntry = {
        sentence,
        score,
        feedback,
        timestamp: new Date().toISOString(),
      };

      const updatedLessons = currentTenseProg.completedLessons.includes(6)
        ? currentTenseProg.completedLessons
        : [...currentTenseProg.completedLessons, 6];

      return {
        ...prev,
        [tenseId]: {
          ...currentTenseProg,
          completedLessons: updatedLessons,
          freeSentences: [...existingSentences, newSentenceEntry],
        },
      };
    });
  }, []);

  const handleDeleteFreeSentence = useCallback((tenseId: string, sentenceIndex: number) => {
    setUserProgress(prev => {
      const currentTenseProg = prev[tenseId];
      if (!currentTenseProg || !currentTenseProg.freeSentences) return prev;
      const updated = [...currentTenseProg.freeSentences];
      updated.splice(sentenceIndex, 1);
      return {
        ...prev,
        [tenseId]: {
          ...currentTenseProg,
          freeSentences: updated,
        },
      };
    });
  }, []);

  const handleClearFreeSentences = useCallback((tenseId: string) => {
    setUserProgress(prev => {
      const currentTenseProg = prev[tenseId];
      if (!currentTenseProg) return prev;
      return {
        ...prev,
        [tenseId]: {
          ...currentTenseProg,
          freeSentences: [],
        },
      };
    });
  }, []);

  const handlePassExam = useCallback((tenseId: string, score: number) => {
    setUserProgress(prev => {
      const currentTenseProg = prev[tenseId] || {
        tenseId,
        completedLessons: [],
        examPassed: false,
      };

      const updatedLessons = currentTenseProg.completedLessons.includes(7)
        ? currentTenseProg.completedLessons
        : [...currentTenseProg.completedLessons, 7];

      return {
        ...prev,
        [tenseId]: {
          ...currentTenseProg,
          completedLessons: updatedLessons,
          examScore: score,
          examPassed: score >= 80,
        },
      };
    });
  }, []);

  const handleResetCourse = useCallback(() => {
    setUserProgress({});
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear progress storage:', e);
    }
    setSelectedTenseId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#2D3748] font-sans selection:bg-[#214ecf] selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        currentTense={activeTense}
        onSelectTense={setSelectedTenseId}
        allTenses={allTenses}
        onOpenTimeline={() => setShowTimeline(true)}
        onOpenComparison={() => setShowComparison(true)}
        onOpenCheatSheet={() => setShowCheatSheet(true)}
        onOpenAITutor={() => setShowAITutor(true)}
        onOpenStudentDashboard={() => setShowStudentDashboard(true)}
        onOpenIrregularVerbs={() => setShowIrregularVerbs(true)}
        onOpenResetConfirm={() => setShowResetConfirm(true)}
        progress={userProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTense ? (
          <TenseLesson
            tense={activeTense}
            progress={userProgress[activeTense.id]}
            onUpdateLessonProgress={handleUpdateLessonProgress}
            onSaveFreeSentence={handleSaveFreeSentence}
            onDeleteFreeSentence={handleDeleteFreeSentence}
            onClearFreeSentences={handleClearFreeSentences}
            onPassExam={handlePassExam}
            onBackToCourse={() => {
              setSelectedTenseId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <CourseOverview
            allTenses={allTenses}
            onSelectTense={(id) => {
              setSelectedTenseId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            progress={userProgress}
          />
        )}
      </main>

      {/* Interactive Modals */}
      {showTimeline && (
        <TenseTimeline
          allTenses={allTenses}
          onSelectTense={(id) => {
            setSelectedTenseId(id);
            setShowTimeline(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => setShowTimeline(false)}
        />
      )}

      {showComparison && (
        <TenseComparison
          onSelectTense={(id) => {
            setSelectedTenseId(id);
            setShowComparison(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showCheatSheet && (
        <TenseCheatSheetModal
          onSelectTense={(id) => {
            setSelectedTenseId(id);
            setShowCheatSheet(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => setShowCheatSheet(false)}
        />
      )}

      {showAITutor && (
        <AITutorModal
          currentTenseName={activeTense?.nameEn}
          onClose={() => setShowAITutor(false)}
        />
      )}

      {showStudentDashboard && (
        <StudentDashboard
          progress={userProgress}
          allTenses={allTenses}
          onSelectTense={(id) => {
            setSelectedTenseId(id);
            setShowStudentDashboard(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClose={() => setShowStudentDashboard(false)}
        />
      )}

      {showIrregularVerbs && (
        <IrregularVerbsModal
          isOpen={showIrregularVerbs}
          onClose={() => setShowIrregularVerbs(false)}
          tenseId={activeTense?.id || 'past_simple'}
          tenseNameAr={activeTense?.nameAr || 'الماضي البسيط'}
          tenseNameEn={activeTense?.nameEn || 'Past Simple'}
        />
      )}

      {/* Reset Confirmation Dialog - Centered in viewport */}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          dir="rtl"
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-right transform transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-xs">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-arabic mb-2">
              إعادة بدء الدورة من البداية؟
            </h3>
            
            <p className="text-sm text-slate-600 font-arabic leading-relaxed mb-6">
              سيتم تصفير جميع الدروس المكتملة والاختبارات التي اجتزتها والجمل المحفوظة لجميع الأزمنة الـ 12، لتبدأ رحلة التعلم من جديد. هل تود المتابعة؟
            </p>

            <div className="flex items-center justify-end gap-3 font-arabic">
              <button
                type="button"
                id="cancel-reset-course-btn"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                id="confirm-reset-course-btn"
                onClick={() => {
                  handleResetCourse();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>تأكيد إعادة البدء</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500 font-arabic">
        <p>دورة إتقان جميع أزمنة اللغة الإنجليزية (12 زمناً) وقواعد SVO • تدريب تفاعلي حقيقي</p>
      </footer>
    </div>
  );
}
