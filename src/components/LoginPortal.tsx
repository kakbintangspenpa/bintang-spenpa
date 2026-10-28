import React, { useState } from 'react';
import {
  UserRole,
  UserSession,
  DEMO_CREDENTIALS,
  DemoCredential,
} from '../types/auth';
import { AnimatedAppLogo } from './AnimatedAppLogo';
import {
  GraduationCap,
  User,
  Heart,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  AlertCircle,
  School,
  KeyRound,
} from 'lucide-react';
import { playPop, playSuccessFanfare } from '../utils/audio';

interface LoginPortalProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultRole?: UserRole;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  defaultRole = 'GURU',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState<string>('guru@hebat.sch.id');
  const [password, setPassword] = useState<string>('guru12345');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'ABOUT_ROLES'>('LOGIN');

  // Role Metadata
  const currentDemo = DEMO_CREDENTIALS.find((c) => c.role === selectedRole) || DEMO_CREDENTIALS[0];

  const handleRoleChange = (role: UserRole) => {
    playPop();
    setSelectedRole(role);
    setErrorMessage(null);

    // Pre-populate demo credentials for chosen role for smooth testing
    const demo = DEMO_CREDENTIALS.find((c) => c.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.passwordHint);
    }
  };

  const handleApplyDemoAccount = (demo: DemoCredential) => {
    playPop();
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.passwordHint);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!email.trim()) {
      setErrorMessage('Silakan masukkan alamat email Anda.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Format email belum valid. Gunakan format contoh: nama@domain.com');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Kata sandi harus minimal 4 karakter.');
      return;
    }

    setIsLoading(true);

    // Simulate safe authentication delay for realistic UX
    setTimeout(() => {
      setIsLoading(false);
      playSuccessFanfare();

      // Create Session object based on current inputs and chosen role
      let userDisplayName = currentDemo.name;
      let userTitle = currentDemo.title;
      let userAvatar = currentDemo.avatar;

      // If user typed custom email/name, adapt gracefully
      if (email.toLowerCase().includes('dimas') || email.toLowerCase().includes('siswa')) {
        userDisplayName = 'Dimas Aditya';
        userTitle = 'Kelas 4 SDN Merdeka';
        userAvatar = '👦';
      } else if (email.toLowerCase().includes('nurul') || email.toLowerCase().includes('guru')) {
        userDisplayName = 'Ibu Nurul Hidayah, S.Pd.';
        userTitle = 'Guru & Pembina Karakter';
        userAvatar = '👩‍🏫';
      } else if (email.toLowerCase().includes('rahma') || email.toLowerCase().includes('ortu') || email.toLowerCase().includes('orangtua')) {
        userDisplayName = 'Bunda Rahma';
        userTitle = 'Orang Tua / Wali Siswa';
        userAvatar = '🧕';
      } else if (email.toLowerCase().includes('admin')) {
        userDisplayName = 'Bpk. H. Suryanto, M.Pd.';
        userTitle = 'Administrator Satuan Pendidikan';
        userAvatar = '👨‍💼';
      } else {
        const username = email.split('@')[0];
        userDisplayName = username.charAt(0).toUpperCase() + username.slice(1);
      }

      const session: UserSession = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        name: userDisplayName,
        role: selectedRole,
        roleLabel: currentDemo.label,
        avatar: userAvatar,
        titleOrGrade: userTitle,
        schoolName: 'SDN Merdeka Indonesia',
        isLoggedIn: true,
        loginMethod: 'EMAIL_PASSWORD',
      };

      if (rememberMe) {
        try {
          localStorage.setItem('kak_bintang_auth_session', JSON.stringify(session));
        } catch (err) {
          console.warn('Failed to persist session', err);
        }
      }

      onLoginSuccess(session);
    }, 700);
  };

  // Google Login Option
  const handleGoogleSignIn = () => {
    playPop();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      playSuccessFanfare();
      const session: UserSession = {
        id: `google-${Date.now()}`,
        email: 'kakbintangspenpa@gmail.com',
        name: selectedRole === 'GURU' ? 'Ibu Nurul Hidayah, S.Pd.' : 'Dimas Aditya (Akun Google)',
        role: selectedRole,
        roleLabel: currentDemo.label,
        avatar: selectedRole === 'GURU' ? '👩‍🏫' : '🌟',
        titleOrGrade: selectedRole === 'GURU' ? 'Guru Pembina Karakter' : 'Peserta Didik Terverifikasi Google',
        schoolName: 'SDN Merdeka Indonesia',
        isLoggedIn: true,
        loginMethod: 'GOOGLE',
      };
      onLoginSuccess(session);
    }, 800);
  };

  // Role pill styles
  const getRoleTabClass = (role: UserRole) => {
    const isSelected = selectedRole === role;
    if (isSelected) {
      switch (role) {
        case 'GURU':
          return 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500 scale-[1.02]';
        case 'SISWA':
          return 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400 scale-[1.02]';
        case 'ORANG_TUA':
          return 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-400 scale-[1.02]';
        case 'ADMIN':
          return 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500 scale-[1.02]';
      }
    }
    return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-[#fcf9f2] to-emerald-50/40 flex flex-col justify-between p-3 sm:p-6">
      {/* Decorative background blurs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full my-auto py-4 sm:py-8">
        {/* Soft Animated Logo Section */}
        <div className="mb-6 sm:mb-8">
          <AnimatedAppLogo size="lg" showSubtitle={true} />
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Card Top Banner: Role Selection */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Portal Keamanan Akses Karakter
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
                  Pilih Peran Anda untuk Masuk
                </h2>
                <p className="text-xs text-slate-300">
                  Akses dashboard disesuaikan dengan tanggung jawab pembiasaan 7 kebiasaan baik.
                </p>
              </div>

              {/* View Tab Toggle */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl self-start sm:self-auto border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setActiveTab('LOGIN');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'LOGIN'
                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Form Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setActiveTab('ABOUT_ROLES');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'ABOUT_ROLES'
                      ? 'bg-amber-400 text-slate-900 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Panduan Peran
                </button>
              </div>
            </div>

            {/* Role Selection Grid (4 Roles) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {/* Guru */}
              <button
                type="button"
                onClick={() => handleRoleChange('GURU')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition duration-200 cursor-pointer text-center ${getRoleTabClass(
                  'GURU'
                )}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1 text-xl">
                  👩‍🏫
                </div>
                <span className="text-xs sm:text-sm font-bold">Guru / Pendidik</span>
                <span className="text-[10px] opacity-80 mt-0.5 line-clamp-1">Review & Bimbingan</span>
              </button>

              {/* Siswa */}
              <button
                type="button"
                onClick={() => handleRoleChange('SISWA')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition duration-200 cursor-pointer text-center ${getRoleTabClass(
                  'SISWA'
                )}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1 text-xl">
                  🎒
                </div>
                <span className="text-xs sm:text-sm font-bold">Siswa / Peserta Didik</span>
                <span className="text-[10px] opacity-80 mt-0.5 line-clamp-1">Jurnal 7 Kebiasaan</span>
              </button>

              {/* Orang Tua */}
              <button
                type="button"
                onClick={() => handleRoleChange('ORANG_TUA')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition duration-200 cursor-pointer text-center ${getRoleTabClass(
                  'ORANG_TUA'
                )}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1 text-xl">
                  👨‍👩‍👧
                </div>
                <span className="text-xs sm:text-sm font-bold">Orang Tua / Wali</span>
                <span className="text-[10px] opacity-80 mt-0.5 line-clamp-1">Pantau & Apresiasi</span>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition duration-200 cursor-pointer text-center ${getRoleTabClass(
                  'ADMIN'
                )}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1 text-xl">
                  🏫
                </div>
                <span className="text-xs sm:text-sm font-bold">Admin Sekolah</span>
                <span className="text-[10px] opacity-80 mt-0.5 line-clamp-1">Kelola Data Siswa</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Form Login */}
          {activeTab === 'LOGIN' ? (
            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      <span>Peran Aktif:</span>
                      <span className="text-amber-600 font-extrabold">{currentDemo.label}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Masuk ke Dashboard {currentDemo.label}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Masukkan email terdaftar dan kata sandi untuk mengakses dashboard bimbingan & jurnal.
                    </p>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Gagal Masuk:</strong> {errorMessage}
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Alamat Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contoh: nama@hebat.sch.id"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm text-slate-800 transition outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Kata Sandi <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            playPop();
                            setPassword(currentDemo.passwordHint);
                          }}
                          className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                        >
                          Isi Sandi Demo
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan kata sandi akun"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/80 border border-slate-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm text-slate-800 transition outline-hidden font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Help */}
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 accent-amber-600"
                        />
                        <span>Ingat status masuk saya</span>
                      </label>
                      <span className="text-slate-400">Aman & Terenkripsi</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Memverifikasi Akses...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Dashboard {currentDemo.label}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Google Workspace / Drive Login Divider */}
                  <div className="relative flex py-2 items-center">
                    <div className="grow border-t border-slate-200"></div>
                    <span className="shrink mx-3 text-slate-400 text-[11px] font-semibold uppercase">
                      Atau Masuk dengan
                    </span>
                    <div className="grow border-t border-slate-200"></div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 shadow-2xs transition flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Masuk dengan Akun Google (Drive Cloud Backup)</span>
                  </button>
                </div>

                {/* Right Column: Demo Accounts & Roles Card (5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-amber-50/50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Akun Uji Coba Cepat (1-Klik)
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Klik untuk mengisi
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Gunakan kredensial pengujian berikut untuk meninjau fitur masing-masing peran tanpa repot mengetik:
                  </p>

                  {/* List of 4 demo accounts */}
                  <div className="space-y-2.5">
                    {DEMO_CREDENTIALS.map((demo) => {
                      const isCurrent = selectedRole === demo.role;
                      return (
                        <div
                          key={demo.role}
                          onClick={() => handleApplyDemoAccount(demo)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-white border-amber-400 shadow-xs ring-2 ring-amber-300'
                              : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl shrink-0">{demo.avatar}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <strong className="text-xs text-slate-900 truncate">
                                  {demo.label}
                                </strong>
                                {isCurrent && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono truncate">
                                {demo.email}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                Sandi: <code className="text-slate-600">{demo.passwordHint}</code>
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-300 shrink-0"
                          >
                            Pilih
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Security Guarantee Box */}
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privasi & Perlindungan Anak
                    </div>
                    <p className="text-emerald-800 leading-relaxed">
                      Data jurnal pembiasaan dan foto kegiatan terlindungi. Hanya pendidik terverifikasi dan orang tua yang dapat memberikan ulasan pembinaan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Panduan Peran */
            <div className="p-5 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Panduan Hak Akses & Peran Pembiasaan Karakter
                </h3>
                <p className="text-xs text-slate-500">
                  Aplikasi ini dirancang untuk menciptakan ekosistem kolaboratif antara Siswa, Pendidik, Orang Tua, dan Sekolah.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_CREDENTIALS.map((demo) => (
                  <div
                    key={demo.role}
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-100 rounded-xl">{demo.avatar}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{demo.label}</h4>
                        <span className="text-xs text-slate-500">{demo.title}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{demo.description}</p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyDemoAccount(demo);
                          setActiveTab('LOGIN');
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 transition"
                      >
                        Gunakan Peran Ini & Masuk
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7 Habits Badge Banner at footer of Login */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-500 text-xs text-center">
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            🌅 1. Bangun Pagi
          </span>
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            🙏 2. Beribadah
          </span>
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            🏃 3. Berolahraga
          </span>
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            🥗 4. Makan Sehat
          </span>
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            📚 5. Gemar Belajar
          </span>
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            🤝 6. Bermasyarakat
          </span>
          <span className="inline-flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
            🌙 7. Tidur Cepat
          </span>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="text-center py-3 text-slate-400 text-xs">
        <p>© 2026 Kak Bintang • Gerakan 7 Kebiasaan Anak Indonesia Hebat menuju Indonesia Emas 🇮🇩</p>
      </div>
    </div>
  );
};
