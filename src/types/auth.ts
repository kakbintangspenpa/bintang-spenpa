export type UserRole = 'GURU' | 'SISWA' | 'ORANG_TUA' | 'ADMIN';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  titleOrGrade: string;
  schoolName: string;
  isLoggedIn: boolean;
  loginMethod: 'EMAIL_PASSWORD' | 'GOOGLE';
  photoUrl?: string;
}

export interface DemoCredential {
  role: UserRole;
  label: string;
  email: string;
  passwordHint: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  description: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'GURU',
    label: 'Guru / Wali Kelas',
    email: 'guru@hebat.sch.id',
    passwordHint: 'guru12345',
    name: 'Ibu Nurul Hidayah, S.Pd.',
    title: 'Guru Kelas & Pembina Karakter',
    avatar: '👩‍🏫',
    color: 'emerald',
    description: 'Meninjau jurnal 7 kebiasaan siswa, memberikan bimbingan & apresiasi bintang.',
  },
  {
    role: 'SISWA',
    label: 'Siswa / Peserta Didik',
    email: 'siswa@hebat.sch.id',
    passwordHint: 'siswa12345',
    name: 'Dimas Aditya',
    title: 'Kelas 4 SDN Merdeka',
    avatar: '👦',
    color: 'amber',
    description: 'Mencatat jurnal kebiasaan harian, berinteraksi dengan Kak Bintang, & raih lencana.',
  },
  {
    role: 'ORANG_TUA',
    label: 'Orang Tua / Wali Murid',
    email: 'orangtua@hebat.sch.id',
    passwordHint: 'ortu12345',
    name: 'Bunda Rahma',
    title: 'Orang Tua dari Dimas Aditya',
    avatar: '🧕',
    color: 'rose',
    description: 'Memantau perkembangan karakter anak di rumah & memberi apresiasi keluarga.',
  },
  {
    role: 'ADMIN',
    label: 'Admin Satuan Pendidikan',
    email: 'admin@hebat.sch.id',
    passwordHint: 'admin12345',
    name: 'Bpk. H. Suryanto, M.Pd.',
    title: 'Administrator Karakter Sekolah',
    avatar: '👨‍💼',
    color: 'blue',
    description: 'Mengelola database siswa, guru, profil sekolah, dan rekapitulasi kebiasaan.',
  },
];
