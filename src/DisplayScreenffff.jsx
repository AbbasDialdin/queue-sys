import { useState, useEffect, useRef } from 'react';

const DisplayScreen = () => {
  const [isStarted, setIsStarted] = useState(false);
  
  // 1. مسار الفيديوهات من هوستنكر وتوليد الـ 17 رابط تلقائياً
  const baseUrl = "https://corva-iq.com/ads"; 
  const adUrls = Array.from({ length: 17 }, (_, i) => `${baseUrl}/${i + 1}.mp4`);
  
  const [calledTicket, setCalledTicket] = useState(null);
  const [counters, setCounters] = useState({ 1: '-', 2: '-', 3: '-' });
  
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const timeoutRef = useRef(null);
  
  // مرجع لتخزين آخر تذكرة تم نداؤها لمنع تكرار الصوت
  const lastCalledIdRef = useRef(null);

  // 2. نظام الفيديوهات المزدوج (Ping-Pong Buffer)
  useEffect(() => {
    if (!isStarted) return;
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2 || adUrls.length === 0) return;

    let activePlayer = 1;
    let currentIdx = 0;

    // الإعداد الأولي
    v1.src = adUrls[0];
    if (adUrls.length > 1) {
      v2.src = adUrls[1];
    } else {
      v2.src = adUrls[0]; 
    }

    v1.style.opacity = 1; v1.style.zIndex = 0;
    v2.style.opacity = 0; v2.style.zIndex = -10;

    v1.play().catch(e => console.log("خطأ في التشغيل المبدئي:", e));

    const handleVideoEnd = () => {
      if (activePlayer === 1) {
        activePlayer = 2;
        v1.style.opacity = 0; v1.style.zIndex = -10;
        v2.style.opacity = 1; v2.style.zIndex = 0;
        v2.play().catch(e => console.log("v2 play error:", e));

        currentIdx = (currentIdx + 1) % adUrls.length;
        const nextNextIdx = (currentIdx + 1) % adUrls.length;
        v1.src = adUrls[nextNextIdx];
        v1.load();
      } else {
        activePlayer = 1;
        v2.style.opacity = 0; v2.style.zIndex = -10;
        v1.style.opacity = 1; v1.style.zIndex = 0;
        v1.play().catch(e => console.log("v1 play error:", e));

        currentIdx = (currentIdx + 1) % adUrls.length;
        const nextNextIdx = (currentIdx + 1) % adUrls.length;
        v2.src = adUrls[nextNextIdx];
        v2.load();
      }
    };

    const handleError = () => {
      console.log("حدث خطأ في تحميل فيديو، سيتم تخطيه.");
      handleVideoEnd();
    };

    v1.addEventListener('ended', handleVideoEnd);
    v2.addEventListener('ended', handleVideoEnd);
    v1.addEventListener('error', handleError);
    v2.addEventListener('error', handleError);

    return () => {
      v1.removeEventListener('ended', handleVideoEnd);
      v2.removeEventListener('ended', handleVideoEnd);
      v1.removeEventListener('error', handleError);
      v2.removeEventListener('error', handleError);
    };
  }, [isStarted]); 

  // 3. منع الشاشة من النوم
  useEffect(() => {
    const keepScreenAwake = async () => {
      try {
        if ('wakeLock' in navigator) {
          await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock Error:', err);
      }
    };
    if (isStarted) keepScreenAwake();
  }, [isStarted]);

  // 4. الاتصال اللحظي بـ API هوستنكر الخاص بك (Polling)
  useEffect(() => {
    if (!isStarted) return;

    const fetchScreenData = async () => {
      try {
        const response = await fetch('https://queue.corva-iq.com/api/screen.php');
        const data = await response.json();

        // تحديث أرقام الشبابيك في الشريط السفلي
        if (data.counters) {
          setCounters(data.counters);
        }

        // التحقق من وجود نداء جديد للإصدار
        if (data.recent_call && data.recent_call.id !== lastCalledIdRef.current) {
          lastCalledIdRef.current = data.recent_call.id;
          const ticketInfo = data.recent_call;

          setCalledTicket(ticketInfo);

          // تشغيل صوت الجرس
          const alertSound = new Audio('/alert.mp3');
          alertSound.play().catch(e => console.log("Sound error:", e));

          // نطق الرقم
          setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(`رقم ${ticketInfo.ticket_number}`);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8; 
            window.speechSynthesis.speak(utterance);
          }, 500);

          // إخفاء الشاشة الزجاجية بعد 10 ثواني
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setCalledTicket(null);
          }, 10000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // الشاشة تسأل السيرفر كل ثانية ونصف
    const interval = setInterval(fetchScreenData, 1500);
    return () => clearInterval(interval);
  }, [isStarted]);

  // شاشة البدء
  if (!isStarted) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <button 
          onClick={() => setIsStarted(true)} 
          className="px-10 py-5 bg-white text-black text-2xl rounded-2xl font-semibold hover:scale-105 transition-transform"
        >
          انقر هنا لتشغيل الشاشة وتفعيل الصوت
        </button>
      </div>
    );
  }

  // واجهة العرض الرئيسية
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans" dir="rtl">
      
      <video 
        ref={video1Ref}
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      <video 
        ref={video2Ref}
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* التراكب الزجاجي عند النداء */}
      {calledTicket && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-lg transition-all duration-500">
          <div className="bg-white/10 border border-white/20 p-20 rounded-[3rem] shadow-2xl text-center transform scale-110">
            <h2 className="text-5xl font-light text-gray-200 mb-6 tracking-wide">
              الرجاء التوجه إلى الموظف ({calledTicket.counter_number})
            </h2>
            <h1 className="text-[12rem] font-bold text-white mb-8 leading-none drop-shadow-xl animate-pulse">
              {calledTicket.ticket_number}
            </h1>
          </div>
        </div>
      )}

      {/* الشريط السفلي للشبابيك */}
      <div className="absolute bottom-0 z-30 w-full h-28 bg-black/60 backdrop-blur-md border-t border-white/10 flex justify-around items-center px-10 shadow-2xl">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center gap-6 text-4xl font-medium">
            <span className="text-gray-400">الموظف {num}:</span>
            <span className={`px-8 py-3 rounded-2xl transition-colors ${counters[num] !== '-' ? 'bg-white text-black font-bold' : 'bg-white/10 text-gray-500'}`}>
              {counters[num]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayScreen;