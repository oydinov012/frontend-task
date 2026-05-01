import { useState, useEffect, useRef } from 'react';
import {
  User,
  Pencil,
  Save,
  X,
  Camera,
  Phone,
  AtSign,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getProfile, updateProfile, updatePhoto, Profile } from '../../lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        setForm({
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          username: p.username || '',
          phone: p.phone || '',
          password: '',
          confirm_password: '',
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (form.password && form.password !== form.confirm_password) {
      setError('Parollar mos kelmadi');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload: any = {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        phone: form.phone,
      };
      if (form.password) {
        payload.password = form.password;
        payload.confirm_password = form.confirm_password;
      }
      await updateProfile(payload);
      const updated = await getProfile();
      setProfile(updated);
      setEditing(false);
      setSuccess('Profil muvaffaqiyatli yangilandi');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    setError('');
    try {
      await updatePhoto(file);
      const updated = await getProfile();
      setProfile(updated);
      setSuccess('Foto yangilandi');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPhotoLoading(false);
    }
  };

  const cancelEdit = () => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      username: profile.username || '',
      phone: profile.phone || '',
      password: '',
      confirm_password: '',
    });
    setEditing(false);
    setError('');
  };

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    profile?.username ||
    'Foydalanuvchi';

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-500 text-sm mt-0.5">Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Cover banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />

        {/* Avatar section */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-6">
            <div className="relative">
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt={fullName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 bg-indigo-600 rounded-2xl ring-4 ring-white shadow-md flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={photoLoading}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
              >
                {photoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.heic,.heif"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Tahrirlash
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Bekor
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Saqlash
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            /* View mode */
            <div>
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
              <p className="text-gray-500 text-sm">@{profile?.username}</p>

              <div className="mt-5 space-y-3">
                <InfoRow icon={<User className="w-4 h-4" />} label="Ism" value={profile?.first_name || '—'} />
                <InfoRow icon={<User className="w-4 h-4" />} label="Familiya" value={profile?.last_name || '—'} />
                <InfoRow icon={<AtSign className="w-4 h-4" />} label="Username" value={profile?.username || '—'} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Telefon" value={profile?.phone || '—'} />
              </div>
            </div>
          ) : (
            /* Edit mode */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Ism" icon={<User className="w-4 h-4" />}>
                  <input
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    placeholder="Ismingiz"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </FormField>
                <FormField label="Familiya" icon={<User className="w-4 h-4" />}>
                  <input
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    placeholder="Familiyangiz"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </FormField>
              </div>

              <FormField label="Username" icon={<AtSign className="w-4 h-4" />}>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="username"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>

              <FormField label="Telefon" icon={<Phone className="w-4 h-4" />}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormField>

              {/* Password section */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Parolni o'zgartirish (ixtiyoriy)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Yangi parol</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tasdiqlash</label>
                    <input
                      type="password"
                      value={form.confirm_password}
                      onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value}</p>
      </div>
    </div>
  );
}

function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1.5">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
