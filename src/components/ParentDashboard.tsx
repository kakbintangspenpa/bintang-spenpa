import React, { useState } from 'react';
import { JournalRecord, ParentGuidance } from '../types';
import { HABITS_DATA } from '../data/habitsData';
import {
  Heart,
  Home,
  Star,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Printer,
  BookOpen,
  GraduationCap,
  MessageCircleHeart,
  Lightbulb,
  ThumbsUp,
  Smile,
  X,
  Send,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { playPop, playSuccessFanfare, playSparkleSound } from '../utils/audio';

interface ParentDashboardProps {
  records: JournalRecord[];
  studentName: string;
  grade: string;
  onUpdateRecord: (updatedRecord: JournalRecord) => void;
  onSwitchToStudentMode: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  records,
  studentName,
  grade,
  onUpdateRecord,
  onSwitchToStudentMode,
}) => {
  const [parentName, setParentName] = useState('Bunda Rahma');
  const [parentRole, setParentRole] = useState<'Ayah' | 'Bunda' | 'Orang Tua / Wali'>('Bunda');
  const [activeTab, setActiveTab] = useState<'JOURNALS' | 'TIPS_PARENTING'>('JOURNALS');

  // Modal / Form state for giving parent note
  const [selectedRecord, setSelectedRecord] = useState<JournalRecord | null>(null);
  const [parentNote, setParentNote] = useState('');
  const [homeAffirmation, setHomeAffirmation] = useState<
    'Sangat Bangga' | 'Anak Hebat Kebanggaan Keluarga' | 'Terus Tingkatkan Sayang' | 'Teladan Di Rumah'
  >('Anak Hebat Kebanggaan Keluarga');
  const [giveLoveBadge, setGiveLoveBadge] = useState(true);
  const [isGeneratingAiNote, setIsGeneratingAiNote] = useState(false);

  // Statistics
  const totalStudentJournals = records.length;
  const parentReviewedCount = records.filter((r) => r.parentGuidance).length;
  const pendingParentCount = totalStudentJournals - parentReviewedCount;
  const totalStars = records.reduce((acc, cur) => acc + (cur.evaluation?.bintangScore || 0), 0);

  const handleOpenReview = (record: JournalRecord) => {
    playPop();
    setSelectedRecord(record);
    if (record.parentGuidance) {
      setParentNote(record.parentGuidance.parentNote);
      setHomeAffirmation(record.parentGuidance.homeAffirmation);
      setGiveLoveBadge(!!record.parentGuidance.parentLoveBadge);
    } else {
      setParentNote('');
      setHomeAffirmation('Anak Hebat Kebanggaan Keluarga');
      setGiveLoveBadge(true);
    }
  };

  const handleGenerateAiParentNote = async () => {
    if (!selectedRecord) return;
    playPop();
    setIsGeneratingAiNote(true);

    try {
      const response = await fetch('/api/generate-parent-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: selectedRecord.studentName,
          habitName: selectedRecord.habitName,
          journalText: selectedRecord.journalText,
          parentRole,
          parentName,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setParentNote(res.data.parentNote);
        if (res.data.homeAffirmation) {
          setHomeAffirmation(res.data.homeAffirmation);
        }
        playSparkleSound();
      }
    } catch (e) {
      console.warn('Error generating parent note', e);
      setParentNote(
        `${parentRole} sangat bangga dan bahagia melihatmu rajin mempraktikkan ${selectedRecord.habitName}. Tetaplah jadi anak yang sholeh, disiplin, dan berbakti pada keluarga ya sayang!`
      );
    } finally {
      setIsGeneratingAiNote(false);
    }
  };

  const handleSaveParentNote = () => {
    if (!selectedRecord) return;

    const guidance: ParentGuidance = {
      parentName: parentName.trim() || 'Orang Tua',
      relationship: parentRole,
      reviewedAt:
        new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB',
      parentNote:
        parentNote.trim() ||
        `${parentRole} sangat bangga dengan usahamu dalam ${selectedRecord.habitName}!`,
      homeAffirmation,
      parentLoveBadge: giveLoveBadge,
    };

    const updated: JournalRecord = {
      ...selectedRecord,
      parentGuidance: guidance,
    };

    onUpdateRecord(updated);
    playSuccessFanfare();
    setSelectedRecord(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Parent Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-rose-100 uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
              Menu Orang Tua & Pendampingan Keluarga
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
              Ruang Cinta & Apresiasi Orang Tua
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-rose-100">
              <span className="font-semibold bg-white/10 px-2.5 py-1 rounded-lg">
                👨‍👩‍👧 Pendamping: <strong>{parentName} ({parentRole})</strong>
              </span>
              <span className="font-semibold bg-white/10 px-2.5 py-1 rounded-lg">
                👦 Ananda: <strong>{studentName} ({grade})</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                playPop();
                window.print();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Rapor Keluarga
            </button>

            <button
              type="button"
              onClick={() => {
                playPop();
                onSwitchToStudentMode();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-white text-rose-800 hover:bg-rose-50 font-bold text-xs shadow-md transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-rose-600" />
              Kembali ke Jurnal Anak
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats for Parents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Jurnal Dibuat Ananda
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{totalStudentJournals}</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
              📖
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
            Pesan Cinta Diberikan
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-rose-900">{parentReviewedCount}</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              ❤️
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Bintang Diraih Anak
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-900">{totalStars} ⭐</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              ✨
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Kemitraan Keluarga
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base sm:text-xl font-black text-emerald-900">Harmonis</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              🤝
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Jurnal Anak vs Panduan Pengasuhan Rumah (Horizontally scrollable on mobile) */}
      <div className="flex overflow-x-auto pb-1.5 sm:pb-2 no-scrollbar items-center gap-1.5 sm:gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            playPop();
            setActiveTab('JOURNALS');
          }}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'JOURNALS'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Jurnal & Catatan Ananda ({totalStudentJournals})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPop();
            setActiveTab('TIPS_PARENTING');
          }}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'TIPS_PARENTING'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Panduan Pengasuhan 7 Kebiasaan di Rumah</span>
        </button>
      </div>

      {/* Tab 1: Daftar Jurnal & Peninjauan Orang Tua */}
      {activeTab === 'JOURNALS' && (
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 mx-auto flex items-center justify-center text-2xl">
                👨‍👩‍👧
              </div>
              <h4 className="font-bold text-slate-700">Belum Ada Jurnal Tersimpan dari Ananda</h4>
              <p className="text-xs text-slate-400">
                Ajak Ananda mengisi jurnal 7 kebiasaan di Mode Siswa ya Ayah/Bunda!
              </p>
            </div>
          ) : (
            records.map((rec) => {
              const hasParentNote = !!rec.parentGuidance;

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-pink-300 transition-all space-y-4"
                >
                  {/* Top Bar: Habit & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-bold flex items-center justify-center shadow-xs">
                        {rec.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {rec.studentName}
                          </h4>
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {rec.grade}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rec.dateString} • {rec.timeRecorded}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                        #{rec.habitId} {rec.habitName}
                      </span>

                      {hasParentNote ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                          Sudah Diapresiasi Keluarga
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Menunggu Catatan Cinta Orang Tua
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Journal Story & Feedback Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Student text */}
                    <div className="lg:col-span-7 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cerita Kegiatan Ananda di Rumah/Sekolah:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        "{rec.journalText}"
                      </p>

                      {rec.photoDataUrl && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Foto Kegiatan:
                          </span>
                          <img
                            src={rec.photoDataUrl}
                            alt="Bukti Siswa"
                            className="h-28 w-auto object-cover rounded-xl border border-slate-200 shadow-2xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* Kak Bintang Feedback & Teacher Note */}
                    <div className="lg:col-span-5 space-y-2">
                      <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-800 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Ulasan Kak Bintang:
                          </span>
                          <span className="font-black text-amber-900">
                            {rec.evaluation.bintangScore} ⭐
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 italic leading-snug line-clamp-2">
                          "{rec.evaluation.pujianEdukatif}"
                        </p>
                      </div>

                      {/* Teacher Note if available */}
                      {rec.teacherGuidance && (
                        <div className="bg-sky-50/70 rounded-2xl p-3 border border-sky-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-sky-900 flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                              Catatan Guru:
                            </span>
                            <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                              {rec.teacherGuidance.guidanceAction}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 italic leading-snug line-clamp-2">
                            "{rec.teacherGuidance.feedbackNote}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Existing Parent Love Note Box */}
                  {rec.parentGuidance && (
                    <div className="bg-rose-50/90 rounded-2xl p-4 border border-rose-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-900 flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                          Pesan Kasih Sayang dari {rec.parentGuidance.parentName} ({rec.parentGuidance.relationship}):
                        </span>
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          💖 {rec.parentGuidance.homeAffirmation}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        "{rec.parentGuidance.parentNote}"
                      </p>
                      <div className="text-[10px] text-slate-400">
                        Diberikan pada: {rec.parentGuidance.reviewedAt}
                        {rec.parentGuidance.parentLoveBadge && (
                          <span className="text-rose-600 font-bold ml-2">
                            + Stiker Bintang Kasih Sayang Keluarga ❤️⭐
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenReview(rec)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      <MessageCircleHeart className="w-3.5 h-3.5" />
                      <span>{hasParentNote ? 'Ubah Pesan Cinta' : 'Tulis Pesan Kasih Sayang Orang Tua'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Panduan Pengasuhan Positif 7 Kebiasaan di Rumah */}
      {activeTab === 'TIPS_PARENTING' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HABITS_DATA.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg ${habit.color.bg} text-white font-bold text-xs flex items-center justify-center`}>
                  #{habit.id}
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  {habit.name} di Lingkungan Keluarga
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {habit.description}
              </p>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                <span className="font-bold text-rose-800 block">
                  💡 Tips untuk Ayah & Bunda:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {habit.specificTips.slice(0, 2).map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] text-amber-800 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                🎯 Tantangan Bersama di Rumah: {habit.dailyChallenge}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Parent Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-2 border-rose-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Pesan Kasih Sayang Orang Tua
                  </h3>
                  <p className="text-xs text-rose-100">
                    Untuk: <strong>{selectedRecord.studentName}</strong> • {selectedRecord.habitName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Identitas Orang Tua */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Ayah / Bunda:
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Contoh: Bunda Rahma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sebagai:
                  </label>
                  <select
                    value={parentRole}
                    onChange={(e) => setParentRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-rose-400 focus:outline-none bg-slate-50"
                  >
                    <option value="Bunda">Bunda / Ibu</option>
                    <option value="Ayah">Ayah / Bapak</option>
                    <option value="Orang Tua / Wali">Orang Tua / Wali</option>
                  </select>
                </div>
              </div>

              {/* Student Journal Preview */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">
                  Cerita Ananda:
                </span>
                <p className="font-medium text-slate-900 italic">
                  "{selectedRecord.journalText}"
                </p>
              </div>

              {/* Afirmasi Kasih Sayang Pilihan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Kalimat Afirmasi Keluarga:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Sangat Bangga',
                    'Anak Hebat Kebanggaan Keluarga',
                    'Terus Tingkatkan Sayang',
                    'Teladan Di Rumah',
                  ].map((af) => (
                    <button
                      key={af}
                      type="button"
                      onClick={() => {
                        playPop();
                        setHomeAffirmation(af as any);
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border text-left transition cursor-pointer ${
                        homeAffirmation === af
                          ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      💖 {af}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Pesan Orang Tua */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageCircleHeart className="w-4 h-4 text-rose-600" />
                    Pesan Kasih Sayang untuk Ananda:
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateAiParentNote}
                    disabled={isGeneratingAiNote}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-800 hover:bg-pink-100 border border-pink-300 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    {isGeneratingAiNote ? 'Menyusun Pesan...' : 'Bantu Tulis Pesan (AI) ✨'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={parentNote}
                  onChange={(e) => setParentNote(e.target.value)}
                  placeholder={`Tuliskan ungkapan terima kasih, kebanggaan, dan doa tulus untuk ${selectedRecord.studentName}...`}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              {/* Love Badge Checkbox */}
              <div
                onClick={() => setGiveLoveBadge(!giveLoveBadge)}
                className="flex items-center gap-2 p-3 bg-pink-50/70 border border-pink-200 rounded-2xl cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={giveLoveBadge}
                  onChange={() => {}}
                  className="rounded text-rose-600 focus:ring-rose-400 w-4 h-4"
                />
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1">
                  ❤️ Sematkan Stiker Bintang Kasih Sayang Keluarga
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-xs font-bold text-slate-600 px-4 py-2 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveParentNote}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                Kirim Pesan Kasih Sayang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
