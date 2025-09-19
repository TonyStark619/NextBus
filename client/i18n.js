export const languages = {
  en: 'English',
  hi: 'हिन्दी',
  pa: 'ਪੰਜਾਬੀ',
  bn: 'বাংলা',
  as: 'অসমীয়া',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
};

export const messages = {
  en: {
    useMyLocation: 'Use My Location',
    from: 'From',
    destination: 'Destination',
    findRoute: 'Find Route',
    openInMaps: 'Open in Maps',
    swap: 'Swap',
    home: 'Home',
    features: 'Features',
    download: 'Download',
    contact: 'Contact',
    settings: 'Settings',
    timings: 'Timings',
  },
  hi: {
    useMyLocation: 'मेरी लोकेशन का उपयोग करें',
    from: 'से',
    destination: 'गंतव्य',
    findRoute: 'रूट ढूंढें',
    openInMaps: 'मैप में खोलें',
    swap: 'बदलें',
    home: 'होम',
    features: 'फीचर्स',
    download: 'डाउनलोड',
    contact: 'संपर्क',
    settings: 'सेटिंग्स',
    timings: 'समय सारिणी',
  },
  pa: { useMyLocation: 'ਮੇਰੀ ਲੋਕੇਸ਼ਨ ਵਰਤੋ', from: 'ਤੋਂ', destination: 'ਮੰਜ਼ਿਲ', findRoute: 'ਰੂਟ ਲੱਭੋ', openInMaps: 'ਨਕਸ਼ੇ ਵਿੱਚ ਖੋਲ੍ਹੋ', swap: 'ਬਦਲੋ' },
  bn: { useMyLocation: 'আমার অবস্থান ব্যবহার করুন', from: 'থেকে', destination: 'গন্তব্য', findRoute: 'রুট খুঁজুন', openInMaps: 'ম্যাপে খুলুন', swap: 'অদলবদল' },
  as: { useMyLocation: 'মোৰ অৱস্থান ব্যৱহাৰ কৰক', from: 'পৰা', destination: 'গন্তব্য', findRoute: 'পথ বিচাৰক', openInMaps: 'মানচিত্ৰত খোলক', swap: 'সলনি' },
  te: { useMyLocation: 'నా స్థానం వాడండి', from: 'నుండి', destination: 'గమ్యం', findRoute: 'మార్గం కనుగొను', openInMaps: 'మ్యాప్ లో తెరువు', swap: 'మార్చు' },
  ta: { useMyLocation: 'என் இருப்பிடத்தை பயன்படுத்து', from: 'இருந்து', destination: 'இலக்கு', findRoute: 'பாதை காண்', openInMaps: 'வரைபடத்தில் திற', swap: 'மாற்று' },
  kn: { useMyLocation: 'ನನ್ನ ಸ್ಥಳ ಬಳಸು', from: 'ಇಂದ', destination: 'ಗಮ್ಯಸ್ಥಾನ', findRoute: 'ಮಾರ್ಗ ಹುಡುಕಿ', openInMaps: 'ನಕ್ಷೆಯಲ್ಲಿ ತೆರೆಯಿರಿ', swap: 'ಬದಲಾಯಿಸಿ' },
};

export function getLocale() {
  return localStorage.getItem('locale') || 'en';
}

export function setLocale(code) {
  localStorage.setItem('locale', code);
}

export function t(key) {
  const loc = getLocale();
  return (messages[loc] && messages[loc][key]) || messages.en[key] || key;
}

// Apply translations on load for any page using data-i18n
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

if (typeof window !== 'undefined') {
  // Auto-apply when module is imported
  try { applyTranslations(); } catch (_e) {}
}


