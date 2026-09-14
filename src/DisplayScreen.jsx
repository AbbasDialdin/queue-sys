import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

const DisplayScreen = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(1);
  const totalAds = 17; // يمكنك تغيير هذا الرقم حسب عدد الفيديوهات الفعلي
  
  const [calledTicket, setCalledTicket] = useState(null);
  const [counters, setCounters] = useState({ 1: '-', 2: '-', 3: '-' });
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    setCurrentAdIndex((prev) => (prev % totalAds) + 1);
  };

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

        // نطق الصوت
        const utterance = new SpeechSynthesisUtterance(
          `رقم ${ticketInfo.ticket_number}، ${ticketInfo.name}، تفضل إلى شباك رقم ${ticketInfo.counter_number}`
        );
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9; // تبطئ الصوت قليلاً ليكون أوضح
        window.speechSynthesis.speak(utterance);

        // إخفاء الإشعار بعد 8 ثوانٍ
        setTimeout(() => {
          setCalledTicket(null);
        }, 8000);

      }).subscribe();

    return () => supabase.removeChannel(channel);
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
      
      {/* مشغل الإعلانات */}
      <video 
        ref={videoRef}
        src={`/ads/${currentAdIndex}.mp4`} 
        autoPlay 
        muted 
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* التراكب الزجاجي عند النداء */}
      {calledTicket && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-lg transition-all duration-500">
          <div className="bg-white/10 border border-white/20 p-20 rounded-[3rem] shadow-2xl text-center transform scale-110">
            <h2 className="text-5xl font-light text-gray-200 mb-6 tracking-wide">
              الرجاء التوجه إلى شباك ({calledTicket.counter_number})
            </h2>
            <h1 className="text-[12rem] font-bold text-white mb-8 leading-none drop-shadow-xl animate-pulse">
              {calledTicket.ticket_number}
            </h1>
            <p className="text-7xl font-medium text-gray-100">{calledTicket.name}</p>
          </div>
        </div>
      )}

      {/* الشريط السفلي (Ticker) */}
      <div className="absolute bottom-0 z-20 w-full h-28 bg-black/60 backdrop-blur-md border-t border-white/10 flex justify-around items-center px-10 shadow-2xl">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center gap-6 text-4xl font-medium">
            <span className="text-gray-400">شباك {num}:</span>
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