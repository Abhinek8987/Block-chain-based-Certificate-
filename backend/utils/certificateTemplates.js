const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Certificate templates with different designs
const templates = {
  classic: {
    name: 'Classic Professional',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#fbbf24',
      text: '#1f2937'
    },
    layout: 'landscape',
    decorative: true
  },
  modern: {
    name: 'Modern Minimalist',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#f59e0b',
      text: '#111827'
    },
    layout: 'landscape',
    decorative: false
  },
  elegant: {
    name: 'Elegant Formal',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#f97316',
      text: '#374151'
    },
    layout: 'landscape',
    decorative: true
  },
  academic: {
    name: 'Academic Traditional',
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#eab308',
      text: '#1f2937'
    },
    layout: 'landscape',
    decorative: true // Uses polished layout with borders
  },
  corporate: {
    name: 'Corporate Professional',
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#06b6d4',
      text: '#334155'
    },
    layout: 'landscape',
    decorative: false
  },
  multilingual_split: {
    name: 'Multilingual Split (Bilingual)',
    colors: {
      primary: '#1e3a8a',
      secondary: '#1e40af',
      accent: '#f59e0b',
      text: '#1f2937',
      background: '#ffffff'
    },
    layout: 'landscape',
    decorative: false,
    type: 'split'
  },
  compact: {
    name: 'Compact Digital (Portrait)',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#0ea5e9',
      text: '#1e293b',
      background: '#f8fafc'
    },
    layout: 'portrait',
    decorative: false,
    type: 'compact'
  }
};

// Extended language support (all 22 Indian languages)
const extendedTranslations = {
  english: {
    certificateOfCompletion: "Certificate of Completion",
    thisIsToCertify: "This is to certify that",
    hasSuccessfullyCompleted: "has successfully completed",
    issuedBy: "Issued by",
    dateOfIssue: "Date of Issue",
    courseName: "Course Name",
    certificateId: "Certificate ID",
    authorizedSignature: "Authorized Signature",
    instructor: "Instructor",
    grade: "Grade",
    description: "Achievement",
    scanToVerify: "Scan to Verify",
    recognitionPhrase: "in recognition of the successful completion of the academic program with demonstrated dedication and satisfactory performance.",
    duration: "Duration",
    from: "From",
    to: "to",
    authorityStatement: "This certificate is issued under the authority of",
    validFor: "and is valid for academic and professional use."
  },
  hindi: {
    certificateOfCompletion: "पूर्णता प्रमाणपत्र",
    thisIsToCertify: "यह प्रमाणित करता है कि",
    hasSuccessfullyCompleted: "ने सफलतापूर्वक पूरा किया है",
    issuedBy: "द्वारा जारी",
    dateOfIssue: "जारी करने की तारीख",
    courseName: "पाठ्यक्रम का नाम",
    certificateId: "प्रमाणपत्र आईडी",
    authorizedSignature: "अधिकृत हस्ताक्षर",
    instructor: "शिक्षक",
    grade: "ग्रेड",
    description: "उपलब्धि",
    scanToVerify: "सत्यापन के लिए स्कैन करें",
    recognitionPhrase: "शैक्षणिक कार्यक्रम को निष्ठा और संतोषजनक प्रदर्शन के साथ सफलतापूर्वक पूरा करने की मान्यता में।",
    duration: "अवधि",
    from: "से",
    to: "तक",
    authorityStatement: "यह प्रमाण पत्र इसके अधिकार के तहत जारी किया गया है",
    validFor: "और शैक्षणिक और व्यावसायिक उपयोग के लिए मान्य है।"
  },
  tamil: {
    certificateOfCompletion: "நிறைவு சான்றிதழ்",
    thisIsToCertify: "இது சான்றளிக்கிறது",
    hasSuccessfullyCompleted: "வெற்றிகரமாக முடித்துள்ளார்",
    issuedBy: "வழங்கியவர்",
    dateOfIssue: "வழங்கிய தேதி",
    courseName: "பாடநெறி பெயர்",
    certificateId: "சான்றிதழ் எண்",
    authorizedSignature: "அங்கீகரிக்கப்பட்ட கையொப்பம்",
    instructor: "ஆசிரியர்",
    grade: "தரம்",
    description: "சாதனை",
    scanToVerify: "சரிபார்க்க ஸ்கேன் செய்யவும்",
    recognitionPhrase: "கல்வித் திட்டத்தை அர்ப்பணிப்பு மற்றும் திருப்திகரமான செயல்திறனுடன் வெற்றிகரமாக முடித்ததற்கான அங்கீகாரமாக.",
    duration: "காலம்",
    from: "லிருந்து",
    to: "வரை",
    authorityStatement: "இந்த சான்றிதழ் இதன் அதிகாரத்தின் கீழ் வழங்கப்படுகிறது",
    validFor: "கல்வி மற்றும் தொழில்முறை பயன்பாட்டிற்கு செல்லுபடியாகும்."
  },
  telugu: {
    certificateOfCompletion: "పూర్తి చేసిన ప్రమాణపత్రం",
    thisIsToCertify: "ఇది ధృవీకరిస్తుంది",
    hasSuccessfullyCompleted: "విజయవంతంగా పూర్తి చేశారు",
    issuedBy: "జారీ చేసినవారు",
    dateOfIssue: "జారీ చేసిన తేదీ",
    courseName: "కోర్సు పేరు",
    certificateId: "ప్రమాణపత్ర ID",
    authorizedSignature: "అధికృత సంతకం",
    instructor: "బోధకుడు",
    grade: "గ్రేడ్",
    description: "సాధన",
    scanToVerify: "ధృవీకరించడానికి స్కాన్ చేయండి",
    recognitionPhrase: "విద్యా కార్యక్రమాన్ని అంకితభావం మరియు సంతృప్తికరమైన పనితీరుతో విజయవంతంగా పూర్తి చేసినందుకు గుర్తింపుగా.",
    duration: "నిడివి",
    from: "నుండి",
    to: "వరకు",
    authorityStatement: "ఈ సర్టిఫికేట్ దీని అధికారంతో జారీ చేయబడింది",
    validFor: "మరియు విద్యా మరియు వృత్తిపరమైన ఉపయోగం కోసం చెల్లుబాటు అవుతుంది."
  },
  malayalam: {
    certificateOfCompletion: "പൂർത്തീകരണ സർട്ടിഫിക്കറ്റ്",
    thisIsToCertify: "ഇത് സാക്ഷ്യപ്പെടുത്തുന്നു",
    hasSuccessfullyCompleted: "വിജയകരമായി പൂർത്തിയാക്കി",
    issuedBy: "നൽകിയത്",
    dateOfIssue: "നൽകിയ തീയതി",
    courseName: "കോഴ്സ് നാമം",
    certificateId: "സർട്ടിഫിക്കറ്റ് ID",
    authorizedSignature: "അംഗീകൃത ഒപ്പ്",
    instructor: "അധ്യാപകൻ",
    grade: "ഗ്രേഡ്",
    description: "നേട്ടം",
    scanToVerify: "പരിശോധിക്കാൻ സ്കാൻ ചെയ്യുക",
    recognitionPhrase: "അക്കാദമിക് പ്രോഗ്രാം അർപ്പണബോധത്തോടെയും സംതൃപ്തികരമായ പ്രകടനത്തോടെയും വിജയകരമായി പൂർത്തിയാക്കിയതിൻ്റെ അംഗീകാരമായി.",
    duration: "കാലയളവ്",
    from: "മുതൽ",
    to: "വരെ",
    authorityStatement: "ഈ സർട്ടിഫിക്കറ്റ് ഇതിന്റെ അധികാരത്തിന് കീഴിലാണ് നൽകിയിരിക്കുന്നത്",
    validFor: "അക്കാദമിക്, പ്രൊഫഷണൽ ഉപയോഗത്തിന് സാധുവാണ്."
  },
  kannada: {
    certificateOfCompletion: "ಪೂರ್ಣಗೊಳಿಸುವಿಕೆಯ ಪ್ರಮಾಣಪತ್ರ",
    thisIsToCertify: "ಇದು ಪ್ರಮಾಣೀಕರಿಸುತ್ತದೆ",
    hasSuccessfullyCompleted: "ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದಾರೆ",
    issuedBy: "ನೀಡಿದವರು",
    dateOfIssue: "ನೀಡಿದ ದಿನಾಂಕ",
    courseName: "ಕೋರ್ಸ್ ಹೆಸರು",
    certificateId: "ಪ್ರಮಾಣಪತ್ರ ID",
    authorizedSignature: "ಅಧಿಕೃತ ಸಹಿ",
    instructor: "ಶಿಕ್ಷಕ",
    grade: "ಗ್ರೇಡ್",
    description: "ಸಾಧನೆ",
    scanToVerify: "ಪರಿಶೀಲಿಸಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    recognitionPhrase: "ಶೈಕ್ಷಣಿಕ ಕಾರ್ಯಕ್ರಮವನ್ನು ಸಮರ್ಪಣೆ ಮತ್ತು ತೃಪ್ತಿಕರ ಕಾರ್ಯಕ್ಷಮತೆಯೊಂದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದಕ್ಕಾಗಿ.",
    duration: "ಅವಧಿ",
    from: "ಇಂದ",
    to: "ವರೆಗೆ",
    authorityStatement: "ಈ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಇದರ ಅಧಿಕಾರದ ಅಡಿಯಲ್ಲಿ ನೀಡಲಾಗಿದೆ",
    validFor: "ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಮತ್ತು ವೃತ್ತಿಪರ ಬಳಕೆಗೆ ಮಾನ್ಯವಾಗಿದೆ."
  },
  marathi: {
    certificateOfCompletion: "पूर्णता प्रमाणपत्र",
    thisIsToCertify: "हे प्रमाणित करते",
    hasSuccessfullyCompleted: "यशस्वीरित्या पूर्ण केले आहे",
    issuedBy: "द्वारे जारी",
    dateOfIssue: "जारी करण्याची तारीख",
    courseName: "अभ्यासक्रमाचे नाव",
    certificateId: "प्रमाणपत्र ID",
    authorizedSignature: "अधिकृत स्वाक्षरी",
    instructor: "शिक्षक",
    grade: "श्रेणी",
    description: "यश",
    scanToVerify: "पडताळणीसाठी स्कॅन करा",
    recognitionPhrase: "शैक्षणिक कार्यक्रम समर्पितपणे आणि समाधानकारक कामगिरीसह यशस्वीरित्या पूर्ण केल्याबद्दल.",
    duration: "कालावधी",
    from: "पासुन",
    to: "पर्यंत",
    authorityStatement: "हे प्रमाणपत्र या अधिकारांतर्गत जारी केले आहे",
    validFor: "आणि शैक्षणिक व व्यावसायिक वापरासाठी वैध आहे."
  },
  gujarati: {
    certificateOfCompletion: "પૂર્ણતા પ્રમાણપત્ર",
    thisIsToCertify: "આ પ્રમાણિત કરે છે",
    hasSuccessfullyCompleted: "સફળતાપૂર્વક પૂર્ણ કર્યું છે",
    issuedBy: "દ્વારા જારી",
    dateOfIssue: "જારી કરવાની તારીખ",
    courseName: "કોર્સનું નામ",
    certificateId: "પ્રમાણપત્ર ID",
    authorizedSignature: "અધિકૃત સહી",
    instructor: "શિક્ષક",
    grade: "ગ્રેડ",
    description: "સિદ્ધિ",
    scanToVerify: "ચકાસણી માટે સ્કેન કરો",
    recognitionPhrase: "શૈક્ષણિક કાર્યક્રમ સમર્પણ અને સંતોષકારક કામગીરી સાથે સફળતાપૂર્વક પૂર્ણ કરવા બદલ.",
    duration: "સમયગાળો",
    from: "થી",
    to: "સુધી",
    authorityStatement: "આ પ્રમાણપત્ર સત્તા હેઠળ જારી કરવામાં આવે છે",
    validFor: "અને શૈક્ષણિક અને વ્યવસાયિક ઉપયોગ માટે માન્ય છે."
  },
  bengali: {
    certificateOfCompletion: "সমাপনী সনদপত্র",
    thisIsToCertify: "এটি প্রত্যয়ন করে",
    hasSuccessfullyCompleted: "সফলভাবে সম্পন্ন করেছেন",
    issuedBy: "দ্বারা জারি",
    dateOfIssue: "জারির তারিখ",
    courseName: "কোর্সের নাম",
    certificateId: "সনদপত্র ID",
    authorizedSignature: "অনুমোদিত স্বাক্ষর",
    instructor: "শিক্ষক",
    grade: "গ্রেড",
    description: "অর্জন",
    scanToVerify: "যাচাই করতে স্ক্যান করুন",
    recognitionPhrase: "একাডেমিক প্রোগ্রামটি নিষ্ঠা এবং সন্তোষজনক পারফরম্যান্সের সাথে সফলভাবে সমাপ্ত করার স্বীকৃতিস্বরূপ।",
    duration: "সময়কাল",
    from: "থেকে",
    to: "পর্যন্ত",
    authorityStatement: "এই সনদপত্রটি এর কর্তৃপক্ষের অধীনে জারি করা হয়েছে",
    validFor: "এবং একাডেমিক ও পেশাদার ব্যবহারের জন্য বৈধ।"
  },
  punjabi: {
    certificateOfCompletion: "ਸੰਪੂਰਨਤਾ ਪ੍ਰਮਾਣ ਪੱਤਰ",
    thisIsToCertify: "ਇਹ ਪ੍ਰਮਾਣਿਤ ਕਰਦਾ ਹੈ",
    hasSuccessfullyCompleted: "ਸਫਲਤਾਪੂਰਵਕ ਪੂਰਾ ਕੀਤਾ ਹੈ",
    issuedBy: "ਦੁਆਰਾ ਜਾਰੀ",
    dateOfIssue: "ਜਾਰੀ ਕਰਨ ਦੀ ਤਾਰੀਖ",
    courseName: "ਕੋਰਸ ਦਾ ਨਾਮ",
    certificateId: "ਪ੍ਰਮਾਣ ਪੱਤਰ ID",
    authorizedSignature: "ਅਧਿਕਾਰਤ ਦਸਤਖਤ",
    instructor: "ਅਧਿਆਪਕ",
    grade: "ਗ੍ਰੇਡ",
    description: "ਪ੍ਰਾਪਤੀ",
    scanToVerify: "ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਸਕੈਨ ਕਰੋ",
    recognitionPhrase: "ਵਿੱਦਿਅਕ ਪ੍ਰੋਗਰਾਮ ਨੂੰ ਸਮਰਪਣ ਅਤੇ ਤਸੱਲੀਬਖਸ਼ ਪ੍ਰਦਰਸ਼ਨ ਨਾਲ ਸਫਲਤਾਪੂਰਵਕ ਨੇਪਰੇ ਚਾੜ੍ਹਨ ਦੀ ਮਾਨਤਾ ਵਿੱਚ।",
    duration: "ਮਿਆਦ",
    from: "ਤੋਂ",
    to: "ਤੱਕ",
    authorityStatement: "ਇਹ ਸਰਟੀਫਿਕੇਟ ਇਸ ਦੇ ਅਧਿਕਾਰ ਹੇਠ ਜਾਰੀ ਕੀਤਾ ਗਿਆ ਹੈ",
    validFor: "ਅਤੇ ਅਕਾਦਮਿਕ ਅਤੇ ਪੇਸ਼ੇਵਰ ਵਰਤੋਂ ਲਈ ਵੈਧ ਹੈ।"
  },
  urdu: {
    certificateOfCompletion: "تکمیل کا سرٹیفکیٹ",
    thisIsToCertify: "یہ تصدیق کرتا ہے",
    hasSuccessfullyCompleted: "کامیابی سے مکمل کیا ہے",
    issuedBy: "کی طرف سے جاری",
    dateOfIssue: "جاری کرنے کی تاریخ",
    courseName: "کورس کا نام",
    certificateId: "سرٹیفکیٹ ID",
    authorizedSignature: "مجاز دستخط",
    instructor: "استاد",
    grade: "گریڈ",
    description: "کامیابی",
    scanToVerify: "تصدیق کے لیے اسکین کریں۔",
    recognitionPhrase: "تعلیمی پروگرام کو لگن اور تسلی بخش کارکردگی کے ساتھ کامیابی سے مکمل کرنے کے اعتراف میں۔",
    duration: "دورانیہ",
    from: "سے",
    to: "تک",
    authorityStatement: "یہ سرٹیفکیٹ اس کے اختیار کے تحت جاری کیا گیا ہے",
    validFor: "اور تعلیمی اور پیشہ ورانہ استعمال کے لیے موزوں ہے۔"
  },
  assamese: {
    certificateOfCompletion: "সম্পূৰ্ণতাৰ প্ৰমাণপত্ৰ",
    thisIsToCertify: "ইয়াৰ দ্বাৰা প্ৰমাণিত কৰা হয়",
    hasSuccessfullyCompleted: "সফলতাৰে সম্পূৰ্ণ কৰিছে",
    issuedBy: "দ্বাৰা জাৰী",
    dateOfIssue: "জাৰীৰ তাৰিখ",
    courseName: "পাঠ্যক্ৰমৰ নাম",
    certificateId: "প্ৰমাণপত্ৰ ID",
    authorizedSignature: "অনুমোদিত স্বাক্ষৰ",
    instructor: "শিক্ষক",
    grade: "গ্ৰেড",
    description: "সাফল্য",
    scanToVerify: "সত্যাপনৰ বাবে স্কেন কৰক",
    recognitionPhrase: "শৈক্ষিক কাৰ্যসূচী নিষ্ঠা আৰু সন্তোষজনক প্ৰদৰ্শনৰ সৈতে সফলতাৰে সমাপ্ত কৰাৰ স্বীকৃতিস্বৰূপে।",
    duration: "সময়সীমা",
    from: "ৰ পৰা",
    to: "লৈ",
    authorityStatement: "এই প্ৰমাণপত্ৰ ইয়াৰ কৰ্তৃত্বৰ অধীনত জাৰী কৰা হৈছে",
    validFor: "আৰু শৈক্ষিক তথা পেছাদাৰী ব্যৱহাৰৰ বাবে বৈধ।"
  },
  odia: {
    certificateOfCompletion: "ସମାପନୀ ପ୍ରମାଣପତ୍ର",
    thisIsToCertify: "ଏହା ପ୍ରମାଣିତ କରେ",
    hasSuccessfullyCompleted: "ସଫଳତାର ସହିତ ସମ୍ପୂର୍ଣ୍ଣ କରିଛନ୍ତି",
    issuedBy: "ଦ୍ୱାରା ଜାରି",
    dateOfIssue: "ଜାରି ତାରିଖ",
    courseName: "ପାଠ୍ୟକ୍ରମ ନାମ",
    certificateId: "ପ୍ରମାଣପତ୍ର ID",
    authorizedSignature: "ଅନୁମୋଦିତ ଦସ୍ତଖତ",
    instructor: "ଶିକ୍ଷକ",
    grade: "ଗ୍ରେଡ୍",
    description: "ସଫଳତା",
    scanToVerify: "ଯାଞ୍ଚ କରିବାକୁ ସ୍କାନ୍ କରନ୍ତୁ",
    recognitionPhrase: "ଏକାଡେମିକ୍ କାର୍ଯ୍ୟକ୍ରମକୁ ନିଷ୍ଠା ଏବଂ ସନ୍ତୋଷଜନକ ପ୍ରଦର୍ଶନ ସହିତ ସଫଳତାର ସହ ସମାପ୍ତ କରିବାର ସ୍ୱୀକୃତି ସ୍ୱରୂପ।",
    duration: "ଅବଧି",
    from: "ଠାରୁ",
    to: "ପର୍ଯ୍ୟନ୍ତ",
    authorityStatement: "ଏହି ପ୍ରମାଣପତ୍ର ଏହାର ଅଧିକାର ଅଧୀନରେ ଜାରି କରାଯାଇଛି",
    validFor: "ଏବଂ ଏକାଡେମିକ୍ ଏବଂ ବୃତ୍ତିଗତ ବ୍ୟବହାର ପାଇଁ ବୈଧ ଅଟେ।"
  }
};

class CertificateTemplateEngine {
  constructor() {
    this.templates = templates;
    this.translations = extendedTranslations;
  }

  // Get available templates
  getTemplates() {
    return Object.keys(this.templates).map(key => ({
      id: key,
      name: this.templates[key].name,
      preview: `template-${key}-preview.png`
    }));
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.keys(this.translations).map(lang => ({
      code: lang,
      name: this.getLanguageDisplayName(lang),
      nativeName: this.getLanguageNativeName(lang)
    }));
  }

  // Get translation for specific language and key
  getTranslation(language, key) {
    const lang = language.toLowerCase();
    if (!this.translations[lang]) {
      return this.translations.english[key] || key;
    }
    return this.translations[lang][key] || this.translations.english[key] || key;
  }

  // Generate QR Code Image
  async drawQRCode(doc, text, x, y, size) {
    if (!text) return;
    try {
      const dataUrl = await QRCode.toDataURL(text, { margin: 1 });
      doc.image(dataUrl, x, y, { width: size, height: size });
    } catch (error) {
      console.error("QR Generation Error", error);
      doc.rect(x, y, size, size).stroke();
      doc.fontSize(8).text("QR Code", x, y + size / 2, { width: size, align: 'center' });
    }
  }

  // Draw certificate using selected template
  async drawCertificate(doc, data, templateId) {
    console.log(`[CertificateGenerator] Drawing ${templateId} in ${data.language}`);

    const template = this.templates[templateId] || this.templates.classic;
    const { colors } = template;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);
    const centerX = pageWidth / 2;

    // 🛡️ DEFAULT SAFE FONTS (English)
    let fontRegular = 'Helvetica';
    let fontBold = 'Helvetica-Bold';
    let fontOblique = 'Helvetica-Oblique';

    try {
      if (data.language && data.language.toLowerCase() !== 'english') {
        const fontMap = {
          hindi: 'NotoSansDevanagari-Regular.ttf',
          marathi: 'NotoSansDevanagari-Regular.ttf',
          tamil: 'NotoSansTamil-Regular.ttf',
          telugu: 'NotoSansTelugu-Regular.ttf',
          kannada: 'NotoSansKannada-Regular.ttf',
          malayalam: 'NotoSansMalayalam-Regular.ttf',
          bengali: 'NotoSansBengali-Regular.ttf',
          gujarati: 'NotoSansGujarati-Regular.ttf',
          punjabi: 'NotoSansGurmukhi-Regular.ttf',
          urdu: 'NotoSansArabic-Regular.ttf',
          assamese: 'NotoSansBengali-Regular.ttf',
          odia: 'NotoSansOriya-Regular.ttf'
        };

        const langKey = data.language.toLowerCase();
        const fontFileName = fontMap[langKey];

        if (fontFileName) {
          const fontPath = path.join(__dirname, '..', 'fonts', fontFileName);

          // 1. Verify File Exists
          if (fs.existsSync(fontPath)) {
            // 2. Register Font
            const fontName = `Regional_${langKey}`;
            doc.registerFont(fontName, fontPath);

            // 3. Set Fonts - CRITICAL: Mapped to same Regular font to prevent fake bold crash
            fontRegular = fontName;
            fontBold = fontName;
            fontOblique = fontName;

            console.log(`✅ Successfully loaded Unicode font: ${fontName}`);
          } else {
            console.warn(`⚠️ Font file missing: ${fontPath}. Fallback to Helvetica.`);
          }
        }
      }
    } catch (fontError) {
      console.error("❌ Font loading CRASH prevented. Retaining fallback.", fontError);
      // Reset to safe defaults just in case
      fontRegular = 'Helvetica';
      fontBold = 'Helvetica-Bold';
      fontOblique = 'Helvetica-Oblique';
    }

    // Dispatch to specific drawers based on template type
    if (template.type === 'split') {
      await this.drawMultilingualSplit(doc, data, template, fontRegular);
      return;
    }
    if (template.type === 'compact') {
      await this.drawCompactDigital(doc, data, template, fontRegular);
      return;
    }

    // Classic/Standard/Academic Logic

    // 1. Borders & Frame
    if (template.decorative) {
      doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2))
        .lineWidth(3)
        .stroke(colors.primary);
      doc.rect(margin + 5, margin + 5, contentWidth - 10, pageHeight - (margin * 2) - 10)
        .lineWidth(1)
        .stroke(colors.secondary);
      this.drawCornerDecorations(doc, colors, margin);
    } else {
      doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2))
        .lineWidth(4)
        .stroke(colors.primary);
    }

    // 2. Header Section
    let currentY = margin + 50;

    // Title
    doc.fillColor(colors.primary)
      .font(fontBold) // Safe Font
      .fontSize(36)
      .text(this.getTranslation(data.language, 'certificateOfCompletion'), 0, currentY, {
        align: 'center',
        width: pageWidth
      });

    currentY += 45;

    const lineWidth = 200;
    doc.moveTo(centerX - (lineWidth / 2), currentY)
      .lineTo(centerX + (lineWidth / 2), currentY)
      .lineWidth(2)
      .stroke(colors.accent);

    currentY += 35;

    // 3. Center Content Block (Expanded)

    // "This is to certify that"
    doc.fillColor(colors.text)
      .font(fontRegular)
      .fontSize(14)
      .text(this.getTranslation(data.language, 'thisIsToCertify'), 0, currentY, {
        align: 'center',
        width: pageWidth
      });

    currentY += 30;

    // Student Name (Main Focus)
    doc.fillColor(colors.primary)
      .font(fontBold)
      .fontSize(34)
      .text(data.studentName, 0, currentY, {
        align: 'center',
        width: pageWidth
      });

    currentY += 40;

    // Achievement Paragraph (Recognition) - Muted Text
    doc.fillColor(colors.text)
      .opacity(0.85) // Slight mute as requested
      .font(fontRegular)
      .fontSize(12)
      .text(this.getTranslation(data.language, 'recognitionPhrase'), margin + 40, currentY, {
        align: 'center',
        width: contentWidth - 80
      });
    doc.opacity(1); // Reset opacity

    currentY += 30;

    // "has successfully completed"
    doc.fillColor(colors.text)
      .fontSize(14)
      .text(this.getTranslation(data.language, 'hasSuccessfullyCompleted'), 0, currentY, {
        align: 'center',
        width: pageWidth
      });

    currentY += 30;

    // Course Name (ACCENT COLOR)
    doc.fillColor(colors.accent)
      .font(fontBold)
      .fontSize(28)
      .text(data.courseName, 0, currentY, {
        align: 'center',
        width: pageWidth
      });

    currentY += 40;

    // Course Duration
    let durationText = "";
    if (data.startDate && data.endDate) {
      durationText = `${this.getTranslation(data.language, 'duration')}: ${this.getTranslation(data.language, 'from')} ${new Date(data.startDate).toLocaleDateString()} ${this.getTranslation(data.language, 'to')} ${new Date(data.endDate).toLocaleDateString()}`;
    } else {
      durationText = `${this.getTranslation(data.language, 'dateOfIssue')}: ${new Date(data.issuedDate).toLocaleDateString()}`;
    }

    doc.fillColor(colors.text)
      .font(fontRegular)
      .fontSize(12)
      .text(durationText, 0, currentY, {
        align: 'center',
        width: pageWidth
      });

    currentY += 35;

    // Grade Badge (if exists)
    if (data.grade) {
      const gradeText = `${this.getTranslation(data.language, 'grade')}: ${data.grade}`;
      const gradeWidth = doc.widthOfString(gradeText);
      const badgePadding = 10;
      const badgeWidth = gradeWidth + (badgePadding * 2);
      const badgeHeight = 25;
      const badgeX = centerX - (badgeWidth / 2);

      doc.save();
      doc.roundedRect(badgeX, currentY - 5, badgeWidth, badgeHeight, 12)
        .fillOpacity(0.1)
        .fill(colors.primary);
      doc.restore();

      doc.fillColor(colors.primary)
        .font(fontBold)
        .fontSize(12)
        .text(gradeText, 0, currentY + 2, {
          align: 'center',
          width: pageWidth
        });
      currentY += 40;
    }

    // Description/Quote (Secondary, Italics)
    if (data.description) {
      doc.fontSize(10)
        .font(fontOblique)
        .fillColor(colors.secondary)
        .text(`"${data.description}"`, margin + 40, currentY, {
          width: contentWidth - 80,
          align: 'center'
        });
      currentY += 30;
    }

    // Disclaimer Line (Centered JUST ABOVE footer block)
    const disclaimerY = pageHeight - margin - 150 - 25;

    doc.fillColor(colors.text)
      .font(fontRegular)
      .fontSize(10)
      .text(`${this.getTranslation(data.language, 'authorityStatement')} ${data.instituteName} ${this.getTranslation(data.language, 'validFor')}`, margin, disclaimerY, {
        align: 'center',
        width: contentWidth
      });

    // 4. Footer Section
    const footerHeight = 150;
    const footerY = pageHeight - margin - footerHeight + 20;
    const footerBottomLimit = pageHeight - margin;

    // Layout Columns
    const footerLeftX = margin + 30;
    const qrSectionX = footerLeftX + 220; // Shift QR code right to avoid collision
    const footerRightX = pageWidth - margin - 230;
    const rightBlockWidth = 230;
    const sigCenterX = footerRightX + (rightBlockWidth / 2);

    // --- Left Block (Issuer Info) ---
    doc.fillColor(colors.text).font(fontRegular).fontSize(12);

    let leftInfoY = footerY;
    doc.text(this.getTranslation(data.language, 'issuedBy'), footerLeftX, leftInfoY);

    leftInfoY += 18;
    doc.font(fontBold).fontSize(14).fillColor(colors.primary)
      .text(data.instituteName, footerLeftX, leftInfoY, { width: 200 }); // Limit width

    leftInfoY += 25;
    doc.font(fontRegular).fontSize(12).fillColor(colors.text)
      .text(`${this.getTranslation(data.language, 'instructor')}: ${data.teacherName}`, footerLeftX, leftInfoY, { width: 200 });

    leftInfoY += 18;
    doc.fillColor(colors.secondary)
      .text(`${this.getTranslation(data.language, 'dateOfIssue')}: ${new Date(data.issuedDate).toLocaleDateString()}`, footerLeftX, leftInfoY, { width: 200 });

    // --- QR Code Section (Middle-Left) ---
    if (data.verificationUrl) {
      const qrSize = 80;
      const qrY = footerBottomLimit - qrSize - 40;

      // Rich QR Payload (Student, Course, ID, Date, Grade, URL)
      const issueDateStr = new Date(data.issuedDate).toLocaleDateString();
      const gradeStr = data.grade ? `Grade: ${data.grade}\n` : "";

      const qrPayload = `Student: ${data.studentName}\nCourse: ${data.courseName}\nCertificate ID: ${data.certificateId}\nIssue Date: ${issueDateStr}\n${gradeStr}Verify: ${data.verificationUrl}`;

      // Draw QR
      await this.drawQRCode(doc, qrPayload, qrSectionX, qrY, qrSize);

      // Only "Scan to Verify" text below QR
      doc.fontSize(8).fillColor(colors.secondary).font(fontBold)
        .text(this.getTranslation(data.language, 'scanToVerify') || "Scan to Verify", qrSectionX, qrY + qrSize + 5, { width: qrSize, align: 'center' });
    }

    // --- Right Block (Signature & Seal) ---
    let rightY = footerY;
    doc.font(fontRegular).fontSize(10).fillColor(colors.text)
      .text(`${this.getTranslation(data.language, 'certificateId')}: ${data.certificateId}`, footerRightX, rightY, { align: 'center', width: rightBlockWidth });

    const sigLineY = footerBottomLimit - 30;
    const sealY = sigLineY - 80;

    // Seal
    if (template.decorative) {
      this.drawInstituteSeal(doc, colors, sigCenterX, sealY, data.instituteName, fontBold);
    }

    const sigLineWidth = 200;
    doc.lineWidth(1).strokeColor(colors.text)
      .moveTo(sigCenterX - (sigLineWidth / 2), sigLineY)
      .lineTo(sigCenterX + (sigLineWidth / 2), sigLineY)
      .stroke();

    doc.font(fontOblique).fontSize(16).fillColor(colors.primary)
      .text(data.teacherName, footerRightX, sigLineY - 20, { align: 'center', width: rightBlockWidth });

    doc.font(fontRegular).fontSize(10).fillColor(colors.text)
      .text(this.getTranslation(data.language, 'authorizedSignature'), footerRightX, sigLineY + 8, { align: 'center', width: rightBlockWidth });
  }

  // Corner decorations
  drawCornerDecorations(doc, colors, margin) {
    const size = 30;
    try {
      doc.moveTo(margin + 20, margin + 20 + size).lineTo(margin + 20, margin + 20).lineTo(margin + 20 + size, margin + 20).lineWidth(2).stroke(colors.accent);
      doc.moveTo(doc.page.width - margin - 20 - size, margin + 20).lineTo(doc.page.width - margin - 20).lineTo(doc.page.width - margin - 20, margin + 20 + size).stroke(colors.accent);
      doc.moveTo(margin + 20, doc.page.height - margin - 20 - size).lineTo(margin + 20, doc.page.height - margin - 20).lineTo(margin + 20 + size, doc.page.height - margin - 20).stroke(colors.accent);
      doc.moveTo(doc.page.width - margin - 20 - size, doc.page.height - margin - 20).lineTo(doc.page.width - margin - 20, doc.page.height - margin - 20).lineTo(doc.page.width - margin - 20, doc.page.height - margin - 20 - size).stroke(colors.accent);
    } catch (e) {
      console.error("Decoration drawing error", e);
    }
  }

  // Draw institute seal
  drawInstituteSeal(doc, colors, x, y, instituteName, fontName = 'Helvetica-Bold') {
    const radius = 25;
    doc.circle(x, y, radius).lineWidth(2).stroke(colors.primary);
    doc.circle(x, y, radius - 5).lineWidth(1).stroke(colors.secondary);
    const abbrev = instituteName.split(' ').map(word => word[0]).join('').substring(0, 3);

    try {
      doc.fillColor(colors.primary).font(fontName).fontSize(12).text(abbrev, x - 15, y - 6, { width: 30, align: 'center' });
    } catch (e) {
      try {
        doc.font('Helvetica-Bold').text(abbrev, x - 15, y - 6, { width: 30, align: 'center' });
      } catch (e2) { }
    }
  }

  // Get language display names
  getLanguageDisplayName(lang) {
    const names = {
      english: 'English',
      hindi: 'Hindi',
      tamil: 'Tamil',
      telugu: 'Telugu',
      malayalam: 'Malayalam',
      kannada: 'Kannada',
      marathi: 'Marathi',
      gujarati: 'Gujarati',
      bengali: 'Bengali',
      punjabi: 'Punjabi',
      urdu: 'Urdu',
      assamese: 'Assamese',
      odia: 'Odia'
    };
    return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  // Get native language names
  getLanguageNativeName(lang) {
    const nativeNames = {
      english: 'English',
      hindi: 'हिन्दी',
      tamil: 'தமிழ்',
      telugu: 'తెలుగు',
      malayalam: 'മലയാളം',
      kannada: 'ಕನ್ನಡ',
      marathi: 'मराठी',
      gujarati: 'ગુજરાતી',
      bengali: 'বাংলা',
      punjabi: 'ਪੰਜਾਬੀ',
      urdu: 'اردو',
      assamese: 'অসমীয়া',
      odia: 'ଓଡ଼ିଆ'
    };
    return nativeNames[lang] || lang;
  }

  async drawMultilingualSplit(doc, data, template, fontNameOverride) {
    const { colors } = template;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 40;
    const centerX = pageWidth / 2;
    const fontRegular = fontNameOverride || 'Helvetica';

    doc.moveTo(centerX, margin + 20)
      .lineTo(centerX, pageHeight - margin - 20)
      .lineWidth(1)
      .stroke(colors.secondary);

    const leftX = margin;
    const colWidth = (pageWidth - (margin * 3)) / 2;
    let y = margin + 40;

    this.drawColumn(doc, data, 'english', leftX, y, colWidth, colors, 'Helvetica');

    const rightX = centerX + (margin / 2);
    this.drawColumn(doc, data, data.language, rightX, y, colWidth, colors, fontRegular);

    if (data.verificationUrl) {
      await this.drawQRCode(doc, data.verificationUrl, centerX - 30, pageHeight - margin - 70, 60);
    }

    doc.font('Helvetica').fontSize(10).fillColor(colors.text)
      .text(`Certificate ID: ${data.certificateId}`, 0, pageHeight - margin + 10, {
        align: 'center', width: pageWidth
      });
  }

  drawColumn(doc, data, lang, x, startY, width, colors, fontName) {
    let y = startY;

    // Explicit try catch for column text
    try {
      doc.font(fontName);
    } catch (e) {
      doc.font('Helvetica');
    }

    doc.fontSize(20).fillColor(colors.primary)
      .text(this.getTranslation(lang, 'certificateOfCompletion'), x, y, { width, align: 'center' });
    y += 40;

    doc.fontSize(12).fillColor(colors.text)
      .text(this.getTranslation(lang, 'thisIsToCertify'), x, y, { width, align: 'center' });
    y += 30;

    doc.fontSize(18).fillColor(colors.accent).text(data.studentName, x, y, { width, align: 'center' });
    y += 35;

    doc.fontSize(12).fillColor(colors.text)
      .text(this.getTranslation(lang, 'hasSuccessfullyCompleted'), x, y, { width, align: 'center' });
    y += 30;

    doc.fontSize(16).fillColor(colors.secondary).text(data.courseName, x, y, { width, align: 'center' });
    y += 40;

    if (data.grade) {
      doc.fontSize(12).fillColor(colors.text)
        .text(`${this.getTranslation(lang, 'grade')}: ${data.grade}`, x, y, { width, align: 'center' });
      y += 20;
    }

    doc.text(`${this.getTranslation(lang, 'dateOfIssue')}: ${new Date(data.issuedDate).toLocaleDateString()}`, x, y, { width, align: 'center' });
    y += 50;

    doc.fontSize(10).text(this.getTranslation(lang, 'authorizedSignature'), x, y, { width, align: 'center' });
    doc.moveTo(x + (width / 4), y + 30).lineTo(x + (width * 0.75), y + 30).stroke(colors.text);
  }

  async drawCompactDigital(doc, data, template, fontNameOverride) {
    const { colors } = template;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 40;
    const fontRegular = fontNameOverride || 'Helvetica';
    const fontBold = fontNameOverride || 'Helvetica-Bold';
    // NOTE: Compact mode doesn't share font variable fix automatically unless passed. 
    // In drawCertificate, we calculated SAFE vars.
    // So we use fontRegular for everything if it is custom.
    const isCustomFont = fontRegular !== 'Helvetica';
    const safeBold = isCustomFont ? fontRegular : fontBold;

    doc.rect(0, 0, pageWidth, 15).fill(colors.primary);
    doc.rect(0, pageHeight - 15, pageWidth, 15).fill(colors.primary);

    let y = margin + 20;

    doc.font(safeBold).fontSize(24).fillColor(colors.primary)
      .text(data.instituteName.toUpperCase(), margin, y, { align: 'center' });
    y += 50;

    const qrSize = 100;
    const qrX = (pageWidth - qrSize) / 2;

    if (data.verificationUrl) {
      await this.drawQRCode(doc, data.verificationUrl, qrX, y, qrSize);
    } else {
      doc.rect(qrX, y, qrSize, qrSize).stroke(colors.secondary);
      doc.font(fontRegular).fontSize(10).fillColor(colors.text)
        .text("QR VERIFICATION", qrX, y + 40, { width: qrSize, align: 'center' });
    }

    y += qrSize + 10;
    doc.font(fontRegular).fontSize(10).fillColor(colors.text)
      .text("Scan to Verify", qrX, y, { width: qrSize, align: 'center' });

    y += 30;

    doc.font(safeBold).fontSize(20).fillColor(colors.text)
      .text('CERTIFICATE OF ACHIEVEMENT', margin, y, { align: 'center' });
    y += 40;

    doc.font(fontRegular).fontSize(12).text('Presented to', margin, y, { align: 'center' });
    y += 20;

    doc.font(safeBold).fontSize(26).fillColor(colors.accent)
      .text(data.studentName, margin, y, { align: 'center' });
    y += 40;

    doc.font(fontRegular).fontSize(12).fillColor(colors.text)
      .text(`For successfully completing`, margin, y, { align: 'center' });
    y += 20;

    doc.font(safeBold).fontSize(18).fillColor(colors.secondary)
      .text(data.courseName, margin, y, { align: 'center' });
    y += 40;

    if (data.grade) {
      doc.font(fontRegular).fontSize(14).text(`Grade: ${data.grade}`, margin, y, { align: 'center' });
      y += 30;
    }

    y = pageHeight - margin - 80;
    const sigY = y;
    doc.moveTo(margin, sigY).lineTo(margin + 100, sigY).stroke(colors.text);
    doc.font(fontRegular).fontSize(10).text("Instructor Signature", margin, sigY + 5);

    doc.moveTo(pageWidth - margin - 100, sigY).lineTo(pageWidth - margin, sigY).stroke(colors.text);
    doc.text("Director Signature", pageWidth - margin - 100, sigY + 5, { align: 'right', width: 100 });

    doc.fontSize(8).fillColor(colors.secondary)
      .text(`ID: ${data.certificateId}`, margin, pageHeight - margin - 10, { align: 'center' });
  }

}

module.exports = CertificateTemplateEngine;