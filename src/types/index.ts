export interface HabitInfo {
  id: number;
  name: string;
  tagline: string;
  icon: string;
  color: {
    bg: string;
    border: string;
    text: string;
    light: string;
    accent: string;
  };
  description: string;
  benefits: string[];
  samplePrompts: string[];
  suggestedPhoto: string;
  defaultBadge: string;
  specificTips: string[];
  dailyChallenge: string;
  motivationalQuote: string;
}

export interface EvaluasiKegiatan {
  ringkasanAktivitas: string;
  analisisFotoAtauBukti: string;
  nilaiKarakterUtama: string[];
}

export interface BadgeInfo {
  id: string;
  namaBadge: string;
  iconType: string;
  deskripsi: string;
}

export interface KakBintangEvaluation {
  isValid: boolean;
  validityLevel: 'VALID' | 'PERLU_DILENGKAPI' | 'KURANG_SESUAI';
  habitId: number;
  habitName: string;
  sapaanHangat: string;
  pujianEdukatif: string;
  evaluasiKegiatan: EvaluasiKegiatan;
  bintangScore: number; // 1-5
  badgeDiberikan: BadgeInfo;
  doronganPositifDanTips: string;
  pesanKakBintang: string;
}

export interface TeacherGuidance {
  teacherName: string;
  reviewedAt: string;
  feedbackNote: string;
  guidanceAction: 'Apresiasi Di Kelas' | 'Perlu Pendampingan Lanjutan' | 'Tingkatkan Variasi Aktivitas' | 'Sempurna & Jadi Teladan';
  verifiedStatus: 'TERVERIFIKASI' | 'PERLU_PERBAIKAN';
  additionalTeacherStar?: boolean;
}

export interface ParentGuidance {
  parentName: string;
  relationship: 'Ayah' | 'Bunda' | 'Orang Tua / Wali';
  reviewedAt: string;
  parentNote: string;
  homeAffirmation: 'Sangat Bangga' | 'Anak Hebat Kebanggaan Keluarga' | 'Terus Tingkatkan Sayang' | 'Teladan Di Rumah';
  parentLoveBadge?: boolean;
}

export interface JournalRecord {
  id: string;
  timestamp: string;
  dateString: string;
  studentName: string;
  grade: string;
  habitId: number;
  habitName: string;
  journalText: string;
  timeRecorded: string;
  photoDataUrl?: string | null;
  evaluation: KakBintangEvaluation;
  teacherGuidance?: TeacherGuidance | null;
  parentGuidance?: ParentGuidance | null;
}

export interface StudentProfile {
  name: string;
  schoolGrade: string;
  totalStars: number;
  streakDays: number;
  unlockedBadges: BadgeInfo[];
}

export interface StudentAccount {
  id: string;
  name: string;
  nisn: string;
  grade: string;
  parentName: string;
  parentContact: string;
  isActive: boolean;
  joinedDate: string;
}

export interface TeacherAccount {
  id: string;
  name: string;
  nip: string;
  assignedGrade: string;
  role: string;
  email: string;
  isActive: boolean;
}

export interface SchoolProfile {
  schoolName: string;
  npsn: string;
  principalName: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  targetWeeklyStars: number;
  motto: string;
}
