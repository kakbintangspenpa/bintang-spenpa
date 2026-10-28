import React, { useState } from 'react';
import {
  StudentAccount,
  TeacherAccount,
  SchoolProfile,
  JournalRecord,
} from '../types';
import { HABITS_DATA } from '../data/habitsData';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  School,
  Settings,
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Sparkles,
  BarChart3,
  Phone,
  Mail,
  RotateCcw,
  BookOpen,
  X,
  Check,
  Star,
  Award,
} from 'lucide-react';
import { playPop, playSuccessFanfare, playSparkleSound } from '../utils/audio';

interface AdminDashboardProps {
  students: StudentAccount[];
  teachers: TeacherAccount[];
  schoolProfile: SchoolProfile;
  records: JournalRecord[];
  onSaveStudents: (newStudents: StudentAccount[]) => void;
  onSaveTeachers: (newTeachers: TeacherAccount[]) => void;
  onSaveSchoolProfile: (newProfile: SchoolProfile) => void;
  onSwitchToStudentMode: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  teachers,
  schoolProfile,
  records,
  onSaveStudents,
  onSaveTeachers,
  onSaveSchoolProfile,
  onSwitchToStudentMode,
}) => {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'TEACHERS' | 'SCHOOL' | 'REPORTS'>('STUDENTS');
  const [studentSearch, setStudentSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [teacherSearch, setTeacherSearch] = useState('');

  // School Profile Edit State
  const [profileForm, setProfileForm] = useState<SchoolProfile>(schoolProfile);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Student Add/Edit Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentAccount | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    nisn: '',
    grade: 'Kelas 4-A',
    parentName: '',
    parentContact: '',
  });

  // Teacher Add/Edit Modal
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherAccount | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    nip: '',
    assignedGrade: 'Kelas 4-A',
    role: 'Wali Kelas & Pembina Karakter',
    email: '',
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.includes(studentSearch) ||
      s.parentName.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesGrade = gradeFilter === 'ALL' || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Filtered Teachers
  const filteredTeachers = teachers.filter((t) => {
    return (
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.nip.includes(teacherSearch) ||
      t.role.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.assignedGrade.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  });

  // Unique grades list
  const uniqueGrades = Array.from(new Set(students.map((s) => s.grade)));

  // Handle Student CRUD
  const handleOpenAddStudent = () => {
    playPop();
    setEditingStudent(null);
    setStudentForm({
      name: '',
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      grade: 'Kelas 4-A',
      parentName: '',
      parentContact: '',
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: StudentAccount) => {
    playPop();
    setEditingStudent(student);
    setStudentForm({
      name: student.name,
      nisn: student.nisn,
      grade: student.grade,
      parentName: student.parentName,
      parentContact: student.parentContact,
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim()) return;

    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              name: studentForm.name.trim(),
              nisn: studentForm.nisn.trim(),
              grade: studentForm.grade.trim(),
              parentName: studentForm.parentName.trim(),
              parentContact: studentForm.parentContact.trim(),
            }
          : s
      );
      onSaveStudents(updated);
    } else {
      const newStd: StudentAccount = {
        id: `std-${Date.now()}`,
        name: studentForm.name.trim(),
        nisn: studentForm.nisn.trim() || `00${Date.now().toString().slice(-8)}`,
        grade: studentForm.grade.trim() || 'Kelas 4-A',
        parentName: studentForm.parentName.trim() || 'Orang Tua / Wali',
        parentContact: studentForm.parentContact.trim() || '-',
        isActive: true,
        joinedDate: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
      onSaveStudents([...students, newStd]);
    }

    playSuccessFanfare();
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    playPop();
    if (confirm('Yakin ingin menghapus data siswa ini?')) {
      onSaveStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleToggleStudentStatus = (id: string) => {
    playPop();
    onSaveStudents(
      students.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  // Handle Teacher CRUD
  const handleOpenAddTeacher = () => {
    playPop();
    setEditingTeacher(null);
    setTeacherForm({
      name: '',
      nip: `198${Math.floor(10000 + Math.random() * 90000)} 201${Math.floor(1000 + Math.random() * 9000)}`,
      assignedGrade: 'Kelas 4-A',
      role: 'Wali Kelas & Pembina Karakter',
      email: '',
    });
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (teacher: TeacherAccount) => {
    playPop();
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      nip: teacher.nip,
      assignedGrade: teacher.assignedGrade,
      role: teacher.role,
      email: teacher.email,
    });
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name.trim()) return;

    if (editingTeacher) {
      const updated = teachers.map((t) =>
        t.id === editingTeacher.id
          ? {
              ...t,
              name: teacherForm.name.trim(),
              nip: teacherForm.nip.trim(),
              assignedGrade: teacherForm.assignedGrade.trim(),
              role: teacherForm.role.trim(),
              email: teacherForm.email.trim(),
            }
          : t
      );
      onSaveTeachers(updated);
    } else {
      const newTch: TeacherAccount = {
        id: `tch-${Date.now()}`,
        name: teacherForm.name.trim(),
        nip: teacherForm.nip.trim(),
        assignedGrade: teacherForm.assignedGrade.trim(),
        role: teacherForm.role.trim(),
        email: teacherForm.email.trim() || 'guru@sekolah.sch.id',
        isActive: true,
      };
      onSaveTeachers([...teachers, newTch]);
    }

    playSuccessFanfare();
    setIsTeacherModalOpen(false);
  };

  const handleDeleteTeacher = (id: string) => {
    playPop();
    if (confirm('Yakin ingin menghapus data guru ini?')) {
      onSaveTeachers(teachers.filter((t) => t.id !== id));
    }
  };

  // Save School Settings
  const handleSaveSchoolProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessFanfare();
    onSaveSchoolProfile(profileForm);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2000);
  };

  // Export JSON Backup
  const handleExportJson = () => {
    playPop();
    const dataBackup = {
      schoolProfile,
      students,
      teachers,
      journalRecords: records,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(dataBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-karakter-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-xs font-bold text-indigo-200 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Portal Pengelola & Administrator Sekolah
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
              Dasbor Manajemen 7 Kebiasaan Anak Indonesia Hebat
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
              <span className="font-semibold bg-white/10 px-2.5 py-1 rounded-lg">
                🏫 <strong>{schoolProfile.schoolName}</strong> (NPSN: {schoolProfile.npsn})
              </span>
              <span className="font-semibold bg-white/10 px-2.5 py-1 rounded-lg">
                📅 TA: {schoolProfile.academicYear} - Semester {schoolProfile.semester}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Ekspor Data JSON
            </button>

            <button
              type="button"
              onClick={() => {
                playPop();
                onSwitchToStudentMode();
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Kembali ke Aplikasi Siswa
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Siswa Terdaftar
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{students.length}</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              👦
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Guru & Pembina
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{teachers.length}</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              👨‍🏫
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Jurnal Masuk
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{records.length}</span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              📝
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Target Bintang Mingguan
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-600">
              {schoolProfile.targetWeeklyStars} ⭐
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              🎯
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Admin (Horizontally scrollable on mobile) */}
      <div className="flex overflow-x-auto pb-1.5 sm:pb-2 no-scrollbar items-center gap-1.5 sm:gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            playPop();
            setActiveTab('STUDENTS');
          }}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'STUDENTS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>Kelola Data Siswa ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPop();
            setActiveTab('TEACHERS');
          }}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'TEACHERS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Kelola Data Guru ({teachers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPop();
            setActiveTab('SCHOOL');
          }}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'SCHOOL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <School className="w-4 h-4 text-amber-400" />
          <span>Pengaturan Sekolah</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPop();
            setActiveTab('REPORTS');
          }}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'REPORTS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Laporan Holistik</span>
        </button>
      </div>

      {/* TAB 1: MANAJEMEN SISWA */}
      {activeTab === 'STUDENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Cari nama siswa, NISN..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-slate-400 focus:outline-none bg-slate-50"
                />
              </div>

              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:outline-none"
              >
                <option value="ALL">Semua Kelas</option>
                {uniqueGrades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Tambah Siswa Baru
            </button>
          </div>

          {/* Mobile Student Cards (Visible on mobile/tablet) */}
          <div className="block md:hidden space-y-3">
            {filteredStudents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Tidak ada data siswa ditemukan
              </div>
            ) : (
              filteredStudents.map((std) => (
                <div key={std.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                        {std.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{std.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">NISN: {std.nisn}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/80 font-bold text-slate-700 text-[10px]">
                      {std.grade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 block font-medium">Wali Murid</span>
                      <span className="font-semibold text-slate-800">{std.parentName}</span>
                    </div>
                    <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
                      <Phone className="w-3 h-3" /> {std.parentContact}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => handleToggleStudentStatus(std.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                        std.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {std.isActive ? '● Aktif' : '○ Nonaktif'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditStudent(std)}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-indigo-600" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(std.id)}
                        className="p-1 rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Students Table (Hidden on small mobile screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Siswa</th>
                  <th className="py-3 px-3">NISN</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">Wali Murid & Kontak</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada data siswa ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                            {std.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{std.name}</span>
                            <span className="text-[10px] text-slate-400">Masuk: {std.joinedDate}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{std.nisn}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                          {std.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 block">{std.parentName}</span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {std.parentContact}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStudentStatus(std.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            std.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {std.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudent(std)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(std.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN GURU */}
      {activeTab === 'TEACHERS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Cari guru, NIP, atau peran..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-slate-400 focus:outline-none bg-slate-50"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddTeacher}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Tambah Guru / Pembina
            </button>
          </div>

          {/* Mobile Teacher Cards (Visible on mobile/tablet) */}
          <div className="block md:hidden space-y-3">
            {filteredTeachers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Tidak ada data guru ditemukan
              </div>
            ) : (
              filteredTeachers.map((tch) => (
                <div key={tch.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{tch.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">NIP: {tch.nip}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                      {tch.assignedGrade}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white p-2 rounded-xl border border-slate-100 space-y-0.5">
                    <div className="font-medium text-slate-800">{tch.role}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tch.email}</div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => handleOpenEditTeacher(tch)}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-indigo-600" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeacher(tch.id)}
                      className="p-1 rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Teachers Table (Hidden on small mobile screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Nama Guru</th>
                  <th className="py-3 px-3">NIP</th>
                  <th className="py-3 px-3">Jabatan & Peran</th>
                  <th className="py-3 px-3">Kelas Binaan</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada data guru ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((tch) => (
                    <tr key={tch.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">{tch.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{tch.nip}</td>
                      <td className="py-3 px-3 text-slate-700">{tch.role}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                          {tch.assignedGrade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{tch.email}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditTeacher(tch)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 cursor-pointer"
                            title="Edit Guru"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeacher(tch.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PENGATURAN SEKOLAH & PROGRAM */}
      {activeTab === 'SCHOOL' && (
        <form onSubmit={handleSaveSchoolProfile} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Profil Satuan Pendidikan & Pengaturan Program
              </h3>
              <p className="text-xs text-slate-500">
                Identitas ini dicantumkan pada kop piagam dan laporan rapor karakter
              </p>
            </div>
            {profileSavedToast && (
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" /> Berhasil Disimpan!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Sekolah:
              </label>
              <input
                type="text"
                value={profileForm.schoolName}
                onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                NPSN (Nomor Pokok Sekolah Nasional):
              </label>
              <input
                type="text"
                value={profileForm.npsn}
                onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Kepala Sekolah:
              </label>
              <input
                type="text"
                value={profileForm.principalName}
                onChange={(e) => setProfileForm({ ...profileForm, principalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tahun Ajaran & Semester:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={profileForm.academicYear}
                  onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
                  placeholder="2026/2027"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
                <select
                  value={profileForm.semester}
                  onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Bintang Karakter Mingguan (Per Siswa):
              </label>
              <input
                type="number"
                min="5"
                max="35"
                value={profileForm.targetWeeklyStars}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, targetWeeklyStars: parseInt(e.target.value) || 15 })
                }
                className="w-40 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 ml-2">
                *Target rekomendasi: 15-20 bintang per minggu (2-3 kebiasaan per hari)
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Motto Pembiasaan Karakter Sekolah:
              </label>
              <input
                type="text"
                value={profileForm.motto}
                onChange={(e) => setProfileForm({ ...profileForm, motto: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Simpan Pengaturan Sekolah
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: LAPORAN HOLISTIK */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Laporan Capaian Program 7 Kebiasaan Anak Indonesia Hebat
              </h3>
              <p className="text-xs text-slate-500">
                Data terintegrasi dari seluruh siswa, bimbingan guru, dan pendampingan orang tua
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playPop();
                window.print();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Cetak Laporan Lengkap
            </button>
          </div>

          {/* Aggregate Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Indikator Keberhasilan Tri-Sentra:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex justify-between">
                  <span>Tingkat Keterlibatan Siswa:</span>
                  <strong className="text-emerald-700">92% Siswa Aktif</strong>
                </li>
                <li className="flex justify-between">
                  <span>Bimbingan Guru Terlaksana:</span>
                  <strong className="text-indigo-700">
                    {records.filter((r) => r.teacherGuidance).length} / {records.length} Jurnal
                  </strong>
                </li>
                <li className="flex justify-between">
                  <span>Partisipasi Apresiasi Orang Tua:</span>
                  <strong className="text-rose-700">
                    {records.filter((r) => r.parentGuidance).length} Catatan Kasih Sayang
                  </strong>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                Peringkat Kebiasaan Terfavorit:
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-amber-950 font-medium">
                <li>Kebiasaan #1: Bangun Pagi (Paling konsisten dilakukan)</li>
                <li>Kebiasaan #4: Makan Sehat & Bergizi (Program Isi Piringku)</li>
                <li>Kebiasaan #3: Berolahraga (Senam pagi & jalan sehat)</li>
                <li>Kebiasaan #5: Gemar Belajar & Literasi</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ADD/EDIT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-slate-300">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Siswa:
                </label>
                <input
                  type="text"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="Contoh: Dimas Aditya"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NISN:
                  </label>
                  <input
                    type="text"
                    value={studentForm.nisn}
                    onChange={(e) => setStudentForm({ ...studentForm, nisn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kelas:
                  </label>
                  <input
                    type="text"
                    value={studentForm.grade}
                    onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Orang Tua / Wali:
                </label>
                <input
                  type="text"
                  value={studentForm.parentName}
                  onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                  placeholder="Contoh: Bunda Rahma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  No. Telepon / WhatsApp Orang Tua:
                </label>
                <input
                  type="text"
                  value={studentForm.parentContact}
                  onChange={(e) => setStudentForm({ ...studentForm, parentContact: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEACHER ADD/EDIT MODAL */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-slate-300">
            <div className="bg-indigo-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingTeacher ? 'Edit Data Guru' : 'Tambah Guru / Pembina'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTeacherModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Guru & Gelar:
                </label>
                <input
                  type="text"
                  value={teacherForm.name}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="Contoh: Ibu Nurul Hidayah, S.Pd."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    NIP / ID:
                  </label>
                  <input
                    type="text"
                    value={teacherForm.nip}
                    onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Kelas Binaan:
                  </label>
                  <input
                    type="text"
                    value={teacherForm.assignedGrade}
                    onChange={(e) => setTeacherForm({ ...teacherForm, assignedGrade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jabatan / Peran:
                </label>
                <input
                  type="text"
                  value={teacherForm.role}
                  onChange={(e) => setTeacherForm({ ...teacherForm, role: e.target.value })}
                  placeholder="Wali Kelas / Guru BK / Pembina Karakter"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Guru:
                </label>
                <input
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                  placeholder="guru@sekolah.sch.id"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
