import { useState } from 'react';

const Kiosk = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ticketInfo, setTicketInfo] = useState(null);

  const generateTicket = async (type) => {
    setLoading(true);
    setMessage('');
    setTicketInfo(null);
    
    try {
      // الاتصال بالـ API الجديد على هوستنكر
      const response = await fetch('https://queue.corva-iq.com/api/generate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_type: type })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setTicketInfo({
          number: data.ticket_number,
          type: data.service_type === 'issuance' ? 'إصدار' : 'تعبئة'
        });
        // هذا الكود كبديل مؤقت لحين بناء تطبيق POS
      } else {
        setMessage('حدث خطأ أثناء سحب التذكرة');
      }
    } catch (error) {
      setMessage('خطأ في الاتصال بالسيرفر');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 font-sans" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-4xl font-black text-gray-800 mb-2">أهلاً بك</h1>
        <p className="text-gray-500 mb-10 text-lg">الرجاء اختيار نوع الخدمة المطلوبة</p>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => generateTicket('issuance')}
            disabled={loading}
            className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 active:scale-95 text-white p-8 rounded-2xl transition-all shadow-lg"
          >
            <span className="text-3xl font-bold mb-2">إصدار</span>
            <span className="text-sm opacity-80">سحب تذكرة جديدة</span>
          </button>

          <button 
            onClick={() => generateTicket('recharge')}
            disabled={loading}
            className="flex flex-col items-center justify-center bg-green-500 hover:bg-green-600 active:scale-95 text-white p-8 rounded-2xl transition-all shadow-lg"
          >
            <span className="text-3xl font-bold mb-2">تعبئة</span>
            <span className="text-sm opacity-80">تعبئة رصيد</span>
          </button>
        </div>

        {loading && <p className="text-gray-500 font-medium animate-pulse">جاري تسجيل الرقم...</p>}
        {message && <p className="text-red-500 font-medium">{message}</p>}

        {ticketInfo && (
          <div className="mt-8 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl">
            <h3 className="text-gray-500 text-lg mb-2">رقمك هو ({ticketInfo.type})</h3>
            <div className="text-7xl font-black text-gray-800">{ticketInfo.number}</div>
            <p className="text-sm text-gray-400 mt-4">يرجى الانتظار حتى يتم النداء على رقمك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kiosk;