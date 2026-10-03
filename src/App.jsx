import { HashRouter, Routes, Route } from 'react-router-dom';
import Kiosk from './Kiosk';
import EmployeeDesk from './EmployeeDesk';
import DisplayScreen from './DisplayScreen';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    // استخدام HashRouter لضمان عمل المسارات على استضافة Hostinger بدون أخطاء 404
    <HashRouter>
      <Routes>
        {/* 1. الشاشة الكبيرة هي الواجهة الرئيسية (تفتح بمجرد دخول الدومين) */}
        <Route path="/" element={<DisplayScreen />} />

        {/* 2. شاشة الكشك (نسخة الويب) محمية بكلمة مرور 1234 */}
        <Route 
          path="/kiosk" 
          element={
            <ProtectedRoute expectedPassword="1234" storageKey="auth_kiosk">
              <Kiosk />
            </ProtectedRoute>
          } 
        />
        
        {/* 3. شاشة الموظفين محمية بكلمة مرور 0000 */}
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute expectedPassword="0000" storageKey="auth_employee">
              <EmployeeDesk />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;