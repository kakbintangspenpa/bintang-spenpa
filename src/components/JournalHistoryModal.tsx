import React from 'react';
import { JournalRecord } from '../types';
import { X, BookOpen, Star, Calendar, Trash2, Award, ChevronRight } from 'lucide-react';
import { playPop } from '../utils/audio';

interface JournalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: JournalRecord[];
  onSelectRecord: (record: JournalRecord) => void;
  onClearHistory: () => void;
}

export const JournalHistoryModal: React.FC<JournalHistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-2 border-amber-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Riwayat Jurnal Karakter</h3>
              <p className="text-xs text-amber-100">
                {records.length} catatan jurnal tersimpan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Journals */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-2xl">
                ⭐
              </div>
              <h4 className="font-bold text-slate-700">Belum Ada Jurnal Tersimpan</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Yuk pilih salah satu dari 7 Kebiasaan Anak Indonesia Hebat dan ceritakan pengalamanmu pada Kak Bintang!
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                onClick={() => {
                  playPop();
                  onSelectRecord(rec);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/40 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-white">
                      #{rec.habitId} {rec.habitName}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {rec.dateString} - {rec.timeRecorded}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    "{rec.journalText}"
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                    <span className="font-bold text-amber-700 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {rec.evaluation.bintangScore} Bintang
                    </span>
                    {rec.evaluation.badgeDiberikan && (
                      <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                        <Award className="w-3 h-3" /> {rec.evaluation.badgeDiberikan.namaBadge}
                      </span>
                    )}
                    {rec.teacherGuidance && (
                      <span className="text-[10px] text-sky-800 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                        👨‍🏫 Ada Catatan Guru
                      </span>
                    )}
                    {rec.parentGuidance && (
                      <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        ❤️ Ada Pesan Cinta Ayah/Bunda
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-amber-600 group-hover:translate-x-1 transition-transform shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {records.length > 0 && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Yakin ingin mengosongkan riwayat jurnal?')) {
                  onClearHistory();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Semua Riwayat
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-700 px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
