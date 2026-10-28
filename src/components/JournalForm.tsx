import React, { useState, useRef } from 'react';
import { HabitInfo } from '../types';
import { SAMPLE_JOURNAL_PRESETS, SampleJournalPreset } from '../utils/sampleJournals';
import {
  Upload,
  Camera,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
  X,
  FileText,
  Clock,
  User,
  GraduationCap,
  Info,
} from 'lucide-react';
import { playPop, playSparkleSound } from '../utils/audio';

interface JournalFormProps {
  currentHabit: HabitInfo;
  studentName: string;
  setStudentName: (name: string) => void;
  grade: string;
  setGrade: (grade: string) => void;
  onSubmit: (formData: {
    habitId: number;
    habitName: string;
    studentName: string;
    grade: string;
    journalText: string;
    timeRecorded: string;
    imageBase64: string | null;
    imageMimeType: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const JournalForm: React.FC<JournalFormProps> = ({
  currentHabit,
  studentName,
  setStudentName,
  grade,
  setGrade,
  onSubmit,
  isLoading,
}) => {
  const [journalText, setJournalText] = useState('');
  const [timeRecorded, setTimeRecorded] = useState('06:00 WIB');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState('image/jpeg');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Filter sample presets matching this habit or generic
  const relevantPresets = SAMPLE_JOURNAL_PRESETS.filter(
    (p) => p.habitId === currentHabit.id
  );

  const handleApplyPreset = (preset: SampleJournalPreset) => {
    playPop();
    setJournalText(preset.journalText);
    setStudentName(preset.studentName);
    setGrade(preset.grade);
    setTimeRecorded(preset.timeRecorded);
    const pngDataUrl = preset.getPngDataUrl();
    setImageBase64(pngDataUrl);
    setImageMimeType('image/png');
    setImagePreviewUrl(pngDataUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorNotice('Ukuran file maksimal 10MB ya.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result);
      setImagePreviewUrl(result);
      setImageMimeType(file.type || 'image/jpeg');
      setErrorNotice(null);
      playPop();
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setImageBase64(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Voice dictation using Web Speech Recognition
  const toggleVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Browser kamu belum mendukung input suara otomatis. Kamu tetap bisa mengetik cerita ya!');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        playPop();
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setJournalText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed', e);
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!journalText.trim() && !imageBase64) {
      setErrorNotice('Yuk tulis cerita kegiatanmu atau unggah foto untuk dinilai Kak Bintang!');
      return;
    }

    playSparkleSound();
    await onSubmit({
      habitId: currentHabit.id,
      habitName: currentHabit.name,
      studentName: studentName.trim() || 'Siswa Hebat',
      grade: grade.trim() || 'Sekolah Dasar',
      journalText: journalText.trim(),
      timeRecorded: timeRecorded.trim(),
      imageBase64,
      imageMimeType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-4 sm:p-6 space-y-5">
      {/* Habit Header Banner */}
      <div className={`p-4 rounded-2xl border ${currentHabit.color.light} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${currentHabit.color.bg}`}>
              Kebiasaan #{currentHabit.id}
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
              {currentHabit.name}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 italic">
            "{currentHabit.tagline}"
          </p>
        </div>

        {/* Preset Button if available */}
        {relevantPresets.length > 0 && (
          <button
            type="button"
            onClick={() => handleApplyPreset(relevantPresets[0])}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Isi Contoh Otomatis
          </button>
        )}
      </div>

      {/* Student Profile Info Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-600" /> Nama Siswa:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Contoh: Dimas Aditya"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-50/50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-amber-600" /> Kelas / Sekolah:
          </label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Contoh: Kelas 4 SDN Merdeka"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Waktu Kegiatan:
          </label>
          <input
            type="text"
            value={timeRecorded}
            onChange={(e) => setTimeRecorded(e.target.value)}
            placeholder="Contoh: 05:30 WIB"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-50/50"
          />
        </div>
      </div>

      {/* Habit Prompt Questions Helper */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-slate-700 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Panduan Cerita dari Kak Bintang:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-xs">
          {currentHabit.samplePrompts.map((prompt, idx) => (
            <li key={idx}>{prompt}</li>
          ))}
        </ul>
      </div>

      {/* Journal Text Area */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600" />
            Catatan Jurnal Kegiatanmu:
          </label>

          {/* Voice to text button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Dikte lewat suara (bicara langsung)"
          >
            {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-600" />}
            {isRecording ? 'Mendengarkan...' : 'Ketik Suara 🎤'}
          </button>
        </div>

        <textarea
          rows={4}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder={`Ceritakan apa yang kamu lakukan terkait kebiasaan "${currentHabit.name}" hari ini... (Misal: kegiatanmu, perasaanmu, atau siapa yang kamu bantu)`}
          className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none placeholder:text-slate-400 resize-y"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>*Cerita singkat maupun panjang akan tetap diapresiasi penuh oleh Kak Bintang!</span>
          <span>{journalText.length} karakter</span>
        </div>
      </div>

      {/* Photo Upload & Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-amber-600" />
            Foto Bukti Kegiatan (Opsional):
          </label>
          <span className="text-[11px] text-slate-500">
            {currentHabit.suggestedPhoto}
          </span>
        </div>

        {imagePreviewUrl ? (
          <div className="relative inline-block border-2 border-amber-300 rounded-2xl overflow-hidden shadow-sm bg-slate-50 group">
            <img
              src={imagePreviewUrl}
              alt="Bukti Kegiatan"
              className="w-full max-w-xs h-44 object-contain rounded-xl bg-white p-2"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition cursor-pointer"
              title="Hapus foto"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="px-3 py-1.5 bg-amber-50 text-[11px] font-bold text-amber-800 border-t border-amber-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Foto siap dianalisis Kak Bintang!
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-amber-50/30 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-700">
                Klik untuk unggah foto atau ambil dengan kamera
              </div>
              <p className="text-[11px] text-slate-400">
                Format JPG, PNG, atau WebP (Bisa foto kasur rapi, sarapan sehat, buku bacaan, dll.)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-red-500" />
          {errorNotice}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-white text-base shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLoading
              ? 'bg-amber-400 cursor-wait'
              : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Kak Bintang Sedang Menganalisis Jurnalmu...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Minta Penilaian & Pujian dari Kak Bintang ⭐</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
