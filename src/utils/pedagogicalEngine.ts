import { KakBintangEvaluation, BadgeInfo } from '../types';

interface JournalInputParams {
  studentName?: string;
  grade?: string;
  habitId?: number;
  habitName?: string;
  journalText?: string;
  timeRecorded?: string;
  hasPhoto?: boolean;
}

const HABIT_BADGES: Record<number, BadgeInfo> = {
  1: {
    id: 'badge-bangun-pagi',
    namaBadge: 'Pahlawan Fajar Ceria',
    iconType: 'sun',
    deskripsi: 'Berhasil membiasakan bangun pagi dengan segar, disiplin, dan senyuman ceria!',
  },
  2: {
    id: 'badge-beribadah',
    namaBadge: 'Bintang Doa Penuh Syukur',
    iconType: 'heart',
    deskripsi: 'Rajin beribadah dan bersyukur, memperkuat akhlak mulia dalam keseharian.',
  },
  3: {
    id: 'badge-berolahraga',
    namaBadge: 'Ksatria Sehat & Bugar',
    iconType: 'zap',
    deskripsi: 'Rutin berolahraga dan menggerakkan badan agar fisik bugar dan pikiran cerdas.',
  },
  4: {
    id: 'badge-makan-sehat',
    namaBadge: 'Juara Gizi Seimbang',
    iconType: 'apple',
    deskripsi: 'Memilih sarapan dan makanan sehat bergizi seimbang untuk pertumbuhan juara.',
  },
  5: {
    id: 'badge-gemar-belajar',
    namaBadge: 'Petualang Cendekia',
    iconType: 'book',
    deskripsi: 'Memiliki rasa ingin tahu tinggi, rajin membaca dan memperluas wawasan.',
  },
  6: {
    id: 'badge-bermasyarakat',
    namaBadge: 'Sahabat Gotong Royong',
    iconType: 'smile',
    deskripsi: 'Menunjukkan sikap peduli, ramah, tolong-menolong, dan santun kepada sesama.',
  },
  7: {
    id: 'badge-tidur-awal',
    namaBadge: 'Penjaga Istirahat Teratur',
    iconType: 'star',
    deskripsi: 'Disiplin tidur malam tepat waktu untuk memulihkan energi dan raga.',
  },
};

const HABIT_TRAITS: Record<number, string[]> = {
  1: ['Disiplin Diri', 'Kemandirian', 'Kesiapan Belajar'],
  2: ['Religiusitas', 'Rasa Syukur', 'Akhlak Mulia'],
  3: ['Kebugaran Jasmani', 'Kegigihan', 'Sportivitas'],
  4: ['Kesadaran Gizi', 'Pola Hidup Sehat', 'Rasa Menghargai Makanan'],
  5: ['Rasa Ingin Tahu', 'Ketekunan Belajar', 'Literasi'],
  6: ['Gotong Royong', 'Empati Sosial', 'Sopan Santun'],
  7: ['Manajemen Waktu', 'Pemulihan Raga', 'Disiplin Malam'],
};

const HABIT_TIPS: Record<number, string> = {
  1: 'Malam ini tidur sebelum jam 21.00 ya agar esok pagimu terasa lebih ringan dan matamu berbinar segar saat membuka jendela kamar!',
  2: 'Lanjutkan dengan mempraktikkan senyum, salam, dan sapa kepada bapak/ibu guru serta orang tuamu sebagai wujud nyata ibadahmu hari ini.',
  3: 'Jangan lupa minum 1-2 gelas air putih hangat untuk mengganti cairan tubuh setelah berolahraga agar tubuhmu tetap terhidrasi!',
  4: 'Pertahankan menu isi piringku: ada sayuran segar, lauk berprotein, dan kurangi camilan manis kemasan ya.',
  5: 'Coba ceritakan satu hal baru dan menarik yang kamu baca hari ini kepada teman sebangkumu atau orang tuamu di rumah!',
  6: 'Sikap ramah dan gotong royongmu membuat lingkungan sekitar jadi hangat. Terus tebarkan senyuman dan bantuan kecil untuk sesama!',
  7: 'Jauhkan layar gawai (handphone) minimal 30 menit sebelum tidur agar otakmu rileks dan tidurmu nyenyak bermimpi indah.',
};

/**
 * Intelligent Pedagogical Evaluation Generator for Indonesian 7 Good Habits
 * Ensures student journals are ALWAYS evaluated thoughtfully with encouragement,
 * character traits, star ratings, and badges even when offline or during API limits.
 */
export function evaluateJournalPedagogical(params: JournalInputParams): KakBintangEvaluation {
  const {
    studentName = 'Bintang Hebat',
    grade = 'Sekolah Dasar',
    habitId = 1,
    habitName = 'Bangun Pagi',
    journalText = '',
    timeRecorded = '',
    hasPhoto = false,
  } = params;

  const textLength = journalText.trim().length;
  const habitNum = Math.min(Math.max(1, habitId), 7);
  const badge = HABIT_BADGES[habitNum] || HABIT_BADGES[1];
  const traits = HABIT_TRAITS[habitNum] || ['Disiplin', 'Karakter Unggul'];
  const habitTip = HABIT_TIPS[habitNum] || 'Terus pertahankan kebiasaan baik ini setiap hari!';

  // Determine validity & star score
  let validityLevel: 'VALID' | 'PERLU_DILENGKAPI' | 'KURANG_SESUAI' = 'VALID';
  let bintangScore = 4;
  let pujianEdukatif = '';
  let doronganPositifDanTips = habitTip;

  if (textLength < 12 && !hasPhoto) {
    validityLevel = 'PERLU_DILENGKAPI';
    bintangScore = 3; // Always supportive, never 0 or 1
    pujianEdukatif = `Kak Bintang senang sekali melihat niat baik ${studentName} untuk menjalankan pembiasaan ${habitName}! Cerita singkatmu sudah menjadi langkah awal yang baik.`;
    doronganPositifDanTips = `Ceritamu masih agak ringkas nih. Coba besok ceritakan lebih banyak ya: jam berapa mulainya, apa yang kamu rasakan, dan siapa yang menemanimu! Tetap semangat!`;
  } else if (hasPhoto && textLength >= 25) {
    validityLevel = 'VALID';
    bintangScore = 5;
    pujianEdukatif = `Hebat luar biasa, ${studentName}! Jurnalmu tentang ${habitName} sangat lengkap dan disertai bukti foto yang sangat membanggakan! Ini mencerminkan keteladanan seorang anak Indonesia berkarakter juara!`;
  } else if (textLength >= 35) {
    validityLevel = 'VALID';
    bintangScore = 5;
    pujianEdukatif = `Luar biasa, ${studentName}! Kamu menceritakan pembiasaan ${habitName} dengan runtut, jujur, dan penuh kesungguhan. Kak Bintang bangga sekali atas kedisiplinanmu!`;
  } else {
    validityLevel = 'VALID';
    bintangScore = 4;
    pujianEdukatif = `Bagus sekali, ${studentName}! Upayamu dalam membiasakan ${habitName} terlaksana dengan baik dan patut dicontoh. Terus jaga konsistensimu setiap hari ya!`;
  }

  const sapaanHangat = `Halo Bintang Hebat ${studentName}! ⭐`;

  const ringkasanAktivitas = journalText.trim()
    ? `${studentName} mencatatkan aktivitas ${habitName}: "${journalText.trim()}"`
    : `${studentName} telah mempraktikkan kebiasaan baik ${habitName} pada ${timeRecorded || 'hari ini'}.`;

  const analisisFotoAtauBukti = hasPhoto
    ? 'Foto kegiatan terlampir dengan jelas memperlihatkan bukti kesungguhan ananda dalam menjalankan pembiasaan ini.'
    : 'Jurnal dituliskan secara mandiri dengan penuh kejujuran melalui catatan refleksi harian.';

  const pesanKakBintang = `Anak Indonesia Hebat adalah anak yang konsisten menumbuhkan karakter mulia sejak dini. Kamu adalah kebanggaan nusa dan bangsa! 🇮🇩✨`;

  return {
    isValid: true,
    validityLevel,
    habitId: habitNum,
    habitName,
    sapaanHangat,
    pujianEdukatif,
    evaluasiKegiatan: {
      ringkasanAktivitas,
      analisisFotoAtauBukti,
      nilaiKarakterUtama: traits,
    },
    bintangScore,
    badgeDiberikan: badge,
    doronganPositifDanTips,
    pesanKakBintang,
  };
}

/**
 * Fallback Q&A answer generator for Ask Kak Bintang
 */
export function getQuickAnswerFromKakBintang(
  question: string,
  studentName = 'Adik Hebat',
  habitContext = ''
): string {
  const q = question.toLowerCase();

  if (q.includes('bangun pagi') || q.includes('tidur') || q.includes('ngantuk') || q.includes('subuh')) {
    return `Halo ${studentName}! ☀️ Untuk membiasakan bangun pagi segar, kuncinya adalah tidur malam lebih awal (sebelum jam 21.00) dan jangan bermain handphone di kasur. Begitu bangun, segera minum air putih dan rapikan tempat tidurmu ya!`;
  }

  if (q.includes('ibadah') || q.includes('doa') || q.includes('sholat')) {
    return `Halo ${studentName}! 🤲 Ibadah adalah caramu bersyukur kepada Tuhan Yang Maha Esa. Selain berdoa tepat waktu, wujud ibadah yang paling indah adalah berbuat baik, santun kepada guru dan orang tua, serta menyayangi teman-temanmu.`;
  }

  if (q.includes('olahraga') || q.includes('sehat') || q.includes('lemas') || q.includes('lari')) {
    return `Halo ${studentName}! 🏃‍♂️ Berolahraga tidak harus berat kok! Kamu bisa jalan santai, senam irama 15 menit, lompat tali, atau bersepeda keliling kompleks bersama teman. Yang penting tubuhmu bergerak aktif dan berkeringat gembira!`;
  }

  if (q.includes('makan') || q.includes('sayur') || q.includes('buah') || q.includes('sarapan')) {
    return `Halo ${studentName}! 🥗 Tubuh juara butuh bahan bakar berkualitas! Usahakan selalu sarapan sebelum berangkat sekolah. Coba tambahkan minimal 1 macam sayur dan buah favoritmu di piring setiap hari!`;
  }

  if (q.includes('belajar') || q.includes('malas') || q.includes('buku') || q.includes('pr')) {
    return `Halo ${studentName}! 📚 Rahasia gemar belajar adalah rasa ingin tahu. Jangan anggap belajar sebagai beban, melainkan petualangan menemukan hal baru! Luangkan waktu 20-30 menit membaca buku yang kamu minati setiap hari.`;
  }

  if (q.includes('teman') || q.includes('masyarakat') || q.includes('bantu') || q.includes('tetangga')) {
    return `Halo ${studentName}! 🤝 Bermasyarakat dimulai dari hal kecil di sekitarmu: menyapa tetangga dengan senyum ramah, membuang sampah pada tempatnya, dan membantu teman yang sedang kesulitan. Gotong royong adalah ciri khas anak Indonesia hebat!`;
  }

  return `Halo ${studentName}! Pertanyaanmu bagus sekali tentang ${habitContext || '7 Kebiasaan Baik'}. Melatih kebiasaan baik itu seperti menanam pohon: butuh disiram sedikit demi sedikit setiap hari dengan konsistensi. Jika ada hari yang terasa sulit, jangan menyerah ya! Kak Bintang, guru, dan orang tuamu selalu ada mendampingimu. Semangat terus! 🌟🇮🇩`;
}
