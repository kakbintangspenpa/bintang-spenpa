import React, { useState } from 'react';
import { KakBintangEvaluation, TeacherGuidance, ParentGuidance } from '../types';
import {
  Star,
  Award,
  Volume2,
  VolumeX,
  Printer,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Heart,
  Compass,
  ArrowRight,
  Share2,
  Sliders,
  GraduationCap,
} from 'lucide-react';
import { speakKakBintang, stopSpeech, playPop } from '../utils/audio';

interface EvaluationResultProps {
  evaluation: KakBintangEvaluation;
  studentName: string;
  onOpenCertificate: () => void;
  onNewJournal: () => void;
  onOpenVoiceSettings?: () => void;
  teacherGuidance?: TeacherGuidance | null;
  parentGuidance?: ParentGuidance | null;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  evaluation,
  studentName,
  onOpenCertificate,
  onNewJournal,
  onOpenVoiceSettings,
  teacherGuidance,
  parentGuidance,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleVoice = () => {
    playPop();
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      // Construct friendly spoken text
      const speechText = `${evaluation.sapaanHangat}. ${evaluation.pujianEdukatif}. ${evaluation.doronganPositifDanTips}. ${evaluation.pesanKakBintang}`;
      speakKakBintang(speechText, () => setIsPlayingAudio(false));
    }
  };

  const getValidityBadge = () => {
    switch (evaluation.validityLevel) {
      case 'VALID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Valid & Keren Banget!
          </span>
        );
      case 'PERLU_DILENGKAPI':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Hebat! Yuk Lengkapi Lagi
          </span>
        );
      case 'KURANG_SESUAI':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            Cerita Menarik, Tetap Semangat!
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-xl p-5 sm:p-8 space-y-6 relative overflow-hidden animate-fade-in">
      {/* Background soft glowing orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Top Banner with Validity & Voice Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div className="flex items-center gap-2">
          {getValidityBadge()}
          <span className="text-xs font-bold text-slate-500">
            Kebiasaan #{evaluation.habitId}: {evaluation.habitName}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isPlayingAudio
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
            }`}
            title="Dengarkan Kak Bintang membacakan pujian ini"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" /> Hentikan Suara
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-700" /> Dengarkan Suara Kak Bintang 🔊
              </>
            )}
          </button>

          {onOpenVoiceSettings && (
            <button
              type="button"
              onClick={() => {
                playPop();
                onOpenVoiceSettings();
              }}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition cursor-pointer"
              title="Atur tempo dan karakter suara Kak Bintang"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Warm Greeting from Kak Bintang */}
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          {evaluation.sapaanHangat}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Kak Bintang sudah membaca ceritamu dengan penuh rasa bangga!
        </p>
      </div>

      {/* Star Score Showcase */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Apresiasi Bintang Karakter:
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 ${
                  star <= evaluation.bintangScore
                    ? 'text-amber-400 fill-amber-400 drop-shadow-sm scale-105'
                    : 'text-slate-200 fill-slate-100'
                }`}
              />
            ))}
            <span className="ml-2 font-black text-xl text-amber-900">
              {evaluation.bintangScore}/5
            </span>
          </div>
        </div>

        {/* Awarded Badge Card */}
        {evaluation.badgeDiberikan && (
          <div className="bg-white px-4 py-2.5 rounded-xl border border-amber-300 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Lencana Baru Terbuka!
              </span>
              <h4 className="font-bold text-sm text-slate-800 leading-tight">
                {evaluation.badgeDiberikan.namaBadge}
              </h4>
              <p className="text-[11px] text-slate-500 leading-tight line-clamp-1">
                {evaluation.badgeDiberikan.deskripsi}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Educational Praise (Pujian Edukatif) */}
      <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl p-4 sm:p-5">
        <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
          <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
          Pujian Edukatif dari Kak Bintang:
        </span>
        <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
          "{evaluation.pujianEdukatif}"
        </p>
      </div>

      {/* Activity Details & Character Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ringkasan & Bukti */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-600" />
            Catatan Aktivitas & Ulasan Bukti:
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {evaluation.evaluasiKegiatan.ringkasanAktivitas}
          </p>

          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-700 block mb-0.5">Analisis Bukti/Foto:</span>
            {evaluation.evaluasiKegiatan.analisisFotoAtauBukti}
          </div>
        </div>

        {/* Nilai Karakter & Tips Esok Hari */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nilai Karakter Hebat yang Tercermin:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.evaluasiKegiatan.nilaiKarakterUtama.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                >
                  ✨ {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Dorongan Positif & Tips Esok Hari:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {evaluation.doronganPositifDanTips}
            </p>
          </div>
        </div>
      </div>

      {/* Pesan Inspiratif Kak Bintang */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-md">
        <span className="text-2xl shrink-0">🇮🇩</span>
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            Pesan Karakter Kak Bintang:
          </span>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed italic">
            "{evaluation.pesanKakBintang}"
          </p>
        </div>
      </div>

      {/* Teacher Guidance Box if available */}
      {teacherGuidance && (
        <div className="bg-sky-50 border-l-4 border-sky-600 rounded-r-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              Catatan Bimbingan {teacherGuidance.teacherName}:
            </span>
            <span className="font-bold text-[11px] bg-sky-200 text-sky-800 px-2.5 py-0.5 rounded-full">
              {teacherGuidance.guidanceAction}
            </span>
          </div>
          <p className="text-sm text-slate-800 font-medium">
            "{teacherGuidance.feedbackNote}"
          </p>
          {teacherGuidance.additionalTeacherStar && (
            <span className="text-xs text-amber-600 font-bold block pt-1">
              ⭐ Ananda mendapatkan +1 Bintang Kehormatan dari Guru!
            </span>
          )}
        </div>
      )}

      {/* Parent Love Note Box if available */}
      {parentGuidance && (
        <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-2xl p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              Pesan Kasih Sayang dari {parentGuidance.parentName} ({parentGuidance.relationship}):
            </span>
            <span className="font-bold text-[11px] bg-rose-200 text-rose-800 px-2.5 py-0.5 rounded-full">
              💖 {parentGuidance.homeAffirmation}
            </span>
          </div>
          <p className="text-sm text-slate-800 font-medium">
            "{parentGuidance.parentNote}"
          </p>
          {parentGuidance.parentLoveBadge && (
            <span className="text-xs text-rose-600 font-bold block pt-1">
              ❤️ Ananda disematkan Bintang Kasih Sayang Keluarga!
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onOpenCertificate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all hover:scale-102 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Lihat & Cetak Piagam Bintang
        </button>

        <button
          type="button"
          onClick={onNewJournal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all cursor-pointer"
        >
          <span>Tulis Jurnal Kebiasaan Lain</span>
          <ArrowRight className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    </div>
  );
};
