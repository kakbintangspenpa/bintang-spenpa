import React, { useState } from 'react';
import { KakBintangMascot } from './KakBintangMascot';
import { X, Send, Sparkles, MessageCircle, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { speakKakBintang, stopSpeech, playPop } from '../utils/audio';

interface AskKakBintangModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

const COMMON_QUESTIONS = [
  'Bagaimana caranya supaya tidak mengantuk saat bangun subuh?',
  'Kak, bagaimana kalau aku tidak suka makan sayur bayam?',
  'Bagaimana tips membaca buku tanpa cepat bosan?',
  'Bagaimana cara berhenti main HP sebelum tidur malam?',
  'Kalau temanku mengejekku saat aku berbuat baik, aku harus bagaimana?',
];

export const AskKakBintangModal: React.FC<AskKakBintangModalProps> = ({
  isOpen,
  onClose,
  studentName,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim()) return;
    playPop();
    setIsLoading(true);
    setAnswer(null);

    try {
      const response = await fetch('/api/ask-kak-bintang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryText,
          studentName: studentName || 'Siswa Hebat',
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer('Halo Adik Hebat! Tetap semangat ya, Kak Bintang selalu bangga padamu! Coba ulangi pertanyaannya sebentar lagi ya.');
      }
    } catch (e) {
      console.error(e);
      setAnswer('Mohon maaf, koneksi sedang sibuk. Tapi ingat, anak Indonesia hebat tidak mudah menyerah! Coba lagi ya.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (!answer) return;
    playPop();
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakKakBintang(answer, () => setIsPlayingAudio(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-2 border-amber-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Tanya Kak Bintang</h3>
              <p className="text-xs text-amber-100">
                Konsultasi & tips 7 kebiasaan anak hebat
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

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
            <KakBintangMascot size="sm" showVoiceButton={false} />
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              "Halo <strong>{studentName || 'Sahabat Bintang'}</strong>! Ada kesulitan atau rasa penasaran tentang 7 Kebiasaan Anak Indonesia Hebat? Tanyakan pada Kak Bintang ya!"
            </p>
          </div>

          {/* Quick Questions buttons */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Contoh Pertanyaan yang Sering Ditanyakan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(q);
                    handleAsk(q);
                  }}
                  className="text-xs text-left px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 transition border border-slate-200/80 cursor-pointer"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>

          {/* Answer Box */}
          {isLoading && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-center gap-2 text-amber-800 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
              <span>Kak Bintang sedang merangkai nasehat hangat untukmu...</span>
            </div>
          )}

          {answer && !isLoading && (
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Jawaban Hangat Kak Bintang:
                </span>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" /> Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" /> Dengarkan Suara 🔊
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {answer}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk(question);
            }}
            placeholder="Ketik pertanyaanmu untuk Kak Bintang di sini..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
          />
          <button
            type="button"
            onClick={() => handleAsk(question)}
            disabled={isLoading || !question.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold transition shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
