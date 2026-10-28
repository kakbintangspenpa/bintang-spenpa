import React from 'react';
import { HABITS_DATA } from '../data/habitsData';
import { HabitInfo, BadgeInfo, JournalRecord } from '../types';
import {
  Star,
  Award,
  CheckCircle2,
  CircleDashed,
  Flame,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { playPop } from '../utils/audio';

interface HabitsTrackerMatrixProps {
  completedHabitIds: number[];
  unlockedBadges: BadgeInfo[];
  totalStars: number;
  streakDays: number;
  journalRecords: JournalRecord[];
  onSelectHabitToFill: (habit: HabitInfo) => void;
}

export const HabitsTrackerMatrix: React.FC<HabitsTrackerMatrixProps> = ({
  completedHabitIds,
  unlockedBadges,
  totalStars,
  streakDays,
  journalRecords,
  onSelectHabitToFill,
}) => {
  const completionPercentage = Math.round((completedHabitIds.length / 7) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Stars */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Bintang Terkumpul
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-900 leading-tight">
              {totalStars} ⭐
            </span>
          </div>
        </div>

        {/* Streak Days */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block">
              Runtutan Hari
            </span>
            <span className="text-xl sm:text-2xl font-black text-orange-900 leading-tight">
              {streakDays} Hari 🔥
            </span>
          </div>
        </div>

        {/* Habits Done Today */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Progres 7 Kebiasaan
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-900 leading-tight">
              {completedHabitIds.length} / 7
            </span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
              Koleksi Lencana
            </span>
            <span className="text-xl sm:text-2xl font-black text-purple-900 leading-tight">
              {unlockedBadges.length} Lencana
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Capaian 7 Kebiasaan Anak Indonesia Hebat:
          </span>
          <span className="text-amber-700">{completionPercentage}% Tercapai</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(5, completionPercentage)}%` }}
          />
        </div>
      </div>

      {/* 7 Habits Checklist Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-amber-600" />
          Daftar Pantau 7 Kebiasaan Hari Ini:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {HABITS_DATA.map((habit) => {
            const isCompleted = completedHabitIds.includes(habit.id);
            const habitJournal = journalRecords.find((r) => r.habitId === habit.id);

            return (
              <div
                key={habit.id}
                onClick={() => {
                  playPop();
                  onSelectHabitToFill(habit);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-400 text-slate-800 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCompleted ? 'bg-emerald-600 text-white' : `${habit.color.bg} text-white opacity-80`
                    }`}
                  >
                    #{habit.id}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                      {habit.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {isCompleted
                        ? `Tercatat: ${habitJournal?.timeRecorded || 'Hari ini'} (${habitJournal?.evaluation.bintangScore || 5} ⭐)`
                        : habit.tagline}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg hover:bg-amber-200">
                      + Isi
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase Gallery */}
      {unlockedBadges.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            Lencana Karakter yang Sudah Diraih:
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {unlockedBadges.map((badge, idx) => (
              <div
                key={idx}
                className="p-3 bg-gradient-to-b from-purple-50 to-white border border-purple-200 rounded-2xl flex flex-col items-center text-center space-y-1 shadow-2xs hover:scale-102 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-xs text-purple-950 line-clamp-1">{badge.namaBadge}</h5>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                  {badge.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
