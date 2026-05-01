import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, CheckSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { register } from '../../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm_password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      setError('Parollar mos kelmadi');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ro\'yxatdan o\'tish muvaffaqiyatsiz');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6">
          <CheckSquare className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center">
          TaskFlow bilan<br />
          <span className="text-indigo-300">boshlang</span>
        </h1>
        <p className="text-indigo-200 text-center leading-relaxed">
          Bepul ro'yxatdan o'ting va vazifalaringizni<br />
          professional darajada boshqarishni boshlang.
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">TaskFlow</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hisob yaratish</h2>
            <p className="text-gray-500 text-sm mb-6">Barcha maydonlarni to'ldiring</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Muvaffaqiyatli ro'yxatdan o'tdingiz! Login sahifasiga yo'naltirilmoqda...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Foydalanuvchi nomi <span className="text-red-400">*</span>
                </label>
                <input
                  required
                  value={form.username}
                  onChange={set('username')}
                  placeholder="username"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Parol <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={set('password')}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Parolni tasdiqlang <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={form.confirm_password}
                    onChange={set('confirm_password')}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Ro'yxatdan o'tilmoqda...
                  </span>
                ) : 'Ro\'yxatdan o\'tish'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Hisobingiz bormi?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}