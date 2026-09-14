import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children, expectedPassword, storageKey }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // التحقق مما إذا كان المستخدم قد سجل دخوله مسبقاً في هذه الجلسة
  useEffect(() => {
    const authStatus = sessionStorage.getItem(storageKey);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, [storageKey]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === expectedPassword) {
      sessionStorage.setItem(storageKey, 'true');
      setIsAuthenticated(true);
    } else {
      setError('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  // إذا كان مسجلاً، اعرض الشاشة المطلوبة
  if (isAuthenticated) {
    return children;
  }

  // إذا لم يكن مسجلاً، اعرض شاشة إدخال كلمة المرور
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-10 rounded-3xl shadow-sm w-full max-w-sm text-center border border-gray-100 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-2">تسجيل الدخول</h2>
        <p className="text-gray-500 mb-6">الرجاء إدخال رمز المرور للمتابعة</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور..."
            className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black transition-all"
            required
            autoFocus
          />
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-medium text-lg py-3 rounded-xl transition-colors"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProtectedRoute;