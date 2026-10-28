// Sample presets for quick testing and student inspiration using HTML5 Canvas PNG generators

export interface SampleJournalPreset {
  habitId: number;
  title: string;
  studentName: string;
  grade: string;
  timeRecorded: string;
  journalText: string;
  getPngDataUrl: () => string;
}

// Helper to draw a morning bedroom scene
function drawMorningScene(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background room
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(0, 0, 400, 300);

  // Window
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(50, 30, 120, 110);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#0284c7';
  ctx.strokeRect(50, 30, 120, 110);

  // Window frame lines
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(110, 30);
  ctx.lineTo(110, 140);
  ctx.moveTo(50, 85);
  ctx.lineTo(170, 85);
  ctx.stroke();

  // Sun
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(85, 65, 24, 0, Math.PI * 2);
  ctx.fill();

  // Wall Clock at 05:00
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(320, 70, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Clock hands (pointing to 05:00)
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(320, 70);
  ctx.lineTo(320, 48); // minute hand to 12
  ctx.moveTo(320, 70);
  ctx.lineTo(336, 84); // hour hand to 5
  ctx.stroke();

  // Made Bed
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(60, 180, 280, 90, 12);
  ctx.fill();

  // Pillows
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(65, 155, 95, 40, 8);
  ctx.roundRect(175, 155, 95, 40, 8);
  ctx.fill();
  ctx.stroke();

  // Blanket fold
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(220, 190, 105, 50, 8);
  ctx.fill();

  // Caption Banner
  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kamar Rapi Pukul 05.00 WIB - Dimas Aditya', 200, 285);

  return canvas.toDataURL('image/png');
}

// Helper to draw a healthy balanced breakfast plate
function drawHealthyBreakfastScene(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background dining table
  ctx.fillStyle = '#f0fdf4';
  ctx.fillRect(0, 0, 400, 300);

  // Big Plate
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(200, 150, 115, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 4 Food sections
  // 1. Rice (Top-Left)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(200, 150);
  ctx.arc(200, 150, 95, Math.PI, 1.5 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Nasi', 140, 120);

  // 2. Vegetables - Bayam Jagung (Top-Right)
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.moveTo(200, 150);
  ctx.arc(200, 150, 95, 1.5 * Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#15803d';
  ctx.fillText('Bayam & Jagung', 215, 120);

  // 3. Protein - Telur Dadar (Bottom-Left)
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(200, 150);
  ctx.arc(200, 150, 95, 0.5 * Math.PI, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a16207';
  ctx.fillText('Telur Dadar', 125, 195);

  // 4. Fruit - Buah Pepaya (Bottom-Right)
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.moveTo(200, 150);
  ctx.arc(200, 150, 95, 0, 0.5 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c2410c';
  ctx.fillText('Pepaya Manis', 215, 195);

  // Water Glass
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.roundRect(335, 95, 42, 70, 6);
  ctx.fill();
  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Air Putih', 335, 180);

  // Caption Banner
  ctx.fillStyle = '#166534';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Sarapan Isi Piringku Bergizi - Siti Rahma', 200, 285);

  return canvas.toDataURL('image/png');
}

// Helper to draw sports running scene
function drawSportsScene(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#fff7ed';
  ctx.fillRect(0, 0, 400, 300);

  // Running Track
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 32;
  ctx.beginPath();
  ctx.ellipse(200, 150, 150, 85, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Track dashed lane
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.ellipse(200, 150, 150, 85, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sports Shoes
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(140, 130, 50, 25, 8);
  ctx.roundRect(205, 130, 50, 25, 8);
  ctx.fill();

  // Sports Drink Bottle
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.roundRect(270, 105, 26, 60, 6);
  ctx.fill();

  // Text
  ctx.fillStyle = '#c2410c';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏃‍♂️ Lari 4 Putaran + Senam SKJ', 200, 65);

  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Olahraga Rutin Pagi - Rian Pratama', 200, 275);

  return canvas.toDataURL('image/png');
}

// Helper to draw book reading scene
function drawReadingScene(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, 0, 400, 300);

  // Study Desk
  ctx.fillStyle = '#e0f2fe';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(50, 75, 300, 160, 16);
  ctx.fill();
  ctx.stroke();

  // Open Book
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 130);
  ctx.quadraticCurveTo(145, 115, 200, 130);
  ctx.quadraticCurveTo(255, 115, 310, 130);
  ctx.lineTo(300, 200);
  ctx.quadraticCurveTo(255, 185, 200, 200);
  ctx.quadraticCurveTo(145, 185, 100, 200);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Middle crease
  ctx.beginPath();
  ctx.moveTo(200, 130);
  ctx.lineTo(200, 200);
  ctx.stroke();

  // Text lines on book
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(115, 145);
  ctx.lineTo(185, 145);
  ctx.moveTo(115, 160);
  ctx.lineTo(185, 160);
  ctx.moveTo(215, 145);
  ctx.lineTo(285, 145);
  ctx.moveTo(215, 160);
  ctx.lineTo(285, 160);
  ctx.stroke();

  // Text
  ctx.fillStyle = '#0369a1';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📖 Gemar Membaca Buku Pahlawan', 200, 55);

  ctx.fillStyle = '#075985';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Literasi Anak Hebat - Anindya Putri', 200, 270);

  return canvas.toDataURL('image/png');
}

// Helper to draw community helping scene
function drawCommunityScene(): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#faf5ff';
  ctx.fillRect(0, 0, 400, 300);

  // Garden greenery
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(80, 180, 35, 0, Math.PI * 2);
  ctx.arc(130, 190, 30, 0, Math.PI * 2);
  ctx.arc(320, 180, 40, 0, Math.PI * 2);
  ctx.fill();

  // Watering Can
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.roundRect(175, 130, 55, 45, 8);
  ctx.fill();

  // Spout
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(230, 145);
  ctx.lineTo(265, 120);
  ctx.stroke();

  // Droplets
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(280, 135, 4, 0, Math.PI * 2);
  ctx.arc(288, 150, 4, 0, Math.PI * 2);
  ctx.arc(275, 165, 4, 0, Math.PI * 2);
  ctx.fill();

  // Text
  ctx.fillStyle = '#7e22ce';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🤝 Gotong Royong & Peduli Lingkungan', 200, 55);

  ctx.fillStyle = '#6b21a8';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Aksi Bermasyarakat - Fajar Nugroho', 200, 270);

  return canvas.toDataURL('image/png');
}

export const SAMPLE_JOURNAL_PRESETS: SampleJournalPreset[] = [
  {
    habitId: 1,
    title: 'Bangun Jam 05.00 & Merapikan Tempat Tidur',
    studentName: 'Dimas Aditya',
    grade: 'Kelas 4 SDN Merdeka',
    timeRecorded: '05:00 WIB',
    journalText: 'Pagi ini alarm berbunyi jam 05.00 WIB. Aku langsung bangun tanpa malas-malasan, berdoa syukur, lalu segera melipat selimut dan merapikan bantal guling sendiri. Kamarku jadi rapi dan aku siap mandi pagi menyambut hari sekolah!',
    getPngDataUrl: drawMorningScene,
  },
  {
    habitId: 4,
    title: 'Sarapan Sehat "Isi Piringku" Sebelum Berangkat Sekolah',
    studentName: 'Siti Rahma',
    grade: 'Kelas 5 SDN Pertiwi',
    timeRecorded: '06:15 WIB',
    journalText: 'Pagi ini aku sarapan bersama Ibu dan Adik. Di piringku ada nasi putih hangat, sayur bening bayam dan jagung manis, telur dadar, serta sepotong buah pepaya segar. Aku juga menghabiskan satu gelas air putih hangat. Perutku kenyang sehat!',
    getPngDataUrl: drawHealthyBreakfastScene,
  },
  {
    habitId: 3,
    title: 'Lari Pagi & Senam Kebugaran Jasmani 20 Menit',
    studentName: 'Rian Pratama',
    grade: 'Kelas 6 SDN Teladan',
    timeRecorded: '05:45 WIB',
    journalText: 'Tadi pagi setelah salat subuh, aku berolahraga lari mengelilingi lapangan dekat rumah sebanyak 4 putaran, lalu melakukan peregangan senam SKJ selama 15 menit. Tubuhku terasa sangat bugar, berkeringat, dan siap beraktivitas sepanjang hari!',
    getPngDataUrl: drawSportsScene,
  },
  {
    habitId: 5,
    title: 'Membaca Buku Kisah Pahlawan Nasional Selama 30 Menit',
    studentName: 'Anindya Putri',
    grade: 'Kelas 4 SDN Nusantara',
    timeRecorded: '16:00 WIB',
    journalText: 'Sore hari aku membaca buku cerita sejarah tentang perjuangan Ki Hajar Dewantara di teras rumah. Aku belajar bahwa pendidikan adalah kunci kemajuan bangsa, dan semboyan "Ing Ngarso Sung Tulodo" artinya di depan memberi teladan. Aku sangat terinspirasi!',
    getPngDataUrl: drawReadingScene,
  },
  {
    habitId: 6,
    title: 'Membantu Kerja Bakti & Menyiram Tanaman Tetangga Lansia',
    studentName: 'Fajar Nugroho',
    grade: 'Kelas 5 SDN Harapan Bangsa',
    timeRecorded: '08:30 WIB',
    journalText: 'Pagi ini di lingkungan RT ada kegiatan gotong royong. Aku membantu menyiram tanaman bunga di pekarangan rumah Nek Sumi yang sudah sepuh, dan membantu mengumpulkan dedaunan kering ke tempat sampah bersama teman-teman.',
    getPngDataUrl: drawCommunityScene,
  },
];
