/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { HABITS_DATA } from './data/habitsData';
import { INITIAL_CLASS_RECORDS } from './data/initialClassRecords';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
} from './data/initialAdminData';
import {
  HabitInfo,
  KakBintangEvaluation,
  JournalRecord,
  BadgeInfo,
  StudentAccount,
  TeacherAccount,
  SchoolProfile,
} from './types';
import { UserRole, UserSession, DEMO_CREDENTIALS } from './types/auth';

// Components
import { LoginPortal } from './components/LoginPortal';
import { AnimatedAppLogo } from './components/AnimatedAppLogo';
import { KakBintangMascot } from './components/KakBintangMascot';
import { HabitSelector } from './components/HabitSelector';
import { JournalForm } from './components/JournalForm';
import { EvaluationResult } from './components/EvaluationResult';
import { HabitsTrackerMatrix } from './components/HabitsTrackerMatrix';
import { AskKakBintangModal } from './components/AskKakBintangModal';
import { JournalHistoryModal } from './components/JournalHistoryModal';
import { CertificateModal } from './components/CertificateModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import TeacherMenu from './components/TeacherMenu';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import {
  Sparkles,
  Award,
  BookOpen,
  MessageCircleQuestion,
  Sliders,
  LogOut,
  ChevronDown,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Heart,
  School,
  Star,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { playPop, playSuccessFanfare, playSparkleSound } from './utils/audio';

const STORAGE_KEY_AUTH = 'kak_bintang_auth_session';
const STORAGE_KEY_PROFILE = 'kak_bintang_student_profile';
const STORAGE_KEY_RECORDS = 'kak_bintang_journal_records';
const STORAGE_KEY_STUDENTS = 'kak_bintang_admin_students';
const STORAGE_KEY_TEACHERS = 'kak_bintang_admin_teachers';
const STORAGE_KEY_SCHOOL = 'kak_bintang_admin_school';

export default function App() {
  // Authentication State
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && parsed.isLoggedIn) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse auth session', e);
    }
    return null; // By default show login screen with role selection upfront
  });

  // Active view role (can switch inside session for previewing)
  const [activeViewRole, setActiveViewRole] = useState<UserRole>('SISWA');

  // Teacher sub-view toggle
  const [teacherSubTab, setTeacherSubTab] = useState<'VERIFIKASI' | 'COACHING'>('VERIFIKASI');

  // Student Journal & Habit State
  const [selectedHabit, setSelectedHabit] = useState<HabitInfo>(HABITS_DATA[0]);
  const [studentName, setStudentName] = useState<string>('Dimas Aditya');
  const [grade, setGrade] = useState<string>('Kelas 4 SDN Merdeka');
  const [journalRecords, setJournalRecords] = useState<JournalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved records', e);
    }
    return INITIAL_CLASS_RECORDS;
  });

  const [currentEvaluation, setCurrentEvaluation] = useState<KakBintangEvaluation | null>(() => {
    return INITIAL_CLASS_RECORDS.length > 0 ? INITIAL_CLASS_RECORDS[0].evaluation : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mascotExpression, setMascotExpression] = useState<'happy' | 'thinking' | 'celebrating' | 'talking'>('happy');
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    'Halo Bintang Hebat! Aku Kak Bintang. Siap mendampingimu menjadi anak Indonesia yang berkarakter unggul! Yuk pilih kebiasaanmu dan ceritakan padaku!'
  );

  // Admin Data State
  const [adminStudents, setAdminStudents] = useState<StudentAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_STUDENTS;
  });

  const [adminTeachers, setAdminTeachers] = useState<TeacherAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_TEACHERS;
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHOOL);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_SCHOOL_PROFILE;
  });

  // Modals state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Sync active view role with logged-in role upon login
  useEffect(() => {
    if (userSession) {
      setActiveViewRole(userSession.role);
    }
  }, [userSession]);

  // Save student profile
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_PROFILE,
        JSON.stringify({ name: studentName, grade })
      );
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
  }, [studentName, grade]);

  // Save records to storage
  const saveRecord = (newRecord: JournalRecord) => {
    const updated = [newRecord, ...journalRecords];
    setJournalRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save records', e);
    }
  };

  const handleUpdateRecord = (updatedRecord: JournalRecord) => {
    const updated = journalRecords.map((r) =>
      r.id === updatedRecord.id ? updatedRecord : r
    );
    setJournalRecords(updated);
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update record in storage', e);
    }
  };

  const handleSaveStudents = (newStudents: StudentAccount[]) => {
    setAdminStudents(newStudents);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(newStudents));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveTeachers = (newTeachers: TeacherAccount[]) => {
    setAdminTeachers(newTeachers);
    try {
      localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(newTeachers));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveSchoolProfile = (newProfile: SchoolProfile) => {
    setSchoolProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(newProfile));
    } catch (e) {
      console.warn(e);
    }
  };

  // Login handler
  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setActiveViewRole(session.role);
    if (session.role === 'SISWA') {
      setStudentName(session.name);
    }
  };

  // Logout handler
  const handleLogout = () => {
    playPop();
    const confirmLogout = window.confirm(
      'Apakah Anda yakin ingin keluar dari dashboard dan kembali ke halaman login peran?'
    );
    if (!confirmLogout) return;

    setUserSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.warn(e);
    }
  };

  // Quick Switch Role handler (for convenient testing across roles)
  const handleSwitchRole = (role: UserRole) => {
    playPop();
    setActiveViewRole(role);
    setIsRoleDropdownOpen(false);

    // Update session title for active role
    if (userSession) {
      const demo = DEMO_CREDENTIALS.find((c) => c.role === role);
      if (demo) {
        setUserSession({
          ...userSession,
          role,
          roleLabel: demo.label,
          avatar: demo.avatar,
          titleOrGrade: demo.title,
        });
      }
    }
  };

  // Calculate unique completed habit IDs
  const completedHabitIds = Array.from(
    new Set(journalRecords.map((r) => r.habitId))
  );

  // Calculate total stars
  const totalStars = journalRecords.reduce(
    (acc, cur) => acc + (cur.evaluation?.bintangScore || 0) + (cur.teacherGuidance?.additionalTeacherStar ? 1 : 0),
    0
  );

  // Extract all unique badges earned
  const unlockedBadges: BadgeInfo[] = [];
  const badgeIdsSeen = new Set<string>();
  journalRecords.forEach((r) => {
    if (r.evaluation?.badgeDiberikan && !badgeIdsSeen.has(r.evaluation.badgeDiberikan.id)) {
      badgeIdsSeen.add(r.evaluation.badgeDiberikan.id);
      unlockedBadges.push(r.evaluation.badgeDiberikan);
    }
  });

  const streakDays = Math.max(1, completedHabitIds.length);

  // Handle Journal Submission
  const handleJournalSubmit = async (formData: {
    habitId: number;
    habitName: string;
    studentName: string;
    grade: string;
    journalText: string;
    timeRecorded: string;
    imageBase64: string | null;
    imageMimeType: string;
  }) => {
    setIsLoading(true);
    setMascotExpression('thinking');
    setMascotSpeech(
      `Wah, ceritamu tentang "${formData.habitName}" sedang Kak Bintang telaah dengan cermat ya! Tunggu sebentar...`
    );

    try {
      const response = await fetch('/api/analyze-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Gagal menganalisis jurnal.');
      }

      const evaluation: KakBintangEvaluation = result.data;
      setCurrentEvaluation(evaluation);

      // Create new JournalRecord
      const now = new Date();
      const newRecord: JournalRecord = {
        id: `rec-${Date.now()}`,
        timestamp: now.toISOString(),
        dateString: now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        studentName: formData.studentName,
        grade: formData.grade,
        habitId: formData.habitId,
        habitName: formData.habitName,
        journalText: formData.journalText,
        timeRecorded: formData.timeRecorded,
        photoDataUrl: formData.imageBase64,
        evaluation,
      };

      saveRecord(newRecord);

      setMascotExpression('celebrating');
      setMascotSpeech(
        `${evaluation.sapaanHangat} Kamu mendapatkan ${evaluation.bintangScore} bintang! Tetap bersinar ya!`
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#ec4899'],
      });

      playSuccessFanfare();
      setTimeout(() => playSparkleSound(), 600);

      setTimeout(() => {
        const evalEl = document.getElementById('evaluation-section');
        if (evalEl) {
          evalEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } catch (err: any) {
      console.error(err);
      setMascotExpression('happy');
      setMascotSpeech(
        'Aduh, tadi ada kendala teknis sedikit. Tapi jangan cemas ya, coba kirim kembali jurnalmu!'
      );
      alert(err.message || 'Terjadi kendala saat menganalisis jurnal.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setJournalRecords([]);
    setCurrentEvaluation(null);
    localStorage.removeItem(STORAGE_KEY_RECORDS);
    playPop();
  };

  // If user is not authenticated, show the Login Portal with role selection upfront
  if (!userSession) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} defaultRole="GURU" />;
  }

  // Role Badge Styling Helper
  const getRoleBadgeInfo = (role: UserRole) => {
    switch (role) {
      case 'GURU':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          icon: '👩‍🏫',
          label: 'Guru / Pendidik',
        };
      case 'SISWA':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          icon: '🎒',
          label: 'Siswa / Peserta Didik',
        };
      case 'ORANG_TUA':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          icon: '👨‍👩‍👧',
          label: 'Orang Tua / Wali',
        };
      case 'ADMIN':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          icon: '🏫',
          label: 'Admin Satuan Pendidikan',
        };
    }
  };

  const roleBadge = getRoleBadgeInfo(activeViewRole);

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-slate-800 flex flex-col selection:bg-amber-200">
      {/* Top Navigation Bar with Gentle Micro-Pulse Logo & Role Badge */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand with Animated App Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <AnimatedAppLogo size="sm" showSubtitle={false} className="shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-black text-sm sm:text-base text-slate-900 leading-none">
                  Kak Bintang
                </span>
                <span className="text-[9px] font-extrabold bg-gradient-to-r from-red-600 to-rose-600 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Indonesia
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate">
                7 Kebiasaan Anak Indonesia Hebat
              </p>
            </div>
          </div>

          {/* Center / Right: Role Switcher & User Profile & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Interactive Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-xs shadow-2xs transition cursor-pointer ${roleBadge.bg}`}
                title="Beralih peran dashboard"
              >
                <span className="text-sm">{roleBadge.icon}</span>
                <span className="hidden md:inline">{roleBadge.label}</span>
                <span className="md:hidden">
                  {activeViewRole === 'GURU'
                    ? 'Guru'
                    : activeViewRole === 'SISWA'
                    ? 'Siswa'
                    : activeViewRole === 'ORANG_TUA'
                    ? 'Ortu'
                    : 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Beralih Peran Tampilan:
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSwitchRole('GURU')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition ${
                      activeViewRole === 'GURU' ? 'text-emerald-700 bg-emerald-50/60 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>👩‍🏫</span>
                    <div className="flex-1">
                      <div>Guru / Pendidik</div>
                      <div className="text-[10px] text-slate-400 font-normal">Review & Coaching</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchRole('SISWA')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition ${
                      activeViewRole === 'SISWA' ? 'text-amber-700 bg-amber-50/60 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>🎒</span>
                    <div className="flex-1">
                      <div>Siswa / Peserta Didik</div>
                      <div className="text-[10px] text-slate-400 font-normal">Jurnal 7 Kebiasaan</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchRole('ORANG_TUA')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition ${
                      activeViewRole === 'ORANG_TUA' ? 'text-rose-700 bg-rose-50/60 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>👨‍👩‍👧</span>
                    <div className="flex-1">
                      <div>Orang Tua / Wali</div>
                      <div className="text-[10px] text-slate-400 font-normal">Pantau di Rumah</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchRole('ADMIN')}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center gap-2 hover:bg-slate-50 transition ${
                      activeViewRole === 'ADMIN' ? 'text-blue-700 bg-blue-50/60 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>🏫</span>
                    <div className="flex-1">
                      <div>Admin Sekolah</div>
                      <div className="text-[10px] text-slate-400 font-normal">Kelola Data & Profil</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Student-only quick actions */}
            {activeViewRole === 'SISWA' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setIsVoiceModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs transition cursor-pointer"
                  title="Atur tempo & karakter suara Kak Bintang"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Suara</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setIsAskModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs transition cursor-pointer"
                  title="Tanya Kak Bintang tentang 7 kebiasaan"
                >
                  <MessageCircleQuestion className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Tanya</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setIsHistoryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition cursor-pointer"
                  title="Buka riwayat jurnal kebiasaan"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Riwayat</span>
                  {journalRecords.length > 0 && (
                    <span className="bg-amber-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                      {journalRecords.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* User Profile Pill */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-left">
              <span className="text-xl p-1 bg-slate-100 rounded-lg">{userSession.avatar}</span>
              <div className="leading-tight">
                <strong className="text-xs text-slate-800 block truncate max-w-[120px]">
                  {userSession.name}
                </strong>
                <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                  {userSession.email}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 shadow-2xs transition cursor-pointer"
              title="Keluar dari sesi dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area Based on Active Role */}
      {activeViewRole === 'GURU' && (
        <div className="flex-1 w-full flex flex-col">
          {/* Teacher Sub-navigation Toggle Bar */}
          <div className="bg-emerald-900/90 text-white border-b border-emerald-800 px-4 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">👩‍🏫</span>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold font-display leading-tight">
                    Dashboard Pembinaan Guru & Pendidik Karakter
                  </h2>
                  <p className="text-[10px] text-emerald-200">
                    Membimbing & meninjau 7 kebiasaan baik siswa Indonesia Hebat
                  </p>
                </div>
              </div>

              {/* Toggle Subtabs: Verifikasi Jurnal vs Coaching Menu */}
              <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/60">
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setTeacherSubTab('VERIFIKASI');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    teacherSubTab === 'VERIFIKASI'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Verifikasi & Apresiasi Jurnal ({journalRecords.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setTeacherSubTab('COACHING');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    teacherSubTab === 'COACHING'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Menu Pembinaan & Coaching</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subtab Render */}
          {teacherSubTab === 'VERIFIKASI' ? (
            <TeacherDashboard
              records={journalRecords}
              onUpdateRecord={handleUpdateRecord}
              onSwitchToStudentMode={() => handleSwitchRole('SISWA')}
            />
          ) : (
            <div className="flex-1">
              <TeacherMenu />
            </div>
          )}
        </div>
      )}

      {activeViewRole === 'ORANG_TUA' && (
        <ParentDashboard
          records={journalRecords}
          studentName={studentName}
          grade={grade}
          onUpdateRecord={handleUpdateRecord}
          onSwitchToStudentMode={() => handleSwitchRole('SISWA')}
        />
      )}

      {activeViewRole === 'ADMIN' && (
        <AdminDashboard
          students={adminStudents}
          teachers={adminTeachers}
          schoolProfile={schoolProfile}
          records={journalRecords}
          onSaveStudents={handleSaveStudents}
          onSaveTeachers={handleSaveTeachers}
          onSaveSchoolProfile={handleSaveSchoolProfile}
          onSwitchToStudentMode={() => handleSwitchRole('SISWA')}
        />
      )}

      {activeViewRole === 'SISWA' && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-8">
          {/* Hero Section with Interactive Kak Bintang Avatar & Welcoming Speech */}
          <section className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-3xl p-5 sm:p-7 shadow-lg text-slate-900 relative overflow-hidden">
            {/* Subtle decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-white/15 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 backdrop-blur-xs text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Pembina Karakter Siswa Hebat
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-display text-slate-900">
                  Wujudkan Generasi Emas dengan 7 Kebiasaan Baik!
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-800 font-medium max-w-xl">
                  Catat kebiasaan harianmu setiap hari: bangun pagi, beribadah, berolahraga, makan sehat, gemar belajar, bermasyarakat, dan tidur lebih awal. Kak Bintang siap memberi bintang dan ulasan edukatif!
                </p>
              </div>

              {/* Kak Bintang Mascot (Karakter Siswa Laki-Laki) with Dynamic Speech */}
              <div className="shrink-0 flex items-center justify-center">
                <KakBintangMascot
                  expression={mascotExpression}
                  speechBubbleText={mascotSpeech}
                  size="md"
                  onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
                />
              </div>
            </div>
          </section>

          {/* 7 Habits Visual Selector */}
          <section className="space-y-3">
            <HabitSelector
              selectedHabitId={selectedHabit.id}
              onSelectHabit={(habit) => {
                setSelectedHabit(habit);
                setMascotExpression('happy');
                setMascotSpeech(
                  `Bagus sekali! Kebiasaan #${habit.id} "${habit.name}". ${habit.tagline} Yuk ceritakan apa yang sudah kamu lakukan!`
                );
              }}
              completedHabitIds={completedHabitIds}
            />
          </section>

          {/* Interactive Journal Form */}
          <section className="space-y-4">
            <JournalForm
              currentHabit={selectedHabit}
              studentName={studentName}
              setStudentName={setStudentName}
              grade={grade}
              setGrade={setGrade}
              onSubmit={handleJournalSubmit}
              isLoading={isLoading}
            />
          </section>

          {/* Evaluation Output Section */}
          {currentEvaluation && (
            <section id="evaluation-section" className="space-y-4 pt-2">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  Hasil Analisis & Pujian Edukatif Kak Bintang:
                </h3>
              </div>
              <EvaluationResult
                evaluation={currentEvaluation}
                studentName={studentName}
                onOpenCertificate={() => {
                  playPop();
                  setIsCertModalOpen(true);
                }}
                onOpenVoiceSettings={() => {
                  playPop();
                  setIsVoiceModalOpen(true);
                }}
                onNewJournal={() => {
                  playPop();
                  const nextId = (selectedHabit.id % 7) + 1;
                  const nextHabit = HABITS_DATA.find((h) => h.id === nextId) || HABITS_DATA[0];
                  setSelectedHabit(nextHabit);
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
              />
            </section>
          )}

          {/* 7 Habits Progress Matrix & Character Badges */}
          <section className="space-y-3">
            <HabitsTrackerMatrix
              completedHabitIds={completedHabitIds}
              unlockedBadges={unlockedBadges}
              totalStars={totalStars}
              streakDays={streakDays}
              journalRecords={journalRecords}
              onSelectHabitToFill={(habit) => {
                setSelectedHabit(habit);
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
            />
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-display">Kak Bintang</span>
            <span>•</span>
            <span>Asisten Pembina Karakter Anak Indonesia</span>
          </div>
          <p>
            Mendukung 7 Kebiasaan Anak Indonesia Hebat menuju Generasi Emas 🇮🇩✨
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AskKakBintangModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        studentName={studentName}
      />

      <JournalHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={journalRecords}
        onSelectRecord={(rec) => {
          setCurrentEvaluation(rec.evaluation);
          const matchedHabit = HABITS_DATA.find((h) => h.id === rec.habitId);
          if (matchedHabit) setSelectedHabit(matchedHabit);
          setMascotSpeech(
            `Ini dia jurnalmu tentang "${rec.habitName}" pada ${rec.dateString}. Tetap pertahankan ya!`
          );
        }}
        onClearHistory={handleClearHistory}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        evaluation={currentEvaluation}
        studentName={studentName}
        grade={grade}
      />

      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
