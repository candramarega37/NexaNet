from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path

OUT = Path(r'C:\Users\Windows 11\nexanet\docs\Manual-Book-NexaNet.docx')
OUT.parent.mkdir(parents=True, exist_ok=True)
doc = Document()
sec = doc.sections[0]
sec.page_width = Inches(8.27); sec.page_height = Inches(11.69)
sec.top_margin = Inches(0.9); sec.bottom_margin = Inches(0.85)
sec.left_margin = Inches(1.05); sec.right_margin = Inches(0.9)

# Academic, editable layout inspired by the supplied manual structure.
styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Times New Roman'; normal._element.rPr.rFonts.set(qn('w:ascii'),'Times New Roman'); normal._element.rPr.rFonts.set(qn('w:hAnsi'),'Times New Roman')
normal.font.size = Pt(12); normal.font.color.rgb = RGBColor(0,0,0)
normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
normal.paragraph_format.line_spacing = 1.35
normal.paragraph_format.space_after = Pt(6)
for name,size in [('Title',24),('Heading 1',15),('Heading 2',13),('Heading 3',12)]:
    s=styles[name]; s.font.name='Times New Roman'; s._element.rPr.rFonts.set(qn('w:ascii'),'Times New Roman'); s._element.rPr.rFonts.set(qn('w:hAnsi'),'Times New Roman')
    s.font.size=Pt(size); s.font.bold=True; s.font.color.rgb=RGBColor(0,0,0)
    s.paragraph_format.keep_with_next=True; s.paragraph_format.space_before=Pt(12); s.paragraph_format.space_after=Pt(6)
# The built-in Title style has a blue rule in the default Word template; remove it.
ppr=styles['Title']._element.pPr
if ppr is not None:
    b=ppr.find(qn('w:pBdr'))
    if b is not None: ppr.remove(b)

# Footer with page numbering.
footer=sec.footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.CENTER
r=footer.add_run('Manual Pengguna NexaNet  |  '); r.font.name='Times New Roman'; r.font.size=Pt(9)
fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); footer._p.append(fld)

# Helpers

def center(text, size=None, bold=False, italic=False, before=0, after=6):
    p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_before=Pt(before); p.paragraph_format.space_after=Pt(after)
    r=p.add_run(text); r.bold=bold; r.italic=italic
    if size: r.font.size=Pt(size)
    r.font.name='Times New Roman'; r.font.color.rgb=RGBColor(0,0,0)
    return p

def body(text, indent=True):
    p=doc.add_paragraph(text)
    if indent: p.paragraph_format.first_line_indent=Inches(0.35)
    return p

def heading(text, level=1): doc.add_heading(text, level=level)
def numbered(items):
    for item in items:
        p=doc.add_paragraph(style='List Number'); p.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY; p.paragraph_format.line_spacing=1.25; p.add_run(item)
def bulleted(items):
    for item in items:
        p=doc.add_paragraph(style='List Bullet'); p.alignment=WD_ALIGN_PARAGRAPH.JUSTIFY; p.paragraph_format.line_spacing=1.25; p.add_run(item)
def section_title(chapter, name):
    center(chapter, 15, True, before=4, after=3); center(name.upper(),15,True,after=20)

# Cover
center('NEXANET',18,True,before=74,after=34)
center('MANUAL BOOK',16,True,after=24)
center('PANDUAN PENGGUNAAN',25,True,after=12)
center('Aplikasi Pembelajaran Jaringan Komputer Berbasis Web',14,after=88)
center('Disusun oleh:',12,True,after=8)
center('[Nama Penyusun]',12,after=6)
center('[Nama Sekolah / Institusi]',12,after=6)
center('2026',12,after=0)
doc.add_page_break()

# Preface
center('KATA PENGANTAR',14,True,before=8,after=24)
body('Puji syukur ke hadirat Tuhan Yang Maha Esa karena manual book NexaNet ini dapat disusun sebagai panduan penggunaan platform pembelajaran jaringan komputer. NexaNet membantu siswa Teknik Komputer dan Jaringan mempelajari konsep jaringan, mengukur pemahaman melalui pretest dan posttest, serta menerapkan pengetahuan melalui laboratorium pembelajaran.')
body('Manual ini menjelaskan pengenalan fitur, persiapan penggunaan, dan langkah-langkah menggunakan NexaNet untuk siswa serta pengelola yang memiliki akses guru atau admin. Panduan disusun agar pengguna dapat mengikuti proses belajar secara terarah, mulai dari membuka akun hingga melihat progres dan menggunakan fitur praktik.')
body('Panduan ini disusun berdasarkan fitur yang tersedia pada NexaNet. Tampilan dapat berubah mengikuti pengembangan aplikasi. Semoga manual ini membantu pengguna memanfaatkan NexaNet dalam kegiatan belajar dan pengelolaan konten.')
p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.RIGHT; p.paragraph_format.space_before=Pt(36); p.add_run('[Kota], [Tanggal penyusunan]')
p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.RIGHT; p.add_run('Tim Penyusun')
doc.add_page_break()

# Contents
center('DAFTAR ISI',14,True,before=8,after=18)
contents=[
('KATA PENGANTAR',''),('DAFTAR ISI',''),
('BAB I PENDAHULUAN',''),('1.1 Latar Belakang',''),('1.2 Tujuan Manual Book',''),('1.3 Ruang Lingkup',''),
('BAB II PENGENALAN NEXANET',''),('2.1 Deskripsi NexaNet',''),('2.2 Fitur NexaNet',''),('2.3 Persyaratan Pengguna',''),
('BAB III PANDUAN PENGGUNAAN NEXANET',''),('3.1 Mengakses Aplikasi NexaNet',''),('3.2 Fitur Siswa',''),('3.3 Fitur Guru dan Admin',''),('3.4 Panduan Tambahan',''),
('BAB IV PENUTUP',''),('4.1 Kesimpulan',''),('4.2 Saran','')]
for label,_ in contents:
    p=doc.add_paragraph(); p.paragraph_format.left_indent=Inches(0.18 if label[:3] in ('1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','3.4','4.1','4.2') else 0); p.paragraph_format.space_after=Pt(3)
    p.add_run(label)
body('Catatan: daftar isi ini dapat diperbarui setelah penyuntingan dan pengaturan halaman di Microsoft Word.',indent=False).runs[0].italic=True
doc.add_page_break()

# Chapter I
section_title('BAB I','PENDAHULUAN')
heading('1.1 Latar Belakang',2)
body('Jaringan komputer menjadi bagian penting dalam kegiatan belajar, komunikasi, dan pertukaran informasi. Pemahaman jaringan memerlukan penguasaan konsep sekaligus latihan agar siswa dapat melihat hubungan antara teori dan penerapannya.')
body('NexaNet merupakan platform pembelajaran berbasis web yang dirancang untuk mendukung pembelajaran Teknik Komputer dan Jaringan. Platform ini menyediakan rangkaian pembelajaran yang dimulai dengan pretest, dilanjutkan dengan materi dan video, kemudian posttest, serta latihan di Network Lab dan Troubleshooting Lab. Manual book ini disusun agar pengguna memahami cara mengakses dan menggunakan fitur-fitur tersebut.')
heading('1.2 Tujuan Manual Book',2)
body('Manual book NexaNet bertujuan untuk:')
numbered(['Memberikan panduan kepada pengguna dalam mengakses NexaNet.', 'Memperkenalkan fitur dan menu yang tersedia pada platform.', 'Menjelaskan langkah penggunaan fitur belajar, kuis, dan laboratorium.', 'Menjadi acuan dasar bagi guru atau admin dalam mengelola konten pembelajaran.', 'Membantu pengguna mengenali langkah awal untuk mengatasi kendala penggunaan.'])
heading('1.3 Ruang Lingkup',2)
body('Panduan ini membahas pengenalan NexaNet, persyaratan penggunaan, pembuatan akun dan masuk, alur belajar siswa, penggunaan fitur materi, video, kuis, Network Lab, Troubleshooting Lab, AI Tutor, model 3D, progres, profil, serta fungsi administrasi yang tersedia untuk guru atau admin. Bagian flowchart tidak disertakan.')

# Chapter II
section_title('BAB II','PENGENALAN NEXANET')
heading('2.1 Deskripsi NexaNet',2)
body('NexaNet adalah platform pembelajaran jaringan komputer untuk siswa TKJ yang dapat diakses melalui peramban web. Platform ini menghubungkan pembelajaran teori dengan evaluasi dan latihan praktik. Siswa dapat mengikuti pretest, mempelajari enam modul materi dan video, mengerjakan posttest, lalu mencoba simulasi dan latihan diagnosis jaringan.')
body('Guru dan admin dengan hak akses yang sesuai dapat mengelola materi, video, kuis, bank soal, kasus troubleshooting, katalog model 3D, serta data peran siswa. Panel analitik menyediakan ringkasan aktivitas belajar dan hasil evaluasi.')
heading('2.2 Fitur NexaNet',2)
features=[
('Halaman utama dan navigasi','Halaman pengenalan aplikasi menyediakan akses menuju jalur belajar, materi, kuis, laboratorium, pendaftaran, dan masuk.'),
('Dashboard dan learning path','Dashboard merangkum aktivitas belajar pengguna. Learning Path menunjukkan urutan modul dan status penyelesaiannya.'),
('Materi pembelajaran','Katalog berisi enam modul: dasar jaringan komputer, model OSI, model TCP/IP, pengalamatan IPv4, subnetting IPv4, dan troubleshooting jaringan. Daftar dapat dicari dan difilter.'),
('Video pembelajaran','Katalog video menyediakan sumber video pendukung. Video dibuka dan diputar pada halaman NexaNet.'),
('Pretest, posttest, dan kuis','Kuis digunakan untuk mengukur pemahaman. Pretest dan posttest jaringan dasar masing-masing disusun dengan 25 soal sejajar untuk membantu membandingkan hasil belajar. Kuis lain mencakup topik jaringan.'),
('Network Lab','Simulasi menyediakan eksplorasi topologi Star, Bus, dan Mesh, konfigurasi alamat perangkat, tes konektivitas, dan kalkulator subnet IPv4.'),
('Troubleshooting Lab','Latihan diagnosis berbasis kasus mengajak pengguna membaca gejala, menjawab langkah pemeriksaan, dan meninjau arahan diagnosis.'),
('AI Tutor dan bantuan AI','AI Tutor melayani pertanyaan tentang konsep jaringan. Pada halaman tertentu tersedia pertanyaan kontekstual materi atau petunjuk kuis.'),
('Katalog perangkat 3D','Pengguna dapat melihat perangkat jaringan, memutar model, dan memilih titik pembelajaran untuk membaca keterangan komponen.'),
('Profil dan progres','Pengguna dapat mengelola informasi profil, melihat status materi, nilai kuis, serta aktivitas belajar yang tercatat.'),
('Panel pengelola','Guru atau admin dapat mengelola materi, video, kuis dan soal, kasus troubleshooting, model 3D dan hotspot, peran siswa, serta melihat analitik.')]
for title,desc in features:
    p=doc.add_paragraph(); p.paragraph_format.first_line_indent=Inches(0.35); r=p.add_run(title+'. '); r.bold=True; p.add_run(desc)
heading('2.3 Persyaratan Pengguna',2)
body('Untuk menggunakan NexaNet, pengguna memerlukan:')
bulleted(['Komputer, laptop, tablet, atau ponsel yang dapat menjalankan peramban web modern.', 'Koneksi internet untuk membuka platform, mengambil konten, dan memutar video.', 'Akun NexaNet untuk mengakses dashboard, melihat progres pribadi, dan menyimpan aktivitas yang memerlukan autentikasi.', 'Hak akses yang sesuai untuk menggunakan menu guru atau admin.'])
body('Nama peramban dan sistem operasi tertentu tidak diwajibkan oleh panduan ini. Gunakan browser yang masih diperbarui. Kelancaran tampilan dan pemuatan model 3D dapat dipengaruhi oleh perangkat, browser, dan koneksi internet.',indent=False)

# Chapter III
section_title('BAB III','PANDUAN PENGGUNAAN NEXANET')
body('Bab ini menjelaskan tahapan penggunaan NexaNet. Sebagian halaman pembelajaran dapat dilihat tanpa masuk, tetapi masuk ke akun diperlukan untuk dashboard, profil, progres pribadi, dan penyimpanan aktivitas yang didukung oleh akun.')
heading('3.1 Mengakses Aplikasi NexaNet',2)
heading('3.1.1 Halaman Utama (Landing Page)',3)
body('Halaman utama merupakan titik awal untuk mengenal NexaNet. Pengguna dapat membaca ringkasan alur belajar dan membuka tautan menuju materi, pretest, posttest, Network Lab, Troubleshooting Lab, atau halaman masuk dan pendaftaran.')
heading('3.1.2 Register (Pendaftaran Akun)',3)
numbered(['Pilih Daftar pada halaman masuk atau tautan pendaftaran yang tersedia.', 'Isi nama, email, dan kata sandi sesuai formulir.', 'Kirim formulir pendaftaran. Setelah akun berhasil dibuat, gunakan email dan kata sandi tersebut untuk masuk.'])
heading('3.1.3 Sign In (Masuk)',3)
numbered(['Buka halaman Masuk.', 'Masukkan email dan kata sandi akun.', 'Kirim formulir. Jika berhasil, NexaNet akan membuka halaman sesuai akses akun.'])
heading('3.1.4 Lupa Kata Sandi',3)
body('Pada halaman masuk, pilih Lupa kata sandi dan masukkan email akun. Ikuti instruksi pemulihan yang ditampilkan atau dikirimkan. Tautan pemulihan berlaku terbatas dan hanya dapat digunakan satu kali. Periksa folder spam jika email tidak terlihat.')
heading('3.2 Fitur Siswa',2)
heading('3.2.1 Home / Student Dashboard',3)
body('Dashboard siswa menampilkan ringkasan belajar, seperti materi yang telah diselesaikan, jumlah video yang ditonton atau tercatat, jumlah percobaan kuis, dan rata-rata hasil kuis. Pengguna dapat memilih pintasan untuk melanjutkan materi, membuka kuis, atau menuju laboratorium.')
heading('3.2.2 Materi Pembelajaran',3)
body('Pada menu Materi, pengguna dapat mencari modul serta memfilter daftar berdasarkan kategori, tingkat kesulitan, dan status progres. Pilih kartu materi untuk membaca tujuan, isi modul, dan konten terkait. Gunakan tombol penyelesaian pada halaman materi untuk menandai materi selesai.')
for title,desc in [
('3.2.2.1 Materi Dasar Jaringan','mengenalkan perangkat, hubungan ant perangkat, komunikasi data, dan konsep dasar jaringan komputer.'),
('3.2.2.2 Materi Model OSI','membahas tujuh lapisan model OSI dan kegunaannya untuk memahami komunikasi serta menelusuri gangguan.'),
('3.2.2.3 Materi Model TCP/IP','menghubungkan lapisan TCP/IP dengan protokol yang digunakan perangkat dalam komunikasi jaringan.'),
('3.2.2.4 Materi Pengalamatan IPv4','membahas alamat IPv4, prefix, subnet mask, gateway, dan konfigurasi host.'),
('3.2.2.5 Materi Subnetting IPv4','membahas pembagian blok alamat IPv4 menjadi beberapa subnet sesuai kebutuhan host.'),
('3.2.2.6 Materi Troubleshooting Jaringan','mengenalkan pendekatan sistematis dan pemeriksaan dasar untuk menemukan sumber gangguan jaringan.')]:
    heading(title,3); body(desc[0].upper()+desc[1:])
heading('3.2.3 Video Pembelajaran',3)
body('Buka menu Video, pilih judul yang diinginkan, lalu gunakan pemutar pada halaman. Video dapat digunakan sebagai bahan pendukung materi yang sedang dipelajari.')
heading('3.2.4 Halaman Pretest',3)
body('Pretest Jaringan Dasar berisi 25 soal pilihan ganda untuk melihat pemahaman awal. Pilih satu jawaban untuk setiap soal. Jika tersedia, tombol Petunjuk dapat memberikan hint pada soal. Setelah semua soal dijawab, pilih Kirim untuk melihat nilai dan pembahasan.')
heading('3.2.5 Halaman Posttest',3)
body('Posttest Jaringan Dasar berisi 25 soal sejajar dengan pretest. Kerjakan setelah mempelajari modul dan video, lalu kirim jawaban untuk melihat nilai serta penjelasan. Bandingkan hasilnya dengan pretest sebagai gambaran perkembangan pemahaman.')
heading('3.2.6 Kuis Topik',3)
body('Menu Kuis menampilkan kuis berdasarkan topik. Pilih kuis yang diinginkan, jawab seluruh pertanyaan, kemudian kirim jawaban. Sistem menampilkan nilai dan pembahasan setelah pengiriman.')
heading('3.2.7 Network Lab',3)
body('Network Lab menyediakan simulasi topologi Star, Bus, dan Mesh. Pengguna dapat memilih topologi, menambahkan PC, laptop, server, switch, atau router, lalu memilih perangkat untuk mengatur alamat IPv4 dan prefix.')
numbered(['Pilih topologi yang ingin diamati.', 'Tambahkan perangkat jika diperlukan dan pilih perangkat untuk mengubah alamat IP atau prefix.', 'Pilih perangkat sumber dan tujuan, lalu jalankan tes konektivitas.', 'Periksa pesan hasil. Jika tidak terjangkau, tinjau kembali IP dan prefix perangkat.', 'Pada kalkulator subnet, masukkan alamat IPv4 dan prefix untuk melihat alamat jaringan, subnet mask, broadcast, dan jumlah host yang dapat digunakan.', 'Pilih Simpan untuk menyimpan konfigurasi latihan. Masuk ke akun agar penyimpanan lab dapat dilakukan.'])
heading('3.2.8 Troubleshooting Lab',3)
numbered(['Buka menu Troubleshooting dan pilih kasus yang ingin dipelajari.', 'Baca keterangan dan gejala yang ditampilkan.', 'Untuk setiap pertanyaan pemeriksaan, pilih Ya, Tidak, atau Belum diperiksa.', 'Pilih Tinjau untuk membaca arahan berdasarkan jawaban.', 'Gunakan hasilnya untuk menentukan pemeriksaan berikutnya. Lakukan pemeriksaan secara berurutan dan ubah satu hal pada satu waktu.'])
heading('3.2.9 Katalog Model Perangkat 3D',3)
body('Buka menu Model 3D dan pilih perangkat dari katalog. Putar model dengan kontrol layar atau gerakan sentuh. Pilih hotspot pada model atau titik pembelajaran pada daftar untuk membaca penjelasan komponen dan contoh penggunaannya. Jika model gagal dimuat, ilustrasi lokal dapat digunakan sebagai alternatif.')
heading('3.2.10 AI Tutor',3)
body('Buka AI Tutor, tuliskan pertanyaan tentang jaringan, lalu kirim. Pertanyaan dapat membahas konsep seperti OSI, IPv4, subnetting, atau routing. Mode layanan AI mengikuti konfigurasi NexaNet. Periksa kembali jawaban dengan materi dan sumber tepercaya. Pada materi atau kuis tertentu, bantuan AI kontekstual atau hint dapat tersedia.')
heading('3.2.11 Progres Belajar (Learning Progress)',3)
body('Halaman Progres menampilkan ringkasan materi yang sedang dipelajari atau telah selesai, hasil kuis, dan aktivitas belajar yang tercatat. Learning Path menampilkan urutan modul dan status setiap materi. Gunakan dashboard atau menu navigasi untuk kembali ke aktivitas yang ingin dilanjutkan.')
heading('3.2.12 Profil dan Pengaturan',3)
body('Pada halaman Profil, pengguna dapat memperbarui nama, kelas, dan program keahlian, lalu memilih Simpan. Email dan peran akun ditampilkan sebagai informasi. Gunakan halaman Pengaturan untuk membuka formulir perubahan kata sandi.')
heading('3.3 Fitur Guru dan Admin',2)
body('Menu administrasi hanya muncul bagi akun yang memiliki peran guru atau admin. Pengguna dengan hak akses ini dapat membuka panel Admin untuk mengelola konten dan data sesuai fitur yang tersedia.')
bulleted(['Dashboard Admin: menampilkan ringkasan data platform.', 'Materi: membuat, mengubah, menerbitkan atau membatalkan publikasi, serta menghapus materi.', 'Video: mengelola metadata video dan status publikasi.', 'Kuis dan Bank Soal: mengelola kuis serta pertanyaan yang digunakan.', 'Troubleshooting: mengelola daftar kasus diagnosis.', 'Model 3D: mengelola metadata perangkat dan hotspot pembelajaran.', 'Siswa: melihat data siswa dan mengelola peran akun yang diizinkan.', 'Analitik: melihat ringkasan dan tren penyelesaian atau hasil kuis, termasuk topik kuis yang perlu diperkuat.'])
body('Periksa judul, deskripsi, isi, dan status publikasi sebelum menyimpan. Konten yang belum dipublikasikan tidak ditampilkan dalam katalog siswa.',indent=False)
heading('3.4 Panduan Tambahan',2)
heading('3.4.1 Cara Keluar (Logout)',3)
body('Setelah selesai menggunakan akun, pilih Logout pada navigasi. NexaNet akan mengakhiri sesi akun. Pada perangkat yang digunakan bersama, pastikan proses logout selesai sebelum menutup browser.')
heading('3.4.2 Penanganan Kendala Umum',3)
for title,desc in [
('Gagal masuk','Periksa email dan kata sandi. Gunakan fitur Lupa kata sandi jika diperlukan.'),
('Materi atau video tidak ditemukan','Ubah kata pencarian atau filter yang digunakan.'),
('Hasil kuis tidak muncul','Pastikan semua soal sudah dijawab dan kirim jawaban.'),
('Tes konektivitas gagal','Periksa alamat IPv4 dan prefix perangkat sumber serta tujuan.'),
('Input kalkulator subnet tidak valid','Pastikan format IPv4 dan prefix sudah benar.'),
('Model 3D tidak tampil','Tunggu proses pemuatan atau gunakan ilustrasi yang tersedia.'),
('Progres atau lab tidak tercatat','Masuk ke akun dan ulangi penyimpanan bila tombol tersedia.'),
('Halaman tidak merespons','Muat ulang halaman dan periksa koneksi internet.')]:
    p=doc.add_paragraph(); p.paragraph_format.first_line_indent=Inches(0.35); r=p.add_run(title+'. '); r.bold=True; p.add_run(desc)
heading('3.4.3 Tips Penggunaan NexaNet',3)
bulleted(['Ikuti urutan pretest, materi dan video, posttest, lalu latihan lab.', 'Gunakan filter dan pencarian untuk menemukan konten lebih cepat.', 'Simpan progres dan latihan menggunakan akun pribadi.', 'Baca kembali pembahasan kuis dan catatan hasil praktik.', 'Periksa jawaban AI dengan materi dan sumber lain.', 'Keluar dari akun setelah selesai, khususnya pada perangkat bersama.'])

# Chapter IV
section_title('BAB IV','PENUTUP')
heading('4.1 Kesimpulan',2)
body('NexaNet menyediakan rangkaian pembelajaran jaringan komputer berbasis web yang mencakup materi, video, evaluasi pretest dan posttest, serta latihan Network Lab dan Troubleshooting Lab. Fitur pendukung seperti progres, AI Tutor, model perangkat 3D, dan panel pengelolaan membantu pengguna belajar dan mengelola konten sesuai hak akses.')
body('Dengan mengikuti panduan dalam manual book ini, siswa dapat menjalani alur belajar secara terarah, sedangkan guru atau admin dapat menggunakan fitur pengelolaan yang tersedia.')
heading('4.2 Saran',2)
body('Pengguna disarankan mengikuti urutan pembelajaran, membaca pembahasan kuis, dan menghubungkan materi dengan kegiatan praktik. Guru dan admin sebaiknya memeriksa isi serta status publikasi konten sebelum menyediakannya bagi siswa. Manual ini dapat diperbarui ketika fitur NexaNet berubah.')

# Core metadata
props=doc.core_properties; props.title='Manual Book NexaNet'; props.subject='Panduan penggunaan platform pembelajaran jaringan komputer NexaNet'; props.author='Tim Penyusun'
doc.save(OUT)
print(OUT)
