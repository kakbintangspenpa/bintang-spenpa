import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Gauge,
  Sliders,
  Music,
  Sparkles,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  VoiceSettings,
  getSavedVoiceSettings,
  saveVoiceSettings,
  speakKakBintang,
  stopSpeech,
  playPop,
} from '../utils/audio';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [settings, setSettings] = useState<VoiceSettings>(getSavedVoiceSettings());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    playPop();
    setIsTesting(true);
    const testSample =
      'Halo Bintang Hebat! Aku Kak Bintang. Siap membimbingmu mengamalkan 7 kebiasaan anak Indonesia yang berkarakter unggul!';
    speakKakBintang(testSample, () => setIsTesting(false), settings);
  };

  const handleSave = () => {
    playPop();
    saveVoiceSettings(settings);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    playPop();
    const defaultSettings: VoiceSettings = {
      rate: 1.05,
      pitch: 0.95,
      preset: 'semangat',
    };
    setSettings(defaultSettings);
    saveVoiceSettings(defaultSettings);
  };

  const tempoPresets = [
    { label: 'Santai', value: 0.88, desc: 'Perlahan & tenang' },
    { label: 'Normal', value: 1.0, desc: 'Kecepatan wajar' },
    { label: 'Semangat', value: 1.08, desc: 'Lincah & ceria (Direkomendasikan)' },
    { label: 'Cepat', value: 1.22, desc: 'Cepat & energik' },
  ];

  const pitchPresets = [
    { label: 'Kakak Hangat', value: 0.92, desc: 'Karakter siswa laki-laki hangat' },
    { label: 'Natural', value: 1.0, desc: 'Nada wajar' },
    { label: 'Ceria & Riang', value: 1.08, desc: 'Lebih youthful & berbinar' },
  ];

  // Filter Indonesian voices
  const indoVoices = availableVoices.filter(
    (v) => v.lang.startsWith('id') || v.lang.includes('ID')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-2 border-amber-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Atur Suara & Tempo Kak Bintang</h3>
              <p className="text-xs text-amber-100">
                Sesuaikan tempo dan karakter suara Kak Bintang
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Controls */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Tempo (Kecepatan Suara) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-amber-600" />
                Tempo Bicara (Kecepatan):
              </label>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {settings.rate.toFixed(2)}x
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={settings.rate}
              onChange={(e) =>
                setSettings({ ...settings, rate: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {tempoPresets.map((preset) => {
                const isActive = Math.abs(settings.rate - preset.value) < 0.03;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      playPop();
                      setSettings({ ...settings, rate: preset.value });
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-amber-50 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Nada Suara (Pitch) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-600" />
                Karakter Nada Suara (Pitch):
              </label>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {settings.pitch.toFixed(2)}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0.8"
              max="1.25"
              step="0.05"
              value={settings.pitch}
              onChange={(e) =>
                setSettings({ ...settings, pitch: parseFloat(e.target.value) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />

            {/* Quick Presets */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {pitchPresets.map((preset) => {
                const isActive = Math.abs(settings.pitch - preset.value) < 0.03;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      playPop();
                      setSettings({ ...settings, pitch: preset.value });
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-amber-50 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Pilihan Suara Browser (Voice Engine) */}
          {availableVoices.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                Mesin Suara Terpasang di Browser:
              </label>
              <select
                value={settings.voiceURI || ''}
                onChange={(e) =>
                  setSettings({ ...settings, voiceURI: e.target.value || undefined })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="">Otomatis (Dipilihkan Suara Bahasa Indonesia Terbaik)</option>
                {indoVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    🇮🇩 {v.name} ({v.lang})
                  </option>
                ))}
                {availableVoices
                  .filter((v) => !v.lang.startsWith('id'))
                  .slice(0, 5)
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      🌐 {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
              <p className="text-[10px] text-slate-400">
                *Kak Bintang memprioritaskan suara pria berbahasa Indonesia yang bersahabat.
              </p>
            </div>
          )}

          {/* Test Voice Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestVoice}
              className={`w-full py-2.5 px-4 rounded-xl border-2 border-amber-400 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                isTesting
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>{isTesting ? 'Sedang Memperdengarkan...' : 'Uji Coba Suara Kak Bintang 🔊'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="text-xs font-bold text-slate-700 px-3 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-bold text-white px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{showSavedToast ? 'Tersimpan!' : 'Simpan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
