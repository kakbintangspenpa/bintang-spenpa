import React from 'react';
import { HABITS_DATA } from '../data/habitsData';
import { HabitInfo } from '../types';
import {
  Sun,
  HeartHandshake,
  Activity,
  Apple,
  BookOpen,
  Users,
  Moon,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { playPop } from '../utils/audio';

interface HabitSelectorProps {
  selectedHabitId: number;
  onSelectHabit: (habit: HabitInfo) => void;
  completedHabitIds?: number[];
}

export const HabitSelector: React.FC<HabitSelectorProps> = ({
  selectedHabitId,
  onSelectHabit,
  completedHabitIds = [],
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Activity':
        return <Activity className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Apple':
        return <Apple className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Users':
        return <Users className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Moon':
        return <Moon className="w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <Sun className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          Pilih Salah Satu Dari 7 Kebiasaan:
        </h3>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {completedHabitIds.length}/7 Kebiasaan Tercatat
        </span>
      </div>

      {/* Mobile Swipe Notice */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-amber-700 font-semibold mb-2 px-1">
        <span>Geser horizontal untuk pilih kebiasaan 👉</span>
        <span>#{selectedHabitId} Aktif</span>
      </div>

      <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 overflow-x-auto pb-2.5 sm:pb-0 no-scrollbar snap-x snap-mandatory">
        {HABITS_DATA.map((habit) => {
          const isSelected = habit.id === selectedHabitId;
          const isCompleted = completedHabitIds.includes(habit.id);

          return (
            <button
              key={habit.id}
              type="button"
              onClick={() => {
                playPop();
                onSelectHabit(habit);
              }}
              className={`relative flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-200 text-center text-xs sm:text-sm font-medium border-2 cursor-pointer w-[125px] sm:w-auto shrink-0 snap-start min-h-[140px] sm:min-h-0 ${
                isSelected
                  ? 'bg-white shadow-md -translate-y-1 scale-102 ring-4 ring-amber-300/40 border-amber-500 text-slate-900'
                  : 'bg-white/80 hover:bg-white hover:border-slate-300 border-slate-200/80 text-slate-600 shadow-sm'
              }`}
            >
              {/* Badge Number */}
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${habit.color.bg}`}
                >
                  #{habit.id}
                </span>

                {isCompleted && (
                  <span title="Sudah dicatat di jurnal!">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  </span>
                )}
              </div>

              {/* Icon */}
              <div
                className={`p-2 rounded-xl mb-2 transition-colors ${
                  isSelected ? `${habit.color.bg} text-white shadow-sm` : 'bg-slate-100 text-slate-700'
                }`}
              >
                {getIcon(habit.icon)}
              </div>

              {/* Title */}
              <span className="font-bold line-clamp-2 leading-tight text-slate-800 text-xs sm:text-sm">
                {habit.name}
              </span>

              {/* Selection pointer */}
              {isSelected && (
                <div className="mt-1 flex items-center text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Dipilih <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
