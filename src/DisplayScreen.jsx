import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

const DisplayScreen = () => {
  const [isStarted, setIsStarted] = useState(false);
  
  // ضع روابط الفيديوهات المباشرة من Supabase هنا بالترتيب
  const adUrls = [
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/1.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MTcwLCJleHAiOjE4MjA5NDQxNzB9.VViaoH929DlwBZYLmHowJNrc8Sl4J8lNEDChlxZqn-ynQLGJXVPJKQxPEx_nnL2urvJgG_6nGZddNh2B4DwMsw",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/2.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMi5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MjQwLCJleHAiOjE4MjA5NDQyNDB9.tRYzLlltPuvumf2vFMLuQuaNxanW48gQgczlDnjo67hefaKGq-4GSEeUm3y1evxV7ul9VTLsNDiAaiyeClXcpA",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/3.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvMy5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MjkwLCJleHAiOjE4MjA5NDQyOTB9.gHczMG5DW2Tb-X5ht2j3TrrfpvqNC-iCOeQQLUe_KlDRZRkTTh0EmefpO_cqAGWpBZFIM0uXLRwwsvjvS4snlA",
    "https://dygmodlzwgqdblzbvirk.supabase.co/storage/v1/object/sign/ads/4.mp4?token=eyJraWQiOiJiYThiMjg4YS1lOTBlLTRkNjYtYjcyNy01NDcxMGRkNzg5N2YiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJhZHMvNC5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg5NDA4MzEwLCJleHAiOjE4MjA5NDQzMTB9.PilIYRw3M0ia1ILVVQPVUdJsuIqJMAXjrDUy_tjEnxayPvFuV7w9qr79E3d9FLAreS9A3h0Jeubw6-b2P0vU7g",

    // يمكنك إضافة أو حذف أي عدد من الروابط هنا
  ];
  
  const [currentAdIndex, setCurrentAdIndex] = useState(0); // يبدأ من أول رابط في المصفوفة (رقم 0)
  
  const [calledTicket, setCalledTicket] = useState(null);
  const [counters, setCounters] = useState({ 1: '-', 2: '-', 3: '-' });
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    // الانتقال للفيديو التالي، والعودة للأول عند انتهاء القائمة
    setCurrentAdIndex((prev) => (prev + 1) % adUrls.length);
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
          `رقم ${ticketInfo.ticket_number}، ${ticketInfo.name}، تفضل إلى الموظف رقم ${ticketInfo.counter_number}`
        );
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9; 
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
      
      {/* مشغل الإعلانات السحابية */}
      <video 
        ref={videoRef}
        src={adUrls[currentAdIndex]} 
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
              الرجاء التوجه إلى الموظف ({calledTicket.counter_number})
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
            <span className="text-gray-400">موظف {num}:</span>
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