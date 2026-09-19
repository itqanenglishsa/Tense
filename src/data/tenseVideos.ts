import { EducationalVideo } from '../types';

export const DEFAULT_TENSE_VIDEOS: Record<string, EducationalVideo[]> = {
  present_simple: [
    {
      id: 'ps_vid_1',
      titleAr: 'المضارع البسيط (Simple Present) - العادات، قواعد التصريف، والضمائر',
      titleEn: 'Simple Present - Verb Forms, Pronoun Rules & Practice',
      videoUrl: '/videos/simple_present.mp4',
      duration: '04:50',
      channelName: 'ESL Library',
      summaryAr:
        'شرح تفصيلي مبسط لزمن المضارع البسيط يتناول مفهوم أزمنة الأفعال، التعبير عن الأفعال المتكررة (Repeated Actions)، صيغتي الفعل (Base verb مقابل verb + s)، وقواعد ضمائر الفاعل وحالات الأسماء المفردة والجمع مع فقرة تمارين تطبيقية.',
      timestamps: [
        {
          label: 'المقدمة: ما هي أزمنة الأفعال؟ (What are verb tenses?)',
          timeInSeconds: 0,
        },
        {
          label: 'استخدام المضارع البسيط للأفعال المتكررة (Repeated Actions)',
          timeInSeconds: 18,
        },
        {
          label: 'أمثلة الروتين اليومي (Breakfast, Reading, Studying)',
          timeInSeconds: 28,
        },
        {
          label: 'صيغتا الفعل في المضارع البسيط: (Base verb) و (Verb + s)',
          timeInSeconds: 49,
        },
        {
          label: 'ضمائر الفاعل مع الفعل المجرد (I, You, We, They)',
          timeInSeconds: 76,
        },
        {
          label: 'ضمائر المفرد الغائب وإضافة حرف s للفعل (He, She, It)',
          timeInSeconds: 104,
        },
        {
          label: 'حالات أسماء الفاعل: الجمع، المفرد، وغير المعدود',
          timeInSeconds: 125,
        },
        {
          label: 'فقرة التدريب العملي والتطبيق التفاعلي (Practice Session)',
          timeInSeconds: 175,
        },
      ],
    },
  ],

  present_continuous: [
    {
      id: 'pc_vid_1',
      titleAr: 'شرح المضارع المستمر (Present Continuous) وكيفية إضافة -ing',
      titleEn: 'Present Continuous Tense Guide',
      videoUrl: '/videos/present_progresseive.mp4',
      duration: '09:15',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'شرح وافٍ للأحداث التي تقع الآن في لحظة التحدث والتغيرات الإملائية للأفعال المنتهية بـ e أو حروف ساكنة.',
    },
  ],

  present_perfect: [
    {
      id: 'pp_vid_1',
      titleAr: 'المضارع التام (Present Perfect) - متى نستخدم have/has + V3؟',
      titleEn: 'Present Perfect Tense Masterclass',
      videoUrl: '/videos/present_perfect.mp4',
      duration: '12:10',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'ربط الماضي بالحاضر، والتفريق بين التجارب الحياتية والنتائج الحالية واستخدام since و for و already و yet.',
    },
  ],

  present_perfect_continuous: [
    {
      id: 'ppc_vid_1',
      titleAr: 'المضارع التام المستمر (Present Perfect Continuous) بالتفصيل',
      titleEn: 'Present Perfect Continuous Explanation',
      videoUrl: '/videos/present_perfect_progressive.mp4',
      duration: '11:05',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'التركيز على استمرارية الحدث من الماضي حتى الوقت الحاضر والتأكيد على المدة الزمنية.',
    },
  ],

  past_simple: [
    {
      id: 'past_s_vid_1',
      titleAr: 'الماضي البسيط (Past Simple) والأفعال المنتظمة والشاذة (Regular & Irregular)',
      titleEn: 'Past Simple Tense Complete Guide',
      videoUrl: '/videos/simple_past.mp4',
      duration: '10:30',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'كيفية صياغة الماضي البسيط والتصريف الثاني للفعل واستخدام Did في النفي والاستفهام.',
    },
  ],

  past_continuous: [
    {
      id: 'past_c_vid_1',
      titleAr: 'الماضي المستمر (Past Continuous) مع When و While',
      titleEn: 'Past Continuous Tense with When & While',
      videoUrl: '/videos/Past_progressive.mp4',
      duration: '09:40',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'شرح استخدام was/were + V-ing والتعبير عن حدث كان مستمراً وقطعه حدث آخر في الماضي.',
    },
  ],

  past_perfect: [
    {
      id: 'past_p_vid_1',
      titleAr: 'الماضي التام (Past Perfect) - ما هو الحدث الأقدم في الماضي؟',
      titleEn: 'Past Perfect Tense Made Simple',
      videoUrl: '/videos/Past_perfect.mp4',
      duration: '08:50',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'استخدام had + V3 للتعبير عن الحدث الأول الذي وقع قبل حدث آخر في الماضي.',
    },
  ],

  past_perfect_continuous: [
    {
      id: 'past_pc_vid_1',
      titleAr: 'الماضي التام المستمر (Past Perfect Continuous)',
      titleEn: 'Past Perfect Continuous Explained',
      videoUrl: '/videos/past_perfect_progressive.mp4',
      duration: '08:15',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'had been + V-ing والتعبير عن مدة استمرار حدث قبل وقوع حدث آخر في الماضي.',
    },
  ],

  future_simple: [
    {
      id: 'fut_s_vid_1',
      titleAr: 'المستقبل البسيط: الفرق الدقيق بين Will و Going to',
      titleEn: 'Future Simple - Will vs Going To',
      videoUrl: '/videos/simple_future.mp4',
      duration: '11:20',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'القرارات اللحظية والتوقعات بدون دليل مقابل الخطط المسبقة والتوقعات القائمة على دليل مرئي.',
    },
  ],

  future_continuous: [
    {
      id: 'fut_c_vid_1',
      titleAr: 'المستقبل المستمر (Future Continuous) - will be + V-ing',
      titleEn: 'Future Continuous Tense Lesson',
      videoUrl: '/videos/future_progressive.mp4',
      duration: '07:50',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'التعبير عن حدث سيكون مستمراً في نقطة محددة في المستقبل.',
    },
  ],

  future_perfect: [
    {
      id: 'fut_p_vid_1',
      titleAr:
        'المستقبل التام (Future Perfect) - اكتمال الأحداث 100% قبل موعد محدد في المستقبل',
      titleEn:
        'Future Perfect Tense - Building the Tense & Beating the Deadline',
      videoUrl: '/videos/future_perfect.mp4',
      duration: '05:17',
      channelName: 'The Learning Curve',
      summaryAr:
        'شرح شامل لقاعدة المستقبل التام للتعبير عن أحداث ستكون مكتملة بنسبة 100% قبل وقت أو حدث محدد في المستقبل. يتضمن: تشبيه السفر عبر الزمن، المعادلة الثلاثية للزمن (Subject + will have + V3)، قاعدة التغلب على الموعد النهائي (Beating the Deadline) بأمثلة واقعية، واستخدام الكلمة السحرية "By" بمعنى (not later than).',
      timestamps: [
        {
          label:
            'المقدمة: مفهوم اكتمال الحدث بنسبة 100% وتشبيه السفر عبر الزمن',
          timeInSeconds: 0,
        },
        {
          label:
            'القسم الثاني: المعادلة الثلاثية للزمن (Subject + will have + V3)',
          timeInSeconds: 53,
        },
        {
          label: 'أمثلة المعادلة وتناسق will have مع جميع الضمائر',
          timeInSeconds: 95,
        },
        {
          label: 'القسم الثالث: التغلب على الموعد النهائي (Beating the Deadline)',
          timeInSeconds: 116,
        },
        {
          label: 'أمثلة واقعية من الحياة اليومية (Homework & Hospital)',
          timeInSeconds: 156,
        },
        {
          label:
            'القسم الرابع: الكلمة السحرية By وسلاح الزمن السري (Not later than)',
          timeInSeconds: 207,
        },
        {
          label:
            'التطبيق والتحدي الذاتي: Will you have graduated by 2026?',
          timeInSeconds: 271,
        },
      ],
    },
  ],

  future_perfect_continuous: [
    {
      id: 'fut_pc_vid_1',
      titleAr: 'المستقبل التام المستمر (Future Perfect Continuous)',
      titleEn: 'Future Perfect Continuous Complete Breakdown',
      videoUrl: '/videos/Future_Perfect_Continuous.mp4',
      duration: '07:30',
      channelName: 'درس تعليمي مسجل محلياً',
      summaryAr:
        'will have been + V-ing والتعبير عن قياس مدة استمرار الفعل بحلول نقطة زمنية مستقبلية.',
    },
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

  return `/videos/${tenseId}.mp4`;
}