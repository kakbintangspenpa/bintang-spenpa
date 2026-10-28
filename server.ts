import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateJournalPedagogical, getQuickAnswerFromKakBintang } from './src/utils/pedagogicalEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON with generous limit for base64 images
app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI server-side with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// JSON Schema definition for Kak Bintang's evaluation
const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN,
      description: 'Apakah jurnal atau foto ini mencerminkan aktivitas positif yang nyata dan sesuai dengan kebiasaan yang dipilih.',
    },
    validityLevel: {
      type: Type.STRING,
      description: 'Tingkat validitas: VALID (kegiatan jelas & terbukti), PERLU_DILENGKAPI (kegiatan baik tapi ceritanya sangat singkat), atau KURANG_SESUAI (kurang berhubungan dengan kebiasaan tapi tetap diapresiasi).',
    },
    habitId: {
      type: Type.INTEGER,
      description: 'Nomor kebiasaan dari 1 sampai 7.',
    },
    habitName: {
      type: Type.STRING,
      description: 'Nama dari kebiasaan yang dijalankan.',
    },
    sapaanHangat: {
      type: Type.STRING,
      description: 'Sapaan ceria dan ramah khas Kak Bintang untuk siswa, misalnya menyapa nama siswa dengan sebutan Bintang Hebat.',
    },
    pujianEdukatif: {
      type: Type.STRING,
      description: 'Pujian hangat, spesifik, dan edukatif atas usaha dan tindakan positif yang diceritakan siswa atau terlihat di foto.',
    },
    evaluasiKegiatan: {
      type: Type.OBJECT,
      properties: {
        ringkasanAktivitas: {
          type: Type.STRING,
          description: 'Rangkuman singkat dan jelas mengenai aktivitas yang dilakukan anak.',
        },
        analisisFotoAtauBukti: {
          type: Type.STRING,
          description: 'Ulasan mengenai foto yang diunggah (apa yang tampak) atau catatan jika siswa belum mengunggah foto.',
        },
        nilaiKarakterUtama: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Daftar nilai karakter baik yang tercermin (misal: Disiplin, Tanggung Jawab, Kejujuran, Gotong Royong, Kemandirian, Rasa Ingin Tahu).',
        },
      },
      required: ['ringkasanAktivitas', 'analisisFotoAtauBukti', 'nilaiKarakterUtama'],
    },
    bintangScore: {
      type: Type.INTEGER,
      description: 'Jumlah bintang prestasi (skala 1-5). Berikan minimal 3 bintang dorongan meskipun cerita singkat agar anak tetap termotivasi!',
    },
    badgeDiberikan: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING, description: 'ID lencana unik' },
        namaBadge: { type: Type.STRING, description: 'Nama lencana yang memikat dan membanggakan anak' },
        iconType: { type: Type.STRING, description: 'Jenis ikon seperti sun, heart, book, zap, trophy, smile, star, shield' },
        deskripsi: { type: Type.STRING, description: 'Alasan lencana ini diberikan kepada anak' },
      },
      required: ['id', 'namaBadge', 'iconType', 'deskripsi'],
    },
    doronganPositifDanTips: {
      type: Type.STRING,
      description: 'Saran praktis, menyenangkan, dan dorongan positif untuk melanjutkan kebiasaan ini besok hari. Tanpa menghakimi atau mengkritik kasar.',
    },
    pesanKakBintang: {
      type: Type.STRING,
      description: 'Kalimat penutup yang membakar semangat, hangat, dengan kutipan motivasi anak Indonesia hebat.',
    },
  },
  required: [
    'isValid',
    'validityLevel',
    'habitId',
    'habitName',
    'sapaanHangat',
    'pujianEdukatif',
    'evaluasiKegiatan',
    'bintangScore',
    'badgeDiberikan',
    'doronganPositifDanTips',
    'pesanKakBintang',
  ],
};

// API Endpoint to analyze journal
app.post('/api/analyze-journal', async (req, res) => {
  try {
    const {
      studentName = 'Siswa Hebat',
      grade = 'Sekolah Dasar',
      habitId = 1,
      habitName = 'Bangun Pagi',
      journalText = '',
      timeRecorded = '',
      imageBase64 = null,
      imageMimeType = 'image/jpeg',
    } = req.body;

    if (!journalText && !imageBase64) {
      return res.status(400).json({
        error: 'Mohon tulis cerita jurnalmu atau sertakan foto kegiatan ya!',
      });
    }

    const systemInstruction = `
Kamu adalah "Kak Bintang", asisten pembina karakter anak Indonesia yang ramah, hangat, komunikatif, dan penuh semangat!
Tugasmu adalah menganalisis input jurnal harian siswa tentang "7 Kebiasaan Anak Indonesia Hebat":
1. Bangun Pagi (Melatih disiplin dan kesiapan menghadapi hari)
2. Beribadah (Memperkuat iman, moral, doa, dan rasa syukur)
3. Berolahraga (Menjaga kebugaran jasmani dan jiwa sehat)
4. Makan Sehat dan Bergizi (Pola makan seimbang, sarapan, buah & sayur)
5. Gemar Belajar (Rasa ingin tahu tinggi, rajin membaca, mengasah keterampilan)
6. Bermasyarakat (Bersosialisasi, tolong-menolong, sopan santun, empati)
7. Tidur Lebih Awal (Istirahat cukup tepat waktu untuk regenerasi tubuh)

Aturan Respon:
1. Gunakan bahasa Indonesia yang ramah anak, mudah dipahami, hangat, santun, dan memotivasi.
2. Jangan pernah mengkritik dengan kasar. Jika input siswa kurang sesuai atau terlalu singkat, berikan dorongan positif yang membangkitkan rasa percaya diri mereka!
3. Jika siswa menyertakan foto, amatilah foto dengan cermat, sebutkan detail positif yang terlihat di foto tersebut dalam analisis.
4. Nilai validitas input secara edukatif (VALID jika mencerminkan kebiasaan dengan jelas, PERLU_DILENGKAPI jika cerita sangat ringkas namun beritikad baik, KURANG_SESUAI jika topiknya berbeda namun tetap apresiasi kejujuran mereka).
5. Selalu berikan keluaran sesuai dengan JSON Schema yang ditentukan.
`;

    const userPrompt = `
Nama Siswa: ${studentName}
Tingkat/Kelas: ${grade}
Kebiasaan yang dipilih: Kebiasaan ke-${habitId} (${habitName})
Waktu aktivitas: ${timeRecorded || 'Hari ini'}
Cerita Jurnal Siswa:
"${journalText}"

${imageBase64 ? 'Siswa juga melampirkan foto bukti kegiatan.' : 'Siswa mengisi melalui jurnal teks.'}

Berikan evaluasi, pujian edukatif, lencana, skor bintang, dan dorongan hangat sebagai Kak Bintang sesuai format JSON schema!
`;

    const parts: any[] = [];

    let hasImagePart = false;

    if (imageBase64 && typeof imageBase64 === 'string') {
      try {
        let cleanBase64 = imageBase64.trim();
        let validMimeType = (imageMimeType || 'image/jpeg').toLowerCase();

        // Extract base64 and mime type from data URI if present
        const dataUriMatch = cleanBase64.match(/^data:([^;,]+)(?:;[^;,]+)*;base64,(.+)$/is);
        if (dataUriMatch) {
          validMimeType = dataUriMatch[1].toLowerCase();
          cleanBase64 = dataUriMatch[2].trim();
        } else {
          // If prefixed with generic data: or url-encoded
          cleanBase64 = cleanBase64.replace(/^data:[^,]+,/, '').trim();
        }

        // Gemini only supports raster images: image/jpeg, image/png, image/webp, image/heic, image/heif
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
        if (!allowedMimes.includes(validMimeType)) {
          validMimeType = 'image/png';
        }

        // Strip any whitespace
        cleanBase64 = cleanBase64.replace(/\s+/g, '');

        if (cleanBase64.length > 32) {
          parts.push({
            inlineData: {
              mimeType: validMimeType,
              data: cleanBase64,
            },
          });
          hasImagePart = true;
        }
      } catch (imgError) {
        console.warn('Could not parse image data, will proceed with text prompt only:', imgError);
      }
    }

    parts.push({
      text: userPrompt,
    });

    let response;
    // If no API key is configured, immediately return rich pedagogical fallback
    if (!process.env.GEMINI_API_KEY) {
      console.info('No GEMINI_API_KEY found, generating authentic pedagogical evaluation...');
      const fallbackEvaluation = evaluateJournalPedagogical({
        studentName,
        grade,
        habitId,
        habitName,
        journalText,
        timeRecorded,
        hasPhoto: hasImagePart,
      });
      return res.json({
        success: true,
        data: fallbackEvaluation,
      });
    }

    try {
      // Set a race promise with timeout so it never hangs
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI response timeout')), 7000)
      );

      const aiCallPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: evaluationSchema,
          temperature: 0.7,
        },
      });

      response = (await Promise.race([aiCallPromise, timeoutPromise])) as any;
    } catch (primaryErr: any) {
      // If error happened due to image decoding/format and we had an image, retry with text only
      if (hasImagePart) {
        console.warn('Image processing failed with Gemini, retrying with text prompt only...', primaryErr.message);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: { parts: [{ text: userPrompt }] },
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: evaluationSchema,
              temperature: 0.7,
            },
          });
        } catch (retryErr: any) {
          throw retryErr;
        }
      } else {
        throw primaryErr;
      }
    }

    const outputText = response?.text;
    if (!outputText) {
      throw new Error('Tidak ada respon yang dihasilkan dari model.');
    }

    const parsedJson = JSON.parse(outputText);
    return res.json({
      success: true,
      data: parsedJson,
    });
  } catch (error: any) {
    console.warn('Gemini notice during journal analysis, using authentic pedagogical evaluation:', error.message);
    const {
      studentName = 'Siswa Hebat',
      grade = 'Sekolah Dasar',
      habitId = 1,
      habitName = 'Bangun Pagi',
      journalText = '',
      timeRecorded = '',
      imageBase64 = null,
    } = req.body || {};

    const fallbackEvaluation = evaluateJournalPedagogical({
      studentName,
      grade,
      habitId,
      habitName,
      journalText,
      timeRecorded,
      hasPhoto: !!imageBase64,
    });

    return res.json({
      success: true,
      data: fallbackEvaluation,
    });
  }
});

// Endpoint for Kak Bintang Quick Q&A / Habit Advice
app.post('/api/ask-kak-bintang', async (req, res) => {
  try {
    const { question, studentName = 'Adik Hebat', habitContext = '' } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        answer: getQuickAnswerFromKakBintang(question, studentName, habitContext),
      });
    }

    const systemInstruction = `
Kamu adalah "Kak Bintang", pembina karakter anak Indonesia yang penuh kasih, ceria, bijaksana, dan bersahabat.
Jawablah pertanyaan anak tentang cara mempraktikkan 7 Kebiasaan Anak Indonesia Hebat dengan bahasa yang mudah dipahami anak usia SD/SMP, beri contoh nyata dalam kehidupan sehari-hari, dan sertakan kata-kata penyemangat serta salam hangat.
Gunakan format teks rapi dengan emoji yang ramah anak.
`;

    const prompt = `Nama siswa: ${studentName}. Topik kebiasaan: ${habitContext || 'Umum'}. Pertanyaan siswa: "${question}". Jawablah dengan hangat sebagai Kak Bintang!`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 5000)
    );

    const aiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = (await Promise.race([aiCall, timeoutPromise])) as any;

    return res.json({
      success: true,
      answer: response.text,
    });
  } catch (error: any) {
    console.warn('Error in ask-kak-bintang, using pedagogical fallback:', error.message);
    const { question = '', studentName = 'Adik Hebat', habitContext = '' } = req.body || {};
    return res.json({
      success: true,
      answer: getQuickAnswerFromKakBintang(question, studentName, habitContext),
    });
  }
});

// Endpoint for Teacher Guidance Auto-Draft Assistant
app.post('/api/generate-teacher-guidance', async (req, res) => {
  try {
    const {
      studentName = 'Siswa',
      grade = 'Kelas 4',
      habitName = 'Bangun Pagi',
      journalText = '',
      teacherName = 'Ibu Guru',
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: {
          feedbackNote: `Bagus sekali ${studentName}! Ibu/Bapak Guru sangat bangga dengan komitmenmu menjalankan pembiasaan ${habitName}. Terus pertahankan kedisiplinan dan akhlak muliamu setiap hari ya!`,
          guidanceAction: 'Apresiasi Di Kelas',
          reflectionPoint: `Bagaimana caramu mengajak teman sebangkumu untuk bersama-sama membiasakan ${habitName} ini?`,
        },
      });
    }

    const systemInstruction = `
Kamu adalah asisten pedagogis untuk guru dan pembina karakter anak Indonesia (SD/SMP).
Tugasmu adalah membantu guru menyusun "Catatan Bimbingan & Apresiasi Guru" untuk siswa terkait pembiasaan "7 Kebiasaan Anak Indonesia Hebat".
Gunakan bahasa guru Indonesia yang penuh kasih, bijak, membangun rasa percaya diri anak, dan memberikan arahan konkret yang mudah diamalkan.
Berikan respon berformat JSON yang valid:
{
  "feedbackNote": "Catatan bimbingan dari guru yang hangat, menyebut nama siswa, memuji usahanya, dan memberi nasihat yang mendidik (2-3 kalimat)",
  "guidanceAction": "Apresiasi Di Kelas" | "Perlu Pendampingan Lanjutan" | "Tingkatkan Variasi Aktivitas" | "Sempurna & Jadi Teladan",
  "reflectionPoint": "Satu pertanyaan atau renungan sederhana untuk siswa pikirkan agar kebiasaannya makin bermakna"
}
`;

    const prompt = `Nama Siswa: ${studentName}. Kelas: ${grade}. Guru: ${teacherName}. Kebiasaan: ${habitName}.
Jurnal Siswa: "${journalText}".
Buat draf catatan bimbingan guru dan rekomendasi tindakan dalam format JSON.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 5000)
    );

    const aiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const response = (await Promise.race([aiCall, timeoutPromise])) as any;
    const outputText = response.text;
    if (!outputText) throw new Error('Gagal membuat catatan bimbingan guru.');

    const parsed = JSON.parse(outputText);
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.warn('Notice generating teacher guidance, returning pedagogical fallback:', error.message);
    const { studentName = 'Siswa', habitName = 'Kebiasaan Baik' } = req.body || {};
    return res.json({
      success: true,
      data: {
        feedbackNote: `Bagus sekali ${studentName}! Ibu/Bapak Guru sangat bangga dengan komitmenmu menjalankan pembiasaan ${habitName}. Terus pertahankan kedisiplinan dan akhlak muliamu setiap hari ya!`,
        guidanceAction: 'Apresiasi Di Kelas',
        reflectionPoint: `Bagaimana caramu mengajak teman sebangkumu untuk bersama-sama membiasakan ${habitName} ini?`,
      },
    });
  }
});

// Endpoint for Parent Guidance & Encouragement Auto-Draft Assistant
app.post('/api/generate-parent-guidance', async (req, res) => {
  try {
    const {
      studentName = 'Ananda',
      habitName = 'Bangun Pagi',
      journalText = '',
      parentRole = 'Bunda',
      parentName = 'Orang Tua',
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        data: {
          parentNote: `${parentRole} sangat bangga dan bersyukur melihat kesungguhanmu dalam ${habitName}. Tetaplah jadi anak yang sholeh, mandiri, dan berakhlak mulia ya sayang. Cinta kami selalu untukmu! ❤️`,
          homeAffirmation: 'Anak Hebat Kebanggaan Keluarga',
        },
      });
    }

    const systemInstruction = `
Kamu adalah asisten pengasuhan keluarga (positive parenting) untuk orang tua Indonesia (Ayah/Bunda).
Tugasmu adalah membantu orang tua menuliskan "Pesan Kasih Sayang & Apresiasi Orang Tua" untuk anaknya yang sedang menjalankan 7 Kebiasaan Anak Indonesia Hebat.
Gunakan bahasa keluarga Indonesia yang penuh kasih sayang, tulus, menyentuh hati, membesarkan hati anak, dan membanggakan perbuatan baiknya.
Format respon JSON:
{
  "parentNote": "Pesan kasih sayang tulus dari Ayah/Bunda untuk anak (2-3 kalimat hangat dan menyentuh)",
  "homeAffirmation": "Sangat Bangga" | "Anak Hebat Kebanggaan Keluarga" | "Terus Tingkatkan Sayang" | "Teladan Di Rumah"
}
`;

    const prompt = `Nama Anak: ${studentName}. Peran: ${parentRole} (${parentName}). Kebiasaan: ${habitName}.
Catatan Jurnal Anak: "${journalText}".
Buat draf pesan kasih sayang orang tua dalam format JSON.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 5000)
    );

    const aiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const response = (await Promise.race([aiCall, timeoutPromise])) as any;
    const outputText = response.text;
    if (!outputText) throw new Error('Gagal menyusun pesan orang tua.');

    const parsed = JSON.parse(outputText);
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.warn('Notice generating parent note, using warm fallback:', error.message);
    const { studentName = 'Sayang', habitName = 'kebiasaan baik', parentRole = 'Bunda' } = req.body || {};
    return res.json({
      success: true,
      data: {
        parentNote: `${parentRole} sangat bangga dan bersyukur melihat kesungguhanmu dalam ${habitName}. Tetaplah jadi anak yang sholeh, mandiri, dan berakhlak mulia ya sayang. Cinta kami selalu untukmu! ❤️`,
        homeAffirmation: 'Anak Hebat Kebanggaan Keluarga',
      },
    });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Kak Bintang Server running on http://localhost:${PORT}`);
  });
}

startServer();
