// Helper to select and cache high-quality English female voices
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

// Known female voice names or markers across Chrome, Safari, Edge, Android, iOS, Windows, macOS
const FEMALE_VOICE_NAMES = [
  'zira',
  'jenny',
  'samantha',
  'victoria',
  'karen',
  'moira',
  'fiona',
  'serena',
  'tessa',
  'stephanie',
  'susan',
  'aria',
  'ava',
  'emma',
  'sonia',
  'natasha',
  'clara',
  'alice',
  'allison',
  'helena',
  'catherine',
  'linda',
  'amy',
  'joanna',
  'kendra',
  'salli',
  'kimberly',
  'ivy'
];

export function getEnglishFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  let voices = cachedVoices;
  if (!voices || voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
    cachedVoices = voices;
  }

  if (!voices || voices.length === 0) return null;

  // Filter for English voices (en-US, en-GB, en-AU, en-CA, en-IE, etc.)
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  if (englishVoices.length === 0) return null;

  // 1. Check for explicit "Female" or "woman" tags in name or voiceURI
  const explicitlyFemale = englishVoices.find(v => {
    const info = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
    return info.includes('female') || info.includes('woman');
  });
  if (explicitlyFemale) return explicitlyFemale;

  // 2. Check for popular high-quality Natural/Online female voices (e.g., Google US English female, Microsoft Jenny, Zira, Samantha, etc.)
  for (const name of FEMALE_VOICE_NAMES) {
    const match = englishVoices.find(v => v.name.toLowerCase().includes(name));
    if (match) return match;
  }

  // 3. Check for Google US English (frequently high-quality female TTS on Chrome/Android)
  const googleVoice = englishVoices.find(v => 
    v.name.toLowerCase().includes('google') && 
    (v.lang === 'en-US' || v.lang.startsWith('en')) &&
    !v.name.toLowerCase().includes('male')
  );
  if (googleVoice) return googleVoice;

  // 4. Exclude explicitly male voices
  const nonMaleVoice = englishVoices.find(v => {
    const info = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
    return !info.includes('male') && 
           !info.includes('david') && 
           !info.includes('mark') && 
           !info.includes('george') && 
           !info.includes('daniel') && 
           !info.includes('guy') && 
           !info.includes('alex') && 
           !info.includes('fred');
  });
  if (nonMaleVoice) return nonMaleVoice;

  // Fallback to any English voice
  return englishVoices.find(v => v.lang === 'en-US') || englishVoices[0];
}

export function playEnglishAudio(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this environment');
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any currently playing audio

      // Special handling for "was / were": pronounce as separate words without speaking the slash character
      const spokenText = text.replace(/\bwas\s*\/\s*were\b/gi, 'was ... were');

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = 'en-US';
      utterance.rate = rate; // slightly slower for educational clarity
      utterance.pitch = 1.15; // slightly higher pitch to guarantee a pleasant, natural female tone

      // Select high-quality female English voice
      const femaleVoice = getEnglishFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Audio playback error:', err);
      resolve();
    }
  });
}
