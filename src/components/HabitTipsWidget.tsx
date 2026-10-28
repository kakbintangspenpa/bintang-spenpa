import React, { useState } from 'react';
import { HabitInfo } from '../types';
import {
  Lightbulb,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  CheckCircle2,
  Circle,
  Quote,
  Target,
  ChevronRight,
} from 'lucide-react';
import { speakKakBintang, stopSpeech, playPop, playSparkleSound } from '../utils/audio';

interface HabitTipsWidgetProps {
  currentHabit: HabitInfo;
}

export const HabitTipsWidget: React.FC<HabitTipsWidgetProps> = ({ currentHabit }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [completedTipIdxs, setCompletedTipIdxs] = useState<number[]>([]);
  const [isChallengeDone, setIsChallengeDone] = useState(false);

  const handleToggleVoice = () => {
    playPop();
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `Berikut tips dari Kak Bintang untuk ${currentHabit.name}: ${currentHabit.specificTips.join('. ')}. Tantangan hari ini: ${currentHabit.dailyChallenge}. Ingat: ${currentHabit.motivationalQuote}`;
      speakKakBintang(textToSpeak, () => setIsPlayingAudio(false));
    }
  };

  const toggleTip = (idx: number) => {
    playPop();
    if (completedTipIdxs.includes(idx)) {
      setCompletedTipIdxs(completedTipIdxs.filter((i) => i !== idx));
    } else {
      setCompletedTipIdxs([...completedTipIdxs, idx]);
      playSparkleSound();
    }
  };

  const toggleChallenge = () => {
    playPop();
    setIsChallengeDone(!isChallengeDone);
    if (!isChallengeDone) {
      playSparkleSound();
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-md p-5 space-y-4.5 transition-all">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">
              Tips Kebiasaan
            </h3>
            <span className="text-[11px] font-semibold text-amber-700">
              #{currentHabit.id} {currentHabit.name}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
          title="Dengarkan tips ini dibacakan Kak Bintang"
        >
          {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-3 rounded-2xl border border-amber-200/80 text-xs text-slate-700 flex items-start gap-2">
        <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="italic font-medium leading-relaxed text-amber-950">
          "{currentHabit.motivationalQuote}"
        </p>
      </div>

      {/* Specific Practical Tips List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Saran Praktis & Spesifik:
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            Centang yang sudah kamu coba
          </span>
        </div>

        <div className="space-y-2">
          {currentHabit.specificTips.map((tip, idx) => {
            const isDone = completedTipIdxs.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => toggleTip(idx)}
                className={`p-2.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 ${
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-amber-50/40 text-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <span className={`font-medium ${isDone ? 'line-through opacity-80' : ''}`}>
                  {tip}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenge Card */}
      <div
        onClick={toggleChallenge}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
          isChallengeDone
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
            : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-amber-300 hover:border-amber-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
            <Target className="w-3.5 h-3.5 text-amber-600" />
            Tantangan Karakter Hari Ini:
          </span>
          {isChallengeDone ? (
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Berhasil!
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Yuk Coba!
            </span>
          )}
        </div>
        <p className="text-xs font-bold text-slate-800 leading-snug">
          {currentHabit.dailyChallenge}
        </p>
        <p className="text-[10px] text-slate-500 italic">
          *Klik di sini jika kamu berhasil menaklukkan tantangan ini hari ini!
        </p>
      </div>
    </div>
  );
};
