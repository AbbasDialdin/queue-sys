import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';

const Employee = () => {
  const [counterNumber, setCounterNumber] = useState(1);
  const [waitingTickets, setWaitingTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // جلب الأرقام المنتظرة وترتيبها من الأقدم للأحدث
    const fetchWaitingTickets = async () => {
      const { data } = await supabase
        .from('tickets')
        .select('*')
        .eq('status', 'waiting')
        .order('ticket_number', { ascending: true });
      
      if (data) setWaitingTickets(data);
    };

    fetchWaitingTickets();

    // الاستماع اللحظي لأي إضافة أو تحديث في قاعدة البيانات
    const channel = supabase
      .channel('employee_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchWaitingTickets(); // تحديث القائمة فوراً
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleCallNext = async () => {
    if (waitingTickets.length === 0) return;
    setLoading(true);

    const nextTicket = waitingTickets[0]; // سحب أقدم تذكرة

    const { error } = await supabase
      .from('tickets')
      .update({ status: 'called', counter_number: counterNumber })
      .eq('id', nextTicket.id);

    if (error) {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الاستدعاء');
    }
    setLoading(false);
  };

  const handleExportExcel = async () => {
    // جلب بيانات الزبائن الذين تم استدعاؤهم فقط
    const { data, error } = await supabase
      .from('tickets')
      .select('name, ticket_number, counter_number, created_at')
      .eq('status', 'called')
      .order('created_at', { ascending: false });

    if (error || !data) {
      alert('حدث خطأ أثناء جلب البيانات');
      return;
    }

    if (data.length === 0) {
      alert('لا توجد بيانات حضور لتصديرها حتى الآن.');
      return;
    }

    // تنسيق البيانات لتناسب أعمدة الإكسل
    const formattedData = data.map((ticket) => ({
      'رقم الدور': ticket.ticket_number,
      'الاسم': ticket.name,
      'رقم الشباك': ticket.counter_number,
      'التاريخ والوقت': new Date(ticket.created_at).toLocaleString('ar-IQ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // إنشاء ملف الإكسل وتحميله
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // ضبط اتجاه الشيت ليكون من اليمين لليسار
    if(!worksheet['!views']) worksheet['!views'] = [];
    worksheet['!views'][0] = { rightToLeft: true };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير الحضور");
    
    const currentDate = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `تقرير_الحضور_${currentDate}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-8 flex flex-col items-center" dir="rtl">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">لوحة الموظف</h1>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportExcel}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            تصدير سجل الحضور
          </button>

          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">أنت تعمل على:</span>
            <select 
              value={counterNumber}
              onChange={(e) => setCounterNumber(Number(e.target.value))}
              className="bg-white border border-gray-200 text-gray-900 text-lg rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
            >
              <option value={1}>شباك 1</option>
              <option value={2}>شباك 2</option>
              <option value={3}>شباك 3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-sm border border-gray-100 p-10 flex flex-col items-center">
        <div className="text-gray-500 mb-2 text-lg">المنتظرون في الطابور</div>
        <div className="text-6xl font-bold text-gray-900 mb-10">
          {waitingTickets.length}
        </div>

        <button
          onClick={handleCallNext}
          disabled={loading || waitingTickets.length === 0}
          className="w-full max-w-sm bg-black hover:bg-gray-800 text-white font-medium text-2xl py-5 rounded-2xl transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-md hover:shadow-lg active:scale-95"
        >
          {loading ? 'جاري الاستدعاء...' : 'استدعاء التالي'}
        </button>

        {waitingTickets.length > 0 && (
          <div className="w-full mt-12">
            <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">الأرقام القادمة:</h3>
            <div className="flex flex-wrap gap-3">
              {waitingTickets.slice(0, 10).map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium">
                  {ticket.ticket_number} - {ticket.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;