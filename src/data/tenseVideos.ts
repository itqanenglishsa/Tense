import { EducationalVideo } from '../types';

export const DEFAULT_TENSE_VIDEOS: Record<string, EducationalVideo[]> = {
  present_simple: [
    {
      id: 'ps_vid_1',
      titleAr: 'شرح شامل للمضارع البسيط (Present Simple) مع القواعد والأمثلة',
      titleEn: 'Present Simple Tense - Grammar & Practice',
      videoUrl: '/videos/simple_present.mp4',
      duration: '10:45',
      channelName: 'English Grammar Hub',
      summaryAr: 'شرح مفصل لكيفية استخدام المضارع البسيط في العادات والروتين اليومي وإضافة s/es لضمائر المفرد الغائب.',
      timestamps: [
        { label: 'المقدمة ومفهوم الزمن', timeInSeconds: 0 },
        { label: 'قاعدة الإثبات والضمائر', timeInSeconds: 95 },
        { label: 'النفي باستخدام do/does not', timeInSeconds: 240 },
        { label: 'تكوين الأسئلة', timeInSeconds: 410 },
      ]
    }
  ],
  present_continuous: [
    {
      id: 'pc_vid_1',
      titleAr: 'شرح المضارع المستمر (Present Continuous) وكيفية إضافة -ing',
      titleEn: 'Present Continuous Tense Guide',
      videoUrl: '/videos/present_progresseive.mp4',
      duration: '09:15',
      channelName: 'English Grammar Hub',
      summaryAr: 'شرح وافٍ للأحداث التي تقع الآن في لحظة التحدث والتغيرات الإملائية للأفعال المنتهية بـ e أو حروف ساكنة.'
    }
  ],
  present_perfect: [
    {
      id: 'pp_vid_1',
      titleAr: 'المضارع التام (Present Perfect) - متى نستخدم have/has + V3؟',
      titleEn: 'Present Perfect Tense Masterclass',
      videoUrl: '/videos/present_perfect.mp4',
      duration: '12:10',
      channelName: 'Oxford English Lessons',
      summaryAr: 'ربط الماضي بالحاضر، والتفريق بين التجارب الحياتية والنتائج الحالية واستخدام since و for و already و yet.'
    }
  ],
  present_perfect_continuous: [
    {
      id: 'ppc_vid_1',
      titleAr: 'المضارع التام المستمر (Present Perfect Continuous) بالتفصيل',
      titleEn: 'Present Perfect Continuous Explanation',
      videoUrl: '/videos/present_perfect_progressive.mp4',
      duration: '11:05',
      channelName: 'Grammar Studio',
      summaryAr: 'التركيز على استمرارية الحدث من الماضي حتى الوقت الحاضر والتأكيد على المدة الزمنية.'
    }
  ],
  past_simple: [
    {
      id: 'past_s_vid_1',
      titleAr: 'الماضي البسيط (Past Simple) والأفعال المنتظمة والشاذة (Regular & Irregular)',
      titleEn: 'Past Simple Tense Complete Guide',
      videoUrl: '/videos/simple_past.mp4',
      duration: '10:30',
      channelName: 'English Grammar Hub',
      summaryAr: 'كيفية صياغة الماضي البسيط والتصريف الثاني للفعل واستخدام Did في النفي والاستفهام.'
    }
  ],
  past_continuous: [
    {
      id: 'past_c_vid_1',
      titleAr: 'الماضي المستمر (Past Continuous) مع When و While',
      titleEn: 'Past Continuous Tense with When & While',
      videoUrl: '/videos/Past_progressive.mp4',
      duration: '09:40',
      channelName: 'English Grammar Hub',
      summaryAr: 'شرح استخدام was/were + V-ing والتعبير عن حدث كان مستمراً وقطعه حدث آخر في الماضي.'
    }
  ],
  past_perfect: [
    {
      id: 'past_p_vid_1',
      titleAr: 'الماضي التام (Past Perfect) - ما هو الحدث الأقدم في الماضي؟',
      titleEn: 'Past Perfect Tense Made Simple',
      videoUrl: '/videos/Past_perfect.mp4',
      duration: '08:50',
      channelName: 'Oxford English Lessons',
      summaryAr: 'استخدام had + V3 للتعبير عن الحدث الأول الذي وقع قبل حدث آخر في الماضي.'
    }
  ],
  past_perfect_continuous: [
    {
      id: 'past_pc_vid_1',
      titleAr: 'الماضي التام المستمر (Past Perfect Continuous)',
      titleEn: 'Past Perfect Continuous Explained',
      videoUrl: '/videos/past_perfect_progressive.mp4',
      duration: '08:15',
      channelName: 'Grammar Master',
      summaryAr: 'had been + V-ing والتعبير عن مدة استمرار حدث قبل وقوع حدث آخر في الماضي.'
    }
  ],
  future_simple: [
    {
      id: 'fut_s_vid_1',
      titleAr: 'المستقبل البسيط: الفرق الدقيق بين Will و Going to',
      titleEn: 'Future Simple - Will vs Going To',
      videoUrl: '/videos/simple_future.mp4',
      duration: '11:20',
      channelName: 'English Grammar Hub',
      summaryAr: 'القرارات اللحظية والتوقعات بدون دليل مقابل الخطط المسبقة والتوقعات القائمة على دليل مرئي.'
    }
  ],
  future_continuous: [
    {
      id: 'fut_c_vid_1',
      titleAr: 'المستقبل المستمر (Future Continuous) - will be + V-ing',
      titleEn: 'Future Continuous Tense Lesson',
      videoUrl: '/videos/future_progressive.mp4',
      duration: '07:50',
      channelName: 'Grammar Studio',
      summaryAr: 'التعبير عن حدث سيكون مستمراً في نقطة محددة في المستقبل.'
    }
  ],
  future_perfect: [
    {
      id: 'fut_p_vid_1',
      titleAr: 'المستقبل التام (Future Perfect) - will have + V3 مع By',
      titleEn: 'Future Perfect Tense in Depth',
      videoUrl: '/videos/future_perfect.mp4',
      duration: '08:40',
      channelName: 'Oxford English Lessons',
      summaryAr: 'التعبير عن حدث سيكون قد اكتمل وانتهى قبل حلول وقت معين في المستقبل.'
    }
  ],
  future_perfect_continuous: [
    {
      id: 'fut_pc_vid_1',
      titleAr: 'المستقبل التام المستمر (Future Perfect Continuous)',
      titleEn: 'Future Perfect Continuous Complete Breakdown',
      videoUrl: '/videos/Future_Perfect_Continuous.mp4',
      duration: '07:30',
      channelName: 'Grammar Master',
      summaryAr: 'will have been + V-ing والتعبير عن قياس مدة استمرار الفعل بحلول نقطة زمنية مستقبلية.'
    }
  ],
};

export function getTenseVideos(tenseId: string): EducationalVideo[] {
  return DEFAULT_TENSE_VIDEOS[tenseId] || [];
}

export function getDefaultVideoForTense(tenseId: string): string {
  const list = getTenseVideos(tenseId);
  if (list && list.length > 0) {
    return list[0].videoUrl;
  }
  return '/videos/simple_present.mp4';
}