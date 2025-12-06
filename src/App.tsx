import { useState, useEffect } from 'react';

// --- 內建圖示組件 (使用最寬鬆的型別定義) ---
const IconBase = (props: any) => {
  const { children, className, ...other } = props;
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className} 
      {...other}
    >
      {children}
    </svg>
  );
};

const Calendar = (props: any) => (
  <IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconBase>
);
const Clock = (props: any) => (
  <IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>
);
const MapPin = (props: any) => (
  <IconBase {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></IconBase>
);
const Heart = (props: any) => (
  <IconBase {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></IconBase>
);
const Upload = (props: any) => (
  <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></IconBase>
);
const Sparkles = (props: any) => (
  <IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M3 5h4" /></IconBase>
);
const Bot = (props: any) => (
  <IconBase {...props}><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></IconBase>
);
const Send = (props: any) => (
  <IconBase {...props}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></IconBase>
);
const Moon = (props: any) => (
  <IconBase {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></IconBase>
);
const Star = (props: any) => (
  <IconBase {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></IconBase>
);

export default function App() {
  const [photoLeft, setPhotoLeft] = useState<string | null>('/groom.jpg');
  const [photoRight, setPhotoRight] = useState<string | null>('/bride.jpg');
  const [daysLeft, setDaysLeft] = useState(0);
  
  const [guestName, setGuestName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [blessingResult, setBlessingResult] = useState('');
  const [isGeneratingBlessing, setIsGeneratingBlessing] = useState(false);

  const [conciergeQuery, setConciergeQuery] = useState('');
  const [conciergeResponse, setConciergeResponse] = useState('');
  const [isAskingConcierge, setIsAskingConcierge] = useState(false);

  useEffect(() => {
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.body.appendChild(script);
    }

    const weddingDate = new Date('2026-02-08T12:00:00');
    const today = new Date();
    // 使用 getTime() 確保運算是數字減法，避免 TS 報錯
    const difference = weddingDate.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    setDaysLeft(days > 0 ? days : 0);
  }, []);

  const handlePhotoUpload = (event: any, setPhotoFunc: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoFunc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const callGemini = async (prompt: string) => {
    const apiKey = "iAIzaSyDoVtLSlI0oRlJC632PNILpD73I9WAT-EI"; 
    try {
      const cleanKey = apiKey.replace(/^i/, '');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，星空訊號微弱，請稍後再試。";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "連線錯誤，請檢查網路或稍後再試。";
    }
  };

  const handleGenerateBlessing = async () => {
    if (!guestName) {
      setBlessingResult("請先輸入您的大名喔！");
      return;
    }
    setIsGeneratingBlessing(true);
    setBlessingResult("");
    
    const prompt = `
      你是一位擅長寫作的婚禮祝福生成器。
      請為新郎「李展良」和新娘「陳玟潔」寫一段簡短、溫暖且富有詩意的婚禮祝福（繁體中文）。
      發送祝福的人是「${guestName}」，與新人的關係是「${relationship || '朋友'}」。
      
      要求：
      1. 主題回歸「星空」，請使用「銀河」、「恆星」、「閃耀」、「宇宙」等詞彙。
      2. 字數在 60 字以內。
      3. 語氣浪漫、深情。
    `;

    const result = await callGemini(prompt);
    setBlessingResult(result);
    setIsGeneratingBlessing(false);
  };

  const handleAskConcierge = async () => {
    if (!conciergeQuery) return;
    setIsAskingConcierge(true);
    
    const prompt = `
      你是一個婚禮小管家 AI，正在為「李展良」和「陳玟潔」的星空主題婚禮服務。
      
      婚禮資訊：
      - 時間：2026年2月8日 (民國115年) 中午 12:00 入席
      - 地點：高雄麗尊酒店 6樓 維也納廳
      
      使用者問：${conciergeQuery}
      
      請用繁體中文、優雅且星空般的語氣回答。回答請簡短（50字以內）。
    `;

    const result = await callGemini(prompt);
    setConciergeResponse(result);
    setIsAskingConcierge(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-start py-10 px-4 font-sans overflow-y-auto relative selection:bg-indigo-500 selection:text-white">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black opacity-90"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-100 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
              boxShadow: '0 0 6px 1px rgba(165, 180, 252, 0.4)'
            }}
          />
        ))}
        <div className="absolute top-10 right-20 w-32 h-0.5 bg-gradient-to-l from-transparent via-indigo-200 to-transparent opacity-0 rotate-[-45deg] animate-[shooting-star_5s_infinite]"></div>
      </div>

      <style>{`
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; }
          100% { transform: translateX(-500px) translateY(500px) rotate(-45deg); opacity: 0; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&family=Cinzel:wght@400;700&display=swap');
      `}</style>

      <div className="relative z-10 w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col my-4 border border-indigo-500/30 rounded-lg shrink-0">
        
        <div className="relative bg-slate-900 overflow-hidden group text-center">
          
          <div className="pt-6 pb-4 relative z-10">
            <h2 className="text-indigo-200 tracking-[0.3em] text-xs mb-1 font-serif uppercase">The Wedding Of</h2>
            <div className="flex justify-center items-center gap-3 text-white font-[Cinzel] text-2xl drop-shadow-lg">
              <span className="font-bold">展良</span>
              <div className="relative">
                <Heart className="w-5 h-5 text-indigo-400 fill-current animate-pulse" />
                <Sparkles className="w-6 h-6 text-yellow-200 absolute -top-3 -right-3 animate-spin-slow" style={{animationDuration: '4s'}}/>
              </div>
              <span className="font-bold">玟潔</span>
            </div>
          </div>

          <div className="flex w-full h-[280px] relative px-2 gap-2">
            
            <div className="flex-1 relative rounded-tl-3xl rounded-br-3xl overflow-hidden border border-indigo-400/30 group-hover:border-indigo-300 transition-colors">
              {photoLeft ? (
                <img 
                  src={photoLeft} 
                  alt="Groom" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    setPhotoLeft(null);
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-900 flex flex-col items-center justify-center text-indigo-200/70">
                   <Moon className="w-6 h-6 mb-2 opacity-50" />
                   <p className="text-xs tracking-widest">上傳左側照片</p>
                </div>
              )}
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                <Upload className="w-6 h-6 text-white drop-shadow-md" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, setPhotoLeft)} />
              </label>
            </div>

            <div className="w-px bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-50 flex flex-col items-center justify-center gap-8"></div>

            <div className="flex-1 relative rounded-tr-3xl rounded-bl-3xl overflow-hidden border border-indigo-400/30 group-hover:border-indigo-300 transition-colors">
              {photoRight ? (
                <img 
                  src={photoRight} 
                  alt="Bride" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    setPhotoRight(null);
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-800 flex flex-col items-center justify-center text-indigo-200/70">
                   <Star className="w-6 h-6 mb-2 opacity-50" />
                   <p className="text-xs tracking-widest">上傳右側照片</p>
                </div>
              )}
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                <Upload className="w-6 h-6 text-white drop-shadow-md" />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, setPhotoRight)} />
              </label>
            </div>
            
          </div>

          <div className="py-3 flex justify-center items-center gap-2 opacity-60">
             <Star className="w-3 h-3 text-yellow-200" />
             <p className="text-indigo-200 text-[10px] font-[Cinzel] tracking-[0.4em]">SAVE THE DATE</p>
             <Star className="w-3 h-3 text-yellow-200" />
          </div>
        </div>

        <div className="relative bg-[#f8f9fa] p-8 md:p-10 text-center border-t border-indigo-100"
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
          
          <div className="flex justify-center mb-6">
            <Moon className="w-6 h-6 text-indigo-900/40 fill-current" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-6 font-serif tracking-widest">誠摯邀請</h1>
          <p className="text-slate-600 text-sm leading-loose mb-8 font-serif px-4">
            在浩瀚的星河之中<br/>
            我們找到了彼此的光芒<br/>
            誠摯地邀請您參與這場星光盛宴<br/>
            見證我們的永恆承諾
          </p>

          <div className="space-y-6">
            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2 text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">2026 . 02 . 08</h3>
              <p className="text-slate-500 text-sm">中華民國 115 年 2 月 8 日 (日)</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2 text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">中午 12:00 入席</h3>
              <p className="text-slate-500 text-sm">準時開席 • 敬備喜酌</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2 text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">麗尊酒店</h3>
              <p className="text-slate-500 text-sm font-medium">6樓 維也納廳</p>
            </div>
          </div>

          <div className="my-8 flex items-center justify-center opacity-30">
            <div className="h-px w-16 bg-slate-400"></div>
            <Heart className="mx-4 w-4 h-4 text-indigo-400 fill-current" />
            <div className="h-px w-16 bg-slate-400"></div>
          </div>

          <div className="flex justify-center items-center gap-8 text-xl text-slate-800 font-serif font-bold mb-8">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 mb-1 font-sans font-normal">新郎</span>
              李展良
            </div>
            <span className="text-2xl text-yellow-600 font-[Cinzel]">&</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-500 mb-1 font-sans font-normal">新娘</span>
              陳玟潔
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-indigo-100">
            
            <div className="bg-indigo-50/50 rounded-lg p-6 mb-6 text-left border border-indigo-100">
               <div className="flex items-center gap-2 mb-4 text-indigo-900">
                 <Sparkles className="w-5 h-5 text-yellow-500" />
                 <h3 className="font-bold">AI 星空祝福生成器 ✨</h3>
               </div>
               
               <div className="space-y-3">
                 <input 
                   type="text" 
                   placeholder="您的名字" 
                   value={guestName}
                   onChange={(e) => setGuestName(e.target.value)}
                   className="w-full p-2 text-sm border border-indigo-200 rounded focus:outline-none focus:border-indigo-400 bg-white placeholder-indigo-300"
                 />
                 <input 
                   type="text" 
                   placeholder="與新人的關係 (例: 大學同學)" 
                   value={relationship}
                   onChange={(e) => setRelationship(e.target.value)}
                   className="w-full p-2 text-sm border border-indigo-200 rounded focus:outline-none focus:border-indigo-400 bg-white placeholder-indigo-300"
                 />
                 <button 
                   onClick={handleGenerateBlessing}
                   disabled={isGeneratingBlessing}
                   className="w-full bg-indigo-900 hover:bg-indigo-800 text-white py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isGeneratingBlessing ? '捕捉星光中...' : '生成專屬祝福 🌠'}
                 </button>
               </div>

               {blessingResult && (
                 <div className="mt-4 p-4 bg-white rounded border border-indigo-100 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1 opacity-10 text-indigo-900">
                     <Moon className="w-12 h-12 fill-current" />
                   </div>
                   <p className="text-indigo-900 text-sm leading-relaxed font-serif italic">
                     "{blessingResult}"
                   </p>
                 </div>
               )}
            </div>

            <div className="bg-slate-50 rounded-lg p-6 text-left border border-slate-200">
               <div className="flex items-center gap-2 mb-4 text-slate-700">
                 <Bot className="w-5 h-5 text-slate-500" />
                 <h3 className="font-bold">婚禮小管家 🤖</h3>
               </div>
               
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="詢問婚禮相關問題 (如: 停車資訊)" 
                   value={conciergeQuery}
                   onChange={(e) => setConciergeQuery(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAskConcierge()}
                   className="flex-1 p-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-slate-400 bg-white"
                 />
                 <button 
                   onClick={handleAskConcierge}
                   disabled={isAskingConcierge}
                   className="bg-slate-700 hover:bg-slate-800 text-white p-2 rounded transition-colors disabled:opacity-50"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>

               {conciergeResponse && (
                 <div className="mt-3 p-3 bg-white rounded border border-slate-200 text-sm text-slate-600">
                   {conciergeResponse}
                 </div>
               )}
            </div>

          </div>

          <div className="mt-10 mb-4">
             <span className="px-4 py-1.5 bg-indigo-900 text-yellow-100 text-xs rounded-full tracking-wider shadow-sm border border-indigo-700">
               ✨ 距離婚禮還有 {daysLeft} 天 ✨
             </span>
          </div>

        </div>
        
        <div className="h-2 bg-gradient-to-r from-indigo-900 via-purple-600 to-indigo-900"></div>
      </div>
      
      <div className="fixed bottom-4 text-white/50 text-xs text-center w-full pointer-events-none">
        Powered by Gemini • Starry Night Wedding
      </div>
    </div>
  );
}