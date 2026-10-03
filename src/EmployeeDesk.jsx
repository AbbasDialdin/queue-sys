import { useState } from 'react';

const EmployeeDesk = () => {
  const [serviceType, setServiceType] = useState('issuance'); // 'issuance' أو 'recharge'
  const [counterNumber, setCounterNumber] = useState('1');
  const [currentTicket, setCurrentTicket] = useState('-');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const callNext = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('https://queue.corva-iq.com/api/call.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          counter_number: serviceType === 'issuance' ? counterNumber : null // التعبئة ليس لها شباك
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setCurrentTicket(data.ticket_number);
        setMessage('تم استدعاء الزائر بنجاح');
      } else {
        setMessage(data.message); // "لا يوجد زبائن"
      }
    } catch (error) {
      setMessage('خطأ في الاتصال بالسيرفر');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-8">لوحة تحكم الموظف</h1>
        
        <div className="mb-6 text-right">
          <label className="block text-gray-700 font-bold mb-2">نوع الخدمة:</label>
          <select 
            className="w-full p-3 border rounded-lg"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="issuance">إصدار (يظهر على الشاشة)</option>
            <option value="recharge">تعبئة (نافذة خاصة)</option>
          </select>
        </div>

        {serviceType === 'issuance' && (
          <div className="mb-6 text-right">
            <label className="block text-gray-700 font-bold mb-2">رقم الشباك:</label>
            <select 
              className="w-full p-3 border rounded-lg"
              value={counterNumber}
              onChange={(e) => setCounterNumber(e.target.value)}
            >
              <option value="1">شباك 1</option>
              <option value="2">شباك 2</option>
              <option value="3">شباك 3</option>
            </select>
          </div>
        )}

        <div className="my-8 py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <h2 className="text-gray-500 mb-2">الرقم الحالي</h2>
          <div className="text-7xl font-black text-blue-600">{currentTicket}</div>
        </div>

        <button 
          onClick={callNext}
          disabled={loading}
          className={`w-full py-4 text-2xl font-bold text-white rounded-xl transition-all ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 active:scale-95'}`}
        >
          {loading ? 'جاري الاستدعاء...' : 'الزائر التالي'}
        </button>

        {message && <p className="mt-4 text-lg font-medium text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default EmployeeDesk;