import { useState } from 'react';
import { supabase } from './supabaseClient';

const Kiosk = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignedNumber, setAssignedNumber] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    
    const { data, error } = await supabase.rpc('add_new_ticket', {
      customer_name: name
    });

    if (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
    } else {
      setAssignedNumber(data); 
      setName('');
      
      // إخفاء الرقم بعد 6 ثوانٍ لاستقبال زبون جديد
      setTimeout(() => {
        setAssignedNumber(null);
      }, 6000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-full max-w-md text-center border border-gray-100">
        <h1 className="text-3xl font-medium text-gray-800 mb-2">أهلاً بك</h1>
        <p className="text-gray-500 mb-8">يرجى إدخال اسمك لحجز دورك</p>

        {!assignedNumber ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full px-6 py-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-black transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium text-xl py-4 rounded-2xl transition-colors disabled:bg-gray-300"
            >
              {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
            </button>
          </form>
        ) : (
          <div className="animate-fade-in">
            <p className="text-xl text-gray-600 mb-4">تم تسجيل اسمك بنجاح، رقمك هو:</p>
            <div className="text-8xl font-bold text-black mb-6">{assignedNumber}</div>
            <p className="text-gray-500">يرجى الانتظار حتى يتم النداء على رقمك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kiosk;