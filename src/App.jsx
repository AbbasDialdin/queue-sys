import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Kiosk from './Kiosk';
import Employee from './Employee';
import DisplayScreen from './DisplayScreen';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* شاشة مدخل الأسماء محمية بكلمة مرور 1234 */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute expectedPassword="1234" storageKey="auth_kiosk">
              <Kiosk />
            </ProtectedRoute>
          } 
        />
        
        {/* شاشة الموظف محمية بكلمة مرور 0000 */}
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute expectedPassword="0000" storageKey="auth_employee">
              <Employee />
            </ProtectedRoute>
          } 
        />
        
        {/* الشاشة الكبيرة تبقى بدون باسورد ليسهل تشغيلها على الشاشات الذكية */}
        <Route path="/display" element={<DisplayScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;