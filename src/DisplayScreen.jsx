
  import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

const DisplayScreen = () => {
  const [isStarted, setIsStarted] = useState(false);
  
  // ضع هنا الروابط الـ 17 كاملة مع الشفرات (Tokens) كما تنسخها من Supabase
  const adUrls = [
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/1.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MTcwLCJleHAiOjE4MjA5NDQxNzB9.VViaoH929DlwBZYLmHowJNrc8Sl4J8lNEDChlxZqn-ynQLGJXVPJKQxPEx_nnL2urvJgG_6nGZddNh2B4DwMsw",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/2.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMi5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MjQwLCJleHAiOjE4MjA5NDQyNDB9.tRYzLlltPuvumf2vFMLuQuaNxanW48gQgczlDnjo67hefaKGq-4GSEeUm3y1evxV7ul9VTLsNDiAaiyeClXcpA",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/3.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMy5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MjkwLCJleHAiOjE4MjA5NDQyOTB9.gHczMG5DW2Tb-X5ht2j3TrrfpvqNC-iCOeQQLUe_KlDRZRkTTh0EmefpO_cqAGWpBZFIM0uXLRwwsvjvS4snlA",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/4.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvNC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MzEwLCJleHAiOjE4MjA5NDQzMTB9.PilIYRw3M0ia1ILVVQPVUdJsuIqJMAXjrDUy_tjEnxayPvFuV7w9qr79E3d9FLAreS9A3h0Jeubw6-b2P0vU7g",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/5.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvNS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDcxMjAwLCJleHAiOjE4MjEwMDcyMDB9.obxfJkixSJOL7wmcLUhfVvAvjXYrQJ-aqBGRV3QkKQp8sPCESUsjil3-cb0XFYAnr_miHjN7V-vHfZ7gQC7eZQ",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/6.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvNi5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDcxMjI1LCJleHAiOjE4MjEwMDcyMjV9.hvzfjUHLXeNQKUvKf8VAEqyx7OsBrO686YqQwkNN26JIzyDUJjeg9NflC5p86nmF4bVEqtNPnPDmPj0sLjwrHw",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/7.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvNy5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDcxMjQwLCJleHAiOjE4MjEwMDcyNDB9.sacNszjL22rtT3JnM1KusHvVU_WySXaW5gsZlFJEMckWMN1-fRrVgQlPJv4j7uD2jSgu90J3mDaVDoJgrjpv2g",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/8.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvOC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDcxMjU0LCJleHAiOjE4MjEwMDcyNTR9.OooNvRLDn-vv-sA8O2xsBSTVIp9xS4atVY8Z1iJMtMAPNOd5GMp1pOJQuGgWOzMXLyY3j86Jpi2MwJREx5afCg",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/9.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvOS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDcxMjY5LCJleHAiOjE4MjEwMDcyNjl9.iXHaGs_lyozglHPHqaynruLB90_BfKycdtiHy8CAweciMCsZ7YeC8T_jLujdNf3QSultmSpUlRAW9hb0NK7odA",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/10.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTAubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTI4NiwiZXhwIjoxODIxMDA3Mjg2fQ.fv2Vmsg-K6q65ViNPKoCyK5bnz_qEUGSYM74eieSQWUxiXwGBKjoKW8zzMgJKnkrwk-VCFHRWVzAjWxkNyKd3A",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/11.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTEubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTMwMSwiZXhwIjoxODIxMDA3MzAxfQ.kyoYtrd-wLO-PomfgK4HVb81fTQ_4kCO28kI_t9pqnGqpaDTsl1Ca7-5yLRhFltuYIJVbskbZFIH4fSRbRCb6Q",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/12.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTIubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTMwOSwiZXhwIjoxODIxMDA3MzA5fQ.I4RviNDNM3u6hXbVybldfv12wbtV1Qle8yJ9kMSE9jwpb0FxphfDv2lfrCcpm_vCPQ_HjZ6Fb8LKkRXni0Mg7Q",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/13.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTMubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTMyNSwiZXhwIjoxODIxMDA3MzI1fQ.XjCYyXSaBNiRW2qL1QUBTj3Nj9XfsRSYPMXXNKWAXZU8uwj2BIGXLThXJLM3NQ3un-TfPDFhdM34_6s7WYFTzA",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/14.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTQubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTMzNiwiZXhwIjoxODIxMDA3MzM2fQ.2yd8mVC7pPrYkSyjXup_7laES9bbdZvoGy327KLgKbEHsYV3Xst8g85E0S2zbbx7HvbAcCbWaUieWxjp2_vMqQ",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/15.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTUubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTM0NywiZXhwIjoxODIxMDA3MzQ3fQ.uZjw_BpoZAKCZ_tWLCwlcdLf6fE76f_7pFiAlHvxWEBYsNtv38vflpiaoHIJRm02srOLrfj7ce5xoZTgqY7AGw",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/16.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTYubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTM1NywiZXhwIjoxODIxMDA3MzU3fQ.fofrRvlLdV4YxX8cg2o0g_KmPQmcQogOezB2Vh43D8KG5mtbn6aib02bOVYlim-ehY49VTcnh3SISjiS6UE-Vg",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/17.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMTcubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4OTQ3MTM3MywiZXhwIjoxODIxMDA3MzczfQ.vg0PW7TFyn12_WT6jsAHXt3bWsWfNvtgelDodpF33iQtL-u8Z-6gbnfvofA_8ZIJK_-4r_TCbv1F9zDTWkXdHA",

  ];
  
  
  const [calledTicket, setCalledTicket] = useState(null);
  const [counters, setCounters] = useState({ 1: '-', 2: '-', 3: '-' });
  
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const timeoutRef = useRef(null);

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
      v2.src = adUrls[0]; // في حال كان هناك فيديو واحد فقط
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

  // منع الشاشة من النوم
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

  // الاتصال بقاعدة البيانات
  useEffect(() => {
    if (!isStarted) return;

    const channel = supabase
      .channel('public:tickets')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tickets', 
        filter: 'status=eq.called' 
      }, (payload) => {
        
        const ticketInfo = payload.new;

        setCounters(prev => ({
          ...prev,
          [ticketInfo.counter_number]: ticketInfo.ticket_number
        }));

        setCalledTicket(ticketInfo);

        const alertSound = new Audio('/alert.mp3');
        alertSound.play().catch(e => console.log("Sound error:", e));

        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(`رقم ${ticketInfo.ticket_number}`);
          utterance.lang = 'ar-SA';
          utterance.rate = 0.8; 
          window.speechSynthesis.speak(utterance);
        }, 500);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCalledTicket(null);
        }, 10000);

      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isStarted]);

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
  // ضع جميع روابط الفيديوهات هنا
  