import React from 'react';
import { KakBintangEvaluation, TeacherGuidance } from '../types';
import { X, Printer, Award, Star, Sparkles, Check, GraduationCap } from 'lucide-react';
import { playPop } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: KakBintangEvaluation | null;
  studentName: string;
  grade: string;
  teacherGuidance?: TeacherGuidance | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  evaluation,
  studentName,
  grade,
  teacherGuidance,
}) => {
  if (!isOpen || !evaluation) return null;

  const handlePrint = () => {
    playPop();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto flex flex-col shadow-2xl border-2 border-amber-300">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="print:hidden p-3.5 bg-amber-500 text-white flex items-center justify-between">
          <span className="font-bold text-sm flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Piagam Apresiasi Karakter Anak Indonesia Hebat
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white text-amber-900 font-bold text-xs shadow-xs hover:bg-amber-50 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" /> Cetak / Unduh PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div id="certificate-print-area" className="p-3 sm:p-8 md:p-10 bg-[#fffdfa] relative">
          {/* Certificate Double Border */}
          <div className="border-4 border-amber-600/80 rounded-2xl p-3.5 sm:p-7 md:p-8 relative bg-white shadow-inner">
            <div className="absolute inset-1.5 border border-amber-300 rounded-xl pointer-events-none" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-500 text-lg">✦</div>
            <div className="absolute top-2 right-2 text-amber-500 text-lg">✦</div>
            <div className="absolute bottom-2 left-2 text-amber-500 text-lg">✦</div>
            <div className="absolute bottom-2 right-2 text-amber-500 text-lg">✦</div>

            {/* Red & White Indonesian Ribbon Bar */}
            <div className="flex justify-center mb-4">
              <div className="flex h-2.5 w-32 rounded-full overflow-hidden shadow-xs">
                <div className="w-1/2 bg-red-600" />
                <div className="w-1/2 bg-slate-100 border-l border-slate-200" />
              </div>
            </div>

            {/* Header Title */}
            <div className="text-center space-y-1 mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700">
                GERAKAN 7 KEBIASAAN ANAK INDONESIA HEBAT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                PIAGAM BINTANG KARAKTER
              </h2>
              <p className="text-xs text-slate-500 italic">
                Nomor: KB-7K/{new Date().getFullYear()}/{evaluation.habitId}
              </p>
            </div>

            {/* Recipient */}
            <div className="text-center space-y-2 mb-6">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Piagam apresiasi ini dengan bangga dianugerahkan kepada:
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-amber-700 underline decoration-amber-300 decoration-wavy underline-offset-8">
                {studentName || 'Bintang Hebat'}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {grade || 'Sekolah Dasar Indonesia'}
              </p>
            </div>

            {/* Achievement details */}
            <div className="text-center max-w-lg mx-auto space-y-3 mb-6 bg-amber-50/50 p-4 rounded-xl border border-amber-200/80">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Telah berhasil menjalankan dan mencatatkan jurnal harian:
                <br />
                <strong className="text-slate-900 text-sm sm:text-base">
                  Kebiasaan #{evaluation.habitId}: "{evaluation.habitName}"
                </strong>
              </p>

              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= evaluation.bintangScore
                        ? 'text-amber-500 fill-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-amber-900 ml-1">
                  ({evaluation.bintangScore}/5 Bintang)
                </span>
              </div>

              {evaluation.badgeDiberikan && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-300 text-xs font-bold text-purple-900">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  Meraih Lencana: {evaluation.badgeDiberikan.namaBadge}
                </div>
              )}
            </div>

            {/* Teacher Endorsement Callout if reviewed */}
            {teacherGuidance && (
              <div className="mb-4 bg-sky-50 border border-sky-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sky-900">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-sky-700 shrink-0" />
                  <div>
                    <span className="font-extrabold uppercase tracking-wider block text-[10px] text-sky-700">
                      Disahkan Guru Pembina ({teacherGuidance.teacherName}):
                    </span>
                    <span className="font-medium italic">"{teacherGuidance.feedbackNote}"</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 font-bold bg-white px-2.5 py-1 rounded-lg border border-sky-300 text-sky-800 text-[11px]">
                  <span>🏆 {teacherGuidance.guidanceAction}</span>
                  {teacherGuidance.additionalTeacherStar && <span>⭐ +1 Bintang Guru</span>}
                </div>
              </div>
            )}

            {/* Footer with Seals & Signatures */}
            <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-slate-200 text-xs">
              {/* Official Gold Seal */}
              <div className="flex items-center gap-2">
                <div className="w-14 h-14 rounded-full border-2 border-amber-500 bg-amber-50 flex flex-col items-center justify-center text-amber-800 text-[9px] font-black uppercase text-center p-1 shadow-xs">
                  <span>RESMI</span>
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>HEBAT</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <p className="font-bold text-slate-700">Terverifikasi</p>
                  <p>{currentDate}</p>
                </div>
              </div>

              {/* Teacher Signature if available */}
              {teacherGuidance && (
                <div className="text-center space-y-1">
                  <div className="font-serif italic text-xs text-sky-800 font-bold h-6 flex items-center justify-center">
                    Disetujui & Dibimbing
                  </div>
                  <div className="w-28 border-b-2 border-slate-400 mx-auto" />
                  <p className="font-bold text-slate-800 text-[11px]">{teacherGuidance.teacherName}</p>
                  <p className="text-[10px] text-sky-700 font-semibold">Guru Pembina Karakter</p>
                </div>
              )}

              {/* Kak Bintang Signature */}
              <div className="text-center space-y-1">
                <div className="font-cursive text-lg text-amber-700 italic select-none">
                  Kak Bintang ✨
                </div>
                <div className="w-28 border-b-2 border-slate-400 mx-auto" />
                <p className="font-bold text-slate-800 text-[11px]">Kak Bintang 👦🏻</p>
                <p className="text-[10px] text-slate-500">Pembina Karakter Anak Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
