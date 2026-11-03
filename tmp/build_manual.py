from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path

OUT = Path(r'C:\Users\Windows 11\nexanet\docs\Manual-Pengguna-NexaNet.docx')
OUT.parent.mkdir(parents=True, exist_ok=True)
doc = Document()
sec = doc.sections[0]
sec.top_margin = Inches(0.72)
sec.bottom_margin = Inches(0.72)
sec.left_margin = Inches(0.82)
sec.right_margin = Inches(0.82)

# Clean, readable document typography
styles = doc.styles
normal = styles['Normal']
normal.font.name = 'Aptos'
normal._element.rPr.rFonts.set(qn('w:ascii'), 'Aptos')
normal._element.rPr.rFonts.set(qn('w:hAnsi'), 'Aptos')
normal.font.size = Pt(10.5)
normal.font.color.rgb = RGBColor(42, 50, 57)
normal.paragraph_format.space_after = Pt(5)
normal.paragraph_format.line_spacing = 1.12
for stylename, size in [('Title', 30), ('Heading 1', 18), ('Heading 2', 12.5), ('Heading 3', 11)]:
    st = styles[stylename]
    st.font.name = 'Aptos Display' if stylename != 'Heading 3' else 'Aptos'
    st._element.rPr.rFonts.set(qn('w:ascii'), st.font.name)
    st._element.rPr.rFonts.set(qn('w:hAnsi'), st.font.name)
    st.font.size = Pt(size)
    st.font.bold = stylename != 'Title' or True
    st.font.color.rgb = RGBColor(0, 0, 0)
    st.paragraph_format.keep_with_next = True
    st.paragraph_format.space_before = Pt(10 if stylename != 'Title' else 0)
    st.paragraph_format.space_after = Pt(5)

# Header and page number footer
header = sec.header.paragraphs[0]
header.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = header.add_run('NEXANET  /  PANDUAN PENGGUNA')
r.font.name = 'Aptos'; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = RGBColor(82, 93, 102)
footer = sec.footer.paragraphs[0]
footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
rr = footer.add_run('NexaNet  •  ')
rr.font.name = 'Aptos'; rr.font.size = Pt(8); rr.font.color.rgb = RGBColor(82, 93, 102)
fld = OxmlElement('w:fldSimple'); fld.set(qn('w:instr'), 'PAGE')
footer._p.append(fld)

# Cover
p = doc.add_paragraph()
p.paragraph_format.space_before = Pt(90)
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('NEXANET')
run.bold = True; run.font.name = 'Aptos Display'; run.font.size = Pt(15); run.font.color.rgb = RGBColor(30, 103, 100)
p = doc.add_paragraph(style='Title'); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run('Manual Pengguna')
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(4)
r = p.add_run('Panduan Platform Pembelajaran Teknik Komputer dan Jaringan')
r.font.name = 'Aptos'; r.font.size = Pt(13); r.font.color.rgb = RGBColor(55, 65, 72)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(30)
r = p.add_run('PRETEST  →  MATERI  →  POSTTEST  →  LAB')
r.bold = True; r.font.size = Pt(10); r.font.color.rgb = RGBColor(30, 103, 100)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(120)
r = p.add_run('Learn. Practice. Troubleshoot.')
r.italic = True; r.font.size = Pt(11); r.font.color.rgb = RGBColor(82, 93, 102)
doc.add_page_break()

# Intro and contents
doc.add_heading('Panduan ini', level=1)
doc.add_paragraph('Manual ini menjelaskan cara menggunakan NexaNet untuk belajar jaringan komputer, mengukur pemahaman, dan berlatih melalui simulasi. Ikuti alur pretest, materi dan video, posttest, lalu latihan lab. Masuk ke akun agar progres dan aktivitas yang mendukung penyimpanan dapat dicatat.')
doc.add_heading('Daftar isi', level=2)
for line in [
    '1. Tentang NexaNet dan persiapan', '2. Akun dan akses', '3. Menu utama',
    '4. Alur belajar siswa', '5. Network Lab', '6. Troubleshooting Lab',
    '7. AI Tutor dan model 3D', '8. Progres dan profil',
    '9. Panduan guru dan admin', '10. Mengatasi kendala', '11. Saran penggunaan'
]:
    p = doc.add_paragraph(style='List Bullet'); p.paragraph_format.space_after = Pt(1); p.add_run(line)

def h1(text): doc.add_heading(text, level=1)
def h2(text): doc.add_heading(text, level=2)
def para(text): doc.add_paragraph(text)
def bullets(items):
    for item in items:
        p = doc.add_paragraph(style='List Bullet'); p.add_run(item)
def steps(items):
    for item in items:
        p = doc.add_paragraph(style='List Number'); p.add_run(item)

h1('1. Tentang NexaNet dan persiapan')
para('NexaNet adalah platform pembelajaran Teknik Komputer dan Jaringan (TKJ). Platform ini menyediakan materi, video, kuis, tutor AI, simulasi jaringan, latihan diagnosis gangguan, dan katalog perangkat 3D.')
h2('Yang diperlukan')
bullets(['Komputer, laptop, tablet, atau ponsel dengan browser web.', 'Koneksi internet untuk membuka platform dan memutar konten video.', 'Akun NexaNet untuk membuka dashboard, melihat progres pribadi, dan menyimpan aktivitas lab.'])

h1('2. Akun dan akses')
h2('Membuat akun')
steps(['Buka halaman NexaNet dan pilih Daftar.', 'Isi nama, alamat email, dan kata sandi sesuai petunjuk.', 'Kirim formulir. Setelah pendaftaran berhasil, masuk dengan email dan kata sandi tersebut.'])
h2('Masuk dan pemulihan kata sandi')
steps(['Pilih Masuk, masukkan email serta kata sandi, lalu kirim formulir.', 'Jika lupa kata sandi, pilih Lupa kata sandi dan masukkan email akun.', 'Ikuti instruksi pemulihan. Tautan pemulihan bersifat sekali pakai dan berlaku selama waktu yang ditentukan.'])
para('Jika email pemulihan tidak terlihat, periksa folder spam. Hubungi pengelola NexaNet bila masih mengalami kendala.')

h1('3. Menu utama')
bullets([
    'Dashboard: ringkasan belajar dan pintasan untuk melanjutkan aktivitas.',
    'Materi dan Video: modul dan video pembelajaran jaringan.',
    'Learning Path: urutan materi yang disarankan.',
    'Kuis: pretest, posttest, dan kuis berdasarkan topik.',
    'Network Lab dan Troubleshooting: simulasi topologi, subnet, serta latihan diagnosis.',
    'Model 3D: katalog perangkat dengan penanda komponen interaktif.',
    'Progres, AI Tutor, Profil, dan Pengaturan: pemantauan belajar, bantuan, dan pengelolaan akun.',
    'Admin: menu pengelolaan yang hanya tersedia bagi guru atau admin.'
])
para('Gunakan kolom Pencarian untuk menemukan materi, video, kuis, kasus troubleshooting, atau model 3D. Pilihan bahasa tersedia melalui pengalih bahasa pada navigasi.')

h1('4. Alur belajar siswa')
h2('Langkah 1 — Kerjakan pretest')
steps(['Buka Pretest Jaringan Dasar.', 'Baca soal dan pilih satu jawaban untuk setiap soal. Gunakan tombol petunjuk bila tersedia.', 'Pastikan semua soal telah dijawab, lalu pilih Kirim.', 'Tinjau nilai dan pembahasan sebagai gambaran pemahaman awal.'])
h2('Langkah 2 — Pelajari materi dan video')
steps(['Buka Materi. Cari modul atau gunakan filter kategori, tingkat kesulitan, dan status progres.', 'Pilih materi. Baca tujuan pembelajaran dan isi modul.', 'Gunakan konten terkait untuk membuka video, kuis, atau model 3D yang relevan.', 'Tandai materi selesai dengan tombol penyelesaian pada halaman materi.', 'Buka Video untuk memilih dan memutar video pembelajaran.'])
para('Enam modul yang tersedia membahas dasar jaringan komputer, model OSI, model TCP/IP, pengalamatan IPv4, subnetting IPv4, dan troubleshooting jaringan.')
h2('Langkah 3 — Kerjakan posttest')
steps(['Setelah mempelajari materi, buka Posttest Jaringan Dasar.', 'Jawab semua soal dan pilih Kirim.', 'Tinjau nilai serta pembahasan, lalu bandingkan dengan hasil pretest untuk melihat perkembangan pemahaman.'])

h1('5. Network Lab')
para('Network Lab membantu mempelajari susunan topologi, konfigurasi alamat perangkat, konektivitas, dan subnet IPv4.')
h2('Mencoba topologi dan konektivitas')
steps(['Buka Network Lab, lalu pilih topologi Star, Bus, atau Mesh.', 'Amati susunan koneksi. Tambahkan perangkat PC, laptop, server, switch, atau router bila diperlukan.', 'Pilih perangkat dan atur alamat IPv4 serta prefix.', 'Pilih perangkat sumber dan tujuan, lalu jalankan tes konektivitas.', 'Jika tes gagal, periksa kembali alamat IP dan prefix kedua perangkat.'])
h2('Menghitung subnet dan menyimpan latihan')
steps(['Masukkan alamat IPv4 dan pilih prefix CIDR, misalnya /24.', 'Periksa alamat jaringan, subnet mask, broadcast, dan jumlah host yang dapat digunakan.', 'Jika input ditolak, periksa format alamat dan prefix.', 'Pilih Simpan untuk mencatat hasil lab pada akun. Anda perlu masuk agar aktivitas dapat disimpan.'])

h1('6. Troubleshooting Lab')
steps(['Buka Troubleshooting dan pilih kasus yang sesuai.', 'Baca deskripsi serta gejala yang ditampilkan.', 'Ikuti langkah diagnosis. Untuk tiap langkah, pilih Ya, Tidak, atau Belum diperiksa.', 'Pilih Tinjau untuk melihat arahan berdasarkan jawaban.', 'Lanjutkan pemeriksaan secara sistematis dan ubah satu hal pada satu waktu.'])

h1('7. AI Tutor dan model 3D')
h2('AI Tutor')
steps(['Buka AI Tutor.', 'Ketik pertanyaan tentang jaringan, seperti OSI, IPv4, subnetting, atau routing.', 'Kirim pertanyaan dan baca jawaban yang muncul.'])
para('Mode AI ditentukan oleh konfigurasi layanan NexaNet. Periksa kembali jawaban AI dengan materi pembelajaran dan sumber tepercaya. Pada materi atau kuis tertentu, bantuan AI juga dapat menyediakan jawaban kontekstual atau petunjuk.')
h2('Model perangkat 3D')
steps(['Buka Model 3D dan pilih perangkat dari katalog.', 'Putar model menggunakan kontrol layar atau gerakan sentuh.', 'Pilih penanda pada model atau titik pembelajaran dalam daftar.', 'Baca penjelasan komponen dan contoh penggunaannya.'])
para('Jika model 3D gagal dimuat, gunakan ilustrasi perangkat yang tampil sebagai alternatif.')

h1('8. Progres dan profil')
h2('Melihat progres')
para('Buka Progres untuk melihat status penyelesaian materi, hasil kuis, dan aktivitas belajar yang tercatat pada akun. Dashboard juga menampilkan ringkasan dan pintasan belajar.')
h2('Memperbarui profil dan kata sandi')
steps(['Buka Profil untuk mengubah nama, kelas, atau program keahlian.', 'Pilih Simpan untuk menerapkan perubahan.', 'Buka Pengaturan untuk menggunakan formulir perubahan kata sandi. Ikuti petunjuk pada halaman.'])
para('Email dan informasi akun tertentu, seperti peran, ditampilkan sebagai informasi dan tidak dapat diubah melalui formulir profil.')

h1('9. Panduan guru dan admin')
para('Akun guru dan admin memiliki menu Admin tambahan. Dari panel ini, pengelola dapat:')
bullets(['Mengelola materi, termasuk membuat, mengubah, menerbitkan, membatalkan publikasi, dan menghapus.', 'Mengelola informasi video.', 'Mengelola kuis dan bank soal.', 'Mengelola kasus troubleshooting serta katalog model 3D dan titik pembelajarannya.', 'Mengelola peran siswa.', 'Melihat ringkasan analitik, tren penyelesaian, hasil kuis, dan topik yang perlu diperkuat.'])
para('Periksa kembali judul, deskripsi, isi, dan status publikasi sebelum menyimpan perubahan. Konten yang belum dipublikasikan tidak tampil pada katalog siswa.')

h1('10. Mengatasi kendala')
items = [
    ('Tidak dapat masuk', 'Periksa email dan kata sandi. Gunakan fitur pemulihan jika kata sandi terlupa.'),
    ('Konten tidak ditemukan', 'Hapus kata pencarian atau ubah filter kategori, kesulitan, atau status.'),
    ('Hasil kuis tidak muncul', 'Pastikan seluruh soal dijawab, lalu kirim jawaban.'),
    ('Tes konektivitas gagal', 'Periksa alamat IPv4 dan prefix pada perangkat sumber dan tujuan.'),
    ('Kalkulator subnet menolak input', 'Pastikan alamat IPv4 valid dan prefix yang dipilih berada dalam pilihan yang tersedia.'),
    ('Model 3D tidak tampil', 'Tunggu pemuatan atau gunakan ilustrasi yang tersedia.'),
    ('Progres tidak tersimpan', 'Masuk ke akun sebelum melakukan aktivitas yang ingin dicatat.'),
    ('Halaman tidak merespons', 'Muat ulang halaman dan periksa koneksi internet.')
]
for title, detail in items:
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(4)
    r = p.add_run(title + '. '); r.bold = True
    p.add_run(detail)

h1('11. Saran penggunaan')
bullets(['Kerjakan pretest sebelum memulai materi.', 'Pelajari modul secara berurutan dan gunakan video sebagai pendukung.', 'Kerjakan posttest setelah menyelesaikan materi.', 'Gunakan Network Lab untuk mencoba topologi dan subnetting.', 'Gunakan Troubleshooting Lab untuk berlatih mendiagnosis gangguan.', 'Gunakan akun pribadi agar progres dan latihan yang mendukung penyimpanan dapat dicatat.', 'Jadikan jawaban AI sebagai bantuan belajar dan lakukan pemeriksaan silang.'])

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_before = Pt(14)
r = p.add_run('NexaNet  |  Learn. Practice. Troubleshoot.')
r.bold = True; r.font.color.rgb = RGBColor(30, 103, 100); r.font.size = Pt(10)

doc.core_properties.title = 'Manual Pengguna NexaNet'
doc.core_properties.subject = 'Panduan penggunaan platform pembelajaran TKJ NexaNet'
doc.core_properties.author = 'NexaNet'
doc.save(OUT)
print(OUT)
