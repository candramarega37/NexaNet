export type Locale = "id" | "en";

type TranslationKeys = {
  // Navigation
  nav: {
    dashboard: string;
    materials: string;
    videos: string;
    learningPath: string;
    aiTutor: string;
    networkLab: string;
    troubleshooting: string;
    threeDModels: string;
    quizzes: string;
    progress: string;
    admin: string;
    profile: string;
    settings: string;
    logout: string;
    login: string;
    register: string;
    manualBook: string;
  };
  // Auth
  auth: {
    welcome: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    forgotPassword: string;
    noAccount: string;
    signUp: string;
    demoAccounts: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    currentPassword: string;
    currentPasswordPlaceholder: string;
    newPassword: string;
    newPasswordPlaceholder: string;
  };
  // Landing Page
  landing: {
    hero: {
      kicker: string;
      title: {
        line1: string;
        line2: string;
      };
      description: string;
      cta: {
        primary: string;
        secondary: string;
      };
      meta: {
        pretest: string;
        materials: string;
        posttest: string;
      };
    };
    flow: {
      subtitle: string;
      pretest: { title: string; desc: string; cta: string };
      materials: { title: string; desc: string; cta: string };
      posttest: { title: string; desc: string; cta: string };
      lab: { title: string; desc: string; cta: string };
    };
    materials: {
      items: { title: string; desc: string }[];
    };
    sections: {
      featured: {
        title: string;
        subtitle: string;
        allMaterials: string;
      };
      pretestPosttest: {
        title: string;
        subtitle: string;
        description: string;
        before: string;
        after: string;
        pretestTitle: string;
        pretestDesc: string;
        pretestCta: string;
        pretestFeatures: string[];
        posttestTitle: string;
        posttestDesc: string;
        posttestCta: string;
        posttestFeatures: string[];
      };
      lab: {
        title: string;
        subtitle: string;
        description: string;
        networkLab: string;
        networkLabDesc: string;
        troubleshooting: string;
        troubleshootingDesc: string;
      };
      activity: {
        title: string;
        empty: string;
      };
      closing: {
        title: string;
        subtitle: string;
        cta: {
          primary: string;
          secondary: string;
        };
      };
    };
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    pretest: string;
    materials: string;
    posttest: string;
    labs: string;
    stats: {
      completed: string;
      videos: string;
      quizzes: string;
      average: string;
    };
    continue: string;
    recommendations: string;
    startFrom: string;
    quickLinks: string;
    recentActivity: string;
  };
  // Materials
  materials: {
    title: string;
    subtitle: string;
    search: string;
    filter: string;
    allCategories: string;
    allDifficulties: string;
    duration: string;
    startLearning: string;
    progress: string;
    objectives: string;
    content: string;
    related: string;
  };
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    publish: string;
    draft: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    search: string;
    filter: string;
    sort: string;
    actions: string;
    language: string;
    indonesian: string;
    english: string;
  };
  // Admin
  admin: {
    dashboard: string;
    materials: string;
    videos: string;
    quizzes: string;
    questions: string;
    troubleshooting: string;
    threeDModels: string;
    students: string;
    analytics: string;
    addMaterial: string;
    addVideo: string;
    addQuiz: string;
    edit: string;
    delete: string;
    publish: string;
    unpublish: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
    content: string;
    objectives: string;
    published: string;
    draft: string;
    draftLabel: string;
    actions: string;
    noMaterials: string;
    addNew: string;
    save: string;
    cancel: string;
    deleteConfirm: string;
  };
  // Quizzes
  quizzes: {
    title: string;
    subtitle: string;
    pretest: string;
    posttest: string;
    start: string;
    submit: string;
    score: string;
    correct: string;
    incorrect: string;
    review: string;
    hint: string;
    time: string;
    question: string;
    answer: string;
    explanation: string;
    next: string;
    previous: string;
    finish: string;
    result: string;
    retry: string;
  };
  // Labs
  labs: {
    networkLab: string;
    troubleshooting: string;
    title: string;
    subtitle: string;
    troubleshootingSubtitle: string;
    diagnosisSteps: string;
    symptomsLabel: string;
    signsLabel: string;
    yes: string;
    no: string;
    notChecked: string;
    answerForStep: string;
    analysisTitle: string;
    pickAtLeastOne: string;
    runCheckRecord: string;
    changeOneAtATime: string;
    start: string;
    devices: string;
    connections: string;
    simulate: string;
    reset: string;
    topology: string;
  };
  // Interactive 3D model catalog
  threeD: {
    title: string; subtitle: string; devices: string; components: string; modelReady: string; illustration: string;
    eyebrow: string; intro: string; chooseDevice: string; chooseHint: string; livePreview: string; loading: string; loadError: string;
    sceneHint: string; deviceOverview: string; selectedPoint: string; example: string; learningPoints: string; noModels: string;
  };
  // Videos page
  videos: {
    title: string;
    subtitle: string;
    l1: string;
    l2: string;
    l3: string;
    kicker: string;
    minSuffix: string;
    readRelated: string;
  };
  // Shell chrome
  shell: {
    signIn: string;
    backHome: string;
    footerLine: string;
  };
  // Feature pages
  pages: {
    genericDesc: string;
    backList: string;
    toDashboard: string;
    emptyMaterials: string;
    toc: string;
    objectivesTitle: string;
    contentTitle: string;
    progressSaved: string;
    relatedDefault: string;
    quizRecommendTitle: string;
    quizRecommendSub: string;
    quizRecommendCta: string;
    questionsSuffix: string;
    quizKickerPre: string;
    quizKickerPost: string;
    quizKickerPractice: string;
    questionsWord: string;
    notePre: string;
    notePost: string;
    dashboardKicker: string;
    dashboardHello: string;
    dashboardLede: string;
    dashboardLabTitle: string;
    dashboardLabDesc: string;
    dashboardContinue: string;
    dashboardContinueDone: string;
    dashboardContinueDefault: string;
    dashboardRecommend: string;
    dashboardStartLearning: string;
    dashboardRecent: string;
    dashboardEmptyActivity: string;
    actQuizTaken: string;
    actVideoWatched: string;
    actMaterialStarted: string;
    actLabSaved: string;
    actMaterialDone: string;
    actQuizCompleted: string;
    pathKicker: string;
    pathLede: string;
    journeyTitle: string;
    journeyIntro: string;
    journeyNextStep: string;
    journeyMaterialsProgress: string;
    journeyPretestDesc: string;
    journeyMaterialsDesc: string;
    journeyPosttestDesc: string;
    journeyLabsDesc: string;
    journeyLabsSavedDesc: string;
    journeyContinuePretest: string;
    journeyContinueMaterial: string;
    journeyContinuePosttest: string;
    journeyContinueNetworkLab: string;
    journeyContinueTroubleshooting: string;
    stCompleted: string;
    stInProgress: string;
    stNotStarted: string;
    openLabel: string;
    progressKicker: string;
    progressLede: string;
    progressHProgress: string;
    progressHResults: string;
    progressHActivity: string;
    progressEmptyProgress: string;
    progressEmptyResults: string;
    progressEmptyActivity: string;
    profileKicker: string;
    profileTitle: string;
    profileLede: string;
    settingsKicker: string;
    settingsTitle: string;
    settingsLede: string;
    loginKicker: string;
    loginDemoTitle: string;
    loginDemoDesc: string;
    registerKicker: string;
    registerTitle: string;
    registerLede: string;
    forgotKicker: string;
    forgotTitle: string;
    forgotLede: string;
    resetKicker: string;
    resetTitle: string;
    resetLede: string;
    adminKickerContent: string;
    adminKickerAssess: string;
    adminKickerUsers: string;
    adminKickerThreeD: string;
    adminKickerAnalytics: string;
    adminMatTitle: string;
    adminMatLede: string;
    adminVidTitle: string;
    adminVidLede: string;
    adminQuizTitle: string;
    adminQuizBankTitle: string;
    adminQuizLede: string;
    adminStuTitle: string;
    adminStuLede: string;
    adminCaseTitle: string;
    adminCaseLede: string;
    adminThreeDTitle: string;
    adminThreeDLede: string;
    adminAnaTitle: string;
    adminAnaLede: string;
    adminDashTitle: string;
    adminDashLede: string;
    adminStatMaterials: string;
    adminStatStudents: string;
    fallbackPreviewTitle: string;
    fallbackPreviewLede: string;
    fallbackPreviewH2: string;
    fallbackB1: string;
    fallbackB2: string;
    fallbackB3: string;
    fallbackNote: string;
  };
  // Sidebar
  sidebar: {
    studyRoom: string;
    overview: string;
    learn: string;
    practice: string;
    explore: string;
    analyze: string;
    account: string;
    guide: string;
    toggleOpen: string;
    toggleClose: string;
  };
  manualBook: {
    title: string;
    kicker: string;
    intro: string;
    contentsHeading: string;
    contents1: string;
    contents2: string;
    contents3: string;
    contents4: string;
    formatsHeading: string;
    wordTitle: string;
    wordDescription: string;
    wordAction: string;
    pdfTitle: string;
    pdfDescription: string;
    pdfAction: string;
    note: string;
  };
  // Footer
  footer: {
    tagline: string;
    copyright: string;
  };
};

const translations: Record<Locale, TranslationKeys> = {
  id: {
    nav: {
      dashboard: "Dashboard",
      materials: "Materi",
      videos: "Video",
      learningPath: "Learning Path",
      aiTutor: "AI Tutor",
      networkLab: "Network Lab",
      troubleshooting: "Troubleshooting Lab",
      threeDModels: "Model 3D",
      quizzes: "Kuis",
      progress: "Progress",
      admin: "Admin",
      profile: "Profil",
      settings: "Pengaturan",
      logout: "Keluar",
      login: "Masuk",
      register: "Daftar",
      manualBook: "Manual Book",
    },
    auth: {
      welcome: "Selamat datang di NexaNet",
      subtitle: "Masuk untuk menyimpan materi, latihan, dan progress belajarmu.",
      email: "Email",
      password: "Kata sandi",
      submit: "Masuk ke NexaNet",
      forgotPassword: "Lupa kata sandi?",
      noAccount: "Belum punya akun?",
      signUp: "Daftar sebagai siswa",
      demoAccounts: "Akun demo",
      emailPlaceholder: "Masukkan email",
      passwordPlaceholder: "Masukkan kata sandi",
      currentPassword: "Kata sandi saat ini",
      currentPasswordPlaceholder: "Masukkan kata sandi saat ini",
      newPassword: "Kata sandi baru",
      newPasswordPlaceholder: "Masukkan kata sandi baru",
    },
    dashboard: {
      title: "Ruang belajarmu",
      subtitle: "Alur yang disarankan: Pretest → Materi → Posttest → Lab.",
      pretest: "Pretest (25 soal)",
      materials: "Jelajahi Materi",
      posttest: "Posttest (25 soal)",
      labs: "Masuk Network Lab",
      stats: {
        completed: "Materi selesai",
        videos: "Video ditonton",
        quizzes: "Kuis dikerjakan",
        average: "Rata-rata nilai",
      },
      continue: "Lanjutkan belajar",
      recommendations: "Rekomendasi berikutnya",
      startFrom: "Mulai dari",
      quickLinks: "Akses Cepat",
      recentActivity: "Aktivitas terbaru",
    },
    materials: {
      title: "Materi Pembelajaran",
      subtitle: "Pilih topik dan bangun pemahaman jaringan dari fondasinya.",
      search: "Cari materi...",
      filter: "Filter",
      allCategories: "Semua Kategori",
      allDifficulties: "Semua Kesulitan",
      duration: "Durasi",
      startLearning: "Mulai belajar",
      progress: "Progress",
      objectives: "Tujuan Pembelajaran",
      content: "Materi",
      related: "Konten Terkait",
    },
    common: {
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Edit",
      publish: "Terbitkan",
      draft: "Draf",
      loading: "Memuat...",
      error: "Error",
      success: "Berhasil",
      confirm: "Konfirmasi",
      back: "Kembali",
      next: "Berikutnya",
      previous: "Sebelumnya",
      close: "Tutup",
      search: "Cari",
      filter: "Filter",
      sort: "Urutkan",
      actions: "Aksi",
      language: "Bahasa",
      indonesian: "Indonesia",
      english: "English",
    },
    admin: {
      dashboard: "Admin Dashboard",
      materials: "Kelola Materi",
      videos: "Kelola Video",
      quizzes: "Kelola Kuis",
      questions: "Bank Pertanyaan",
      troubleshooting: "Kelola Troubleshooting",
      threeDModels: "Kelola Model 3D",
      students: "Kelola Siswa",
      analytics: "Analitik",
      addMaterial: "Tambah Materi",
      addVideo: "Tambah Video",
      addQuiz: "Tambah Kuis",
      edit: "Edit",
      delete: "Hapus",
      publish: "Terbitkan",
      draftLabel: "Jadikan Draf",
      title: "Judul",
      slug: "Slug URL",
      description: "Deskripsi",
      category: "Kategori",
      difficulty: "Kesulitan",
      duration: "Durasi (menit)",
      content: "Konten",
      objectives: "Tujuan Belajar",
      published: "Terbit",
      unpublish: "Nonaktifkan",
      draft: "Draf",
      actions: "Aksi",
      noMaterials: "Belum ada materi.",
      addNew: "Tambah Baru",
      save: "Simpan",
      cancel: "Batal",
      deleteConfirm: "Hapus materi ini? Progress terkait juga akan dihapus.",
    },
    quizzes: {
      title: "Latihan Pemahaman",
      subtitle: "Gunakan pertanyaan untuk memeriksa pemahamanmu.",
      pretest: "Pretest",
      posttest: "Posttest",
      start: "Mulai",
      submit: "Kirim jawaban",
      score: "Skor",
      correct: "Benar",
      incorrect: "Salah",
      review: "Tinjau",
      hint: "Petunjuk",
      time: "Waktu",
      question: "Pertanyaan",
      answer: "Jawaban",
      explanation: "Penjelasan",
      next: "Selanjutnya",
      previous: "Sebelumnya",
      finish: "Selesai",
      result: "Hasil",
      retry: "Coba Lagi",
    },
    labs: {
      networkLab: "Network Lab",
      troubleshooting: "Troubleshooting Lab",
      title: "Lab Jaringan",
      subtitle: "Rancang topologi dan amati hubungan antar perangkat.",
      troubleshootingSubtitle: "Telusuri gejala, uji kemungkinan penyebab, dan catat hasil pemeriksaan jaringan.",
      diagnosisSteps: "Langkah diagnosis",
      symptomsLabel: "GEJALA",
      signsLabel: "TANDA",
      yes: "Ya",
      no: "Tidak",
      notChecked: "Belum diperiksa",
      answerForStep: "Jawaban untuk langkah",
      analysisTitle: "Analisis berdasarkan pilihanmu",
      pickAtLeastOne: "Pilih hasil setidaknya satu langkah diagnosis.",
      runCheckRecord: "Lakukan pemeriksaan ini, lalu catat hasilnya.",
      changeOneAtATime: "Ubah satu hal pada satu waktu, ulangi pengujian, lalu catat hasilnya.",
      start: "Mulai",
      devices: "Perangkat",
      connections: "Koneksi",
      simulate: "Simulasi",
      reset: "Reset",
      topology: "Topologi",
    },
    threeD: {
      title: "Model 3D Jaringan", subtitle: "Jelajahi perangkat jaringan dalam tampilan 3D interaktif.", devices: "MODEL", components: "Komponen", modelReady: "MODEL 3D", illustration: "ILUSTRASI",
      eyebrow: "KATALOG MODEL 3D", intro: "Pilih perangkat, putar model, lalu buka titik belajar untuk memahami fungsi setiap komponennya.", chooseDevice: "PILIH PERANGKAT", chooseHint: "Pilih model untuk mulai menjelajah", livePreview: "PRATINJAU 3D", loading: "Memuat model 3D…", loadError: "Model tidak dapat dimuat; ilustrasi ditampilkan.",
      sceneHint: "Seret untuk memutar model dan gunakan roda gulir atau gestur untuk memperbesar.", deviceOverview: "RINGKASAN PERANGKAT", selectedPoint: "TITIK BELAJAR", example: "CONTOH", learningPoints: "Titik belajar", noModels: "Belum ada model 3D yang diterbitkan.",
    },
    sidebar: {
      studyRoom: "RUANG BELAJAR",
      overview: "OVERVIEW",
      learn: "BELAJAR",
      practice: "LATIHAN",
      explore: "EKSPLORASI",
      analyze: "ANALISIS & BANTUAN",
      account: "AKUN",
      guide: "PANDUAN",
      toggleOpen: "Buka navigasi",
      toggleClose: "Tutup navigasi",
    },
    manualBook: {
      title: "Manual Book NexaNet",
      kicker: "PANDUAN APLIKASI",
      intro: "Panduan penggunaan NexaNet untuk membantu siswa, guru, dan administrator menjelajahi fitur belajar dan praktik jaringan komputer.",
      contentsHeading: "Isi panduan",
      contents1: "Pengenalan NexaNet, persyaratan, membuat akun, masuk, memulihkan kata sandi, dan keluar.",
      contents2: "Fitur siswa: dashboard, learning path, materi, video, pretest/posttest, kuis, lab, model 3D, AI Tutor, progres, dan profil.",
      contents3: "Fitur Guru/Admin: mengelola materi, video, kuis dan soal, troubleshooting, model 3D, data siswa, dan analitik.",
      contents4: "Panduan kendala umum, tips penggunaan, kesimpulan, saran, dan daftar pustaka.",
      formatsHeading: "Unduh manual book",
      wordTitle: "Microsoft Word (.docx)",
      wordDescription: "Versi yang dapat diedit di Microsoft Word atau aplikasi pengolah dokumen yang kompatibel.",
      wordAction: "Unduh Word",
      pdfTitle: "PDF (.pdf)",
      pdfDescription: "Versi 40 halaman berukuran A4 yang praktis dibaca dan siap dicetak.",
      pdfAction: "Unduh PDF",
      note: "Pilih format Word jika ingin mengubah atau menambahkan catatan. Pilih PDF untuk membaca atau mencetak versi tetap.",
    },
    videos: {
      title: "Video pembelajaran",
      subtitle: "Perkuat pemahaman konsep dengan penjelasan visual.",
      l1: "Pengenalan jaringan komputer",
      l2: "Memahami model OSI",
      l3: "Dasar subnetting IPv4",
      kicker: "VIDEO PEMBELAJARAN",
      minSuffix: "MENIT",
      readRelated: "Baca materi terkait",
    },
    shell: {
      signIn: "Masuk",
      backHome: "← Kembali ke beranda",
      footerLine: "BELAJAR · PRAKTIK · TELUSURI GANGGUAN",
    },
    pages: {
      genericDesc: "Pelajari konsep, amati cara kerja, dan hubungkan dengan praktik jaringan komputer.",
      backList: "Kembali ke daftar",
      toDashboard: "Ke dashboard",
      emptyMaterials: "Belum ada materi. Jalankan seed untuk mengisi materi awal.",
      toc: "Daftar isi",
      objectivesTitle: "Tujuan pembelajaran",
      contentTitle: "Materi",
      progressSaved: "Progress tersimpan",
      relatedDefault: "Video, kuis, dan perangkat terkait",
      quizRecommendTitle: "ALUR DISARANKAN",
      quizRecommendSub: "Pretest → Materi → Posttest",
      quizRecommendCta: "Mulai dari Pretest (25 soal) →",
      questionsSuffix: "pertanyaan",
      quizKickerPre: "PRETEST",
      quizKickerPost: "POSTTEST",
      quizKickerPractice: "LATIHAN PEMAHAMAN",
      questionsWord: "SOAL",
      notePre: "Kerjakan sebelum belajar untuk mengukur pemahaman awal. Lanjut ke materi setelah selesai.",
      notePost: "Kerjakan setelah belajar untuk mengukur pemahaman akhir. Bandingkan dengan hasil pretest.",
      dashboardKicker: "OVERVIEW / RUANG BELAJAR",
      dashboardHello: "Halo,",
      dashboardLede: "Siap melanjutkan belajar TKJ?",
      dashboardLabTitle: "Network Lab",
      dashboardLabDesc: "Praktik topologi dan simulasi jaringan",
      dashboardContinue: "Lanjutkan belajar",
      dashboardContinueDone: "selesai",
      dashboardContinueDefault: "Pengantar Jaringan Komputer",
      dashboardRecommend: "REKOMENDASI BERIKUTNYA",
      dashboardStartLearning: "Mulai belajar",
      dashboardRecent: "Aktivitas terbaru",
      dashboardEmptyActivity: "Aktivitas belajar yang tersimpan akan muncul di sini.",
      actQuizTaken: "Kuis dikerjakan",
      actVideoWatched: "Video ditonton",
      actMaterialStarted: "Materi dimulai",
      actLabSaved: "Simulasi Network Lab tersimpan",
      actMaterialDone: "Materi selesai",
      actQuizCompleted: "Kuis selesai",
      pathKicker: "LEARN / ROUTE MAP",
      pathLede: "Urutan materi dari fondasi jaringan hingga analisis gangguan. Progress ditarik dari akun saat kamu masuk.",
      journeyTitle: "Perjalanan belajar",
      journeyIntro: "Ikuti urutan belajar yang disarankan dan lihat tahap yang sudah tersimpan.",
      journeyNextStep: "Langkah berikutnya",
      journeyMaterialsProgress: "materi selesai",
      journeyPretestDesc: "Ukur pemahaman awal sebelum mulai belajar.",
      journeyMaterialsDesc: "Pelajari enam materi inti secara berurutan.",
      journeyPosttestDesc: "Ukur kembali pemahaman setelah mempelajari materi.",
      journeyLabsDesc: "Simpan simulasi Network Lab, lalu lanjutkan ke Troubleshooting Lab.",
      journeyLabsSavedDesc: "Simulasi Network Lab tersimpan. Lanjutkan dengan kasus Troubleshooting Lab.",
      journeyContinuePretest: "Mulai Pretest",
      journeyContinueMaterial: "Lanjutkan materi",
      journeyContinuePosttest: "Mulai Posttest",
      journeyContinueNetworkLab: "Buka Network Lab",
      journeyContinueTroubleshooting: "Lanjut ke Troubleshooting Lab",
      stCompleted: "Selesai",
      stInProgress: "Sedang dipelajari",
      stNotStarted: "Belum dimulai",
      openLabel: "Buka",
      progressKicker: "ANALYZE / DATA BELAJAR",
      progressLede: "Ringkasan dari materi, aktivitas video, dan percobaan kuis yang tersimpan.",
      progressHProgress: "Progress materi",
      progressHResults: "Hasil kuis terakhir",
      progressHActivity: "Aktivitas terbaru",
      progressEmptyProgress: "Kamu belum memulai materi.",
      progressEmptyResults: "Belum ada hasil kuis tersimpan.",
      progressEmptyActivity: "Aktivitas belajar yang tersimpan akan muncul di sini.",
      profileKicker: "SYSTEM / PROFIL SISWA",
      profileTitle: "Profil",
      profileLede: "Kelola identitas dan informasi pendidikanmu.",
      settingsKicker: "SYSTEM / KEAMANAN AKUN",
      settingsTitle: "Pengaturan akun",
      settingsLede: "Perbarui kata sandi untuk menjaga akses akunmu.",
      loginKicker: "NEXANET / AKUN",
      loginDemoTitle: "Akun demo",
      loginDemoDesc: "Gunakan akun siswa atau admin yang dibuat dengan `npm run db:seed`. Kredensial dapat diubah melalui variabel `DEMO_*` sebelum menjalankan seed.",
      registerKicker: "NEXANET / AKUN SISWA",
      registerTitle: "Buat akun belajar",
      registerLede: "Daftar untuk menyimpan materi, latihan, dan progress belajarmu.",
      forgotKicker: "NEXANET / PEMULIHAN AKUN",
      forgotTitle: "Lupa kata sandi?",
      forgotLede: "Masukkan email akun. Jika terdaftar, instruksi pemulihan akan dikirim.",
      resetKicker: "NEXANET / PEMULIHAN AKUN",
      resetTitle: "Buat kata sandi baru",
      resetLede: "Gunakan kata sandi minimal 10 karakter. Tautan berlaku 30 menit dan hanya sekali pakai.",
      adminKickerContent: "ADMIN / CONTENT MANAGEMENT",
      adminKickerAssess: "ADMIN / ASSESSMENT",
      adminKickerUsers: "ADMIN / USERS",
      adminKickerThreeD: "ADMIN / MODEL 3D",
      adminKickerAnalytics: "ADMIN / ANALYTICS",
      adminMatTitle: "Kelola materi",
      adminMatLede: "Buat materi TKJ, sunting status terbit, dan hapus konten yang tidak digunakan.",
      adminVidTitle: "Kelola video",
      adminVidLede: "Simpan metadata video, tambahkan URL media, dan atur status publikasi.",
      adminQuizTitle: "Kelola kuis",
      adminQuizBankTitle: "Bank pertanyaan",
      adminQuizLede: "Buat kuis, atur statusnya, dan kelola pertanyaan beserta kunci jawaban di server.",
      adminStuTitle: "Kelola siswa",
      adminStuLede: "Lihat aktivitas ringkas siswa atau promosikan akun ke peran admin.",
      adminCaseTitle: "Kelola kasus troubleshooting",
      adminCaseLede: "Buat kasus diagnosis bertahap, atur gejala, lalu terbitkan untuk siswa.",
      adminThreeDTitle: "Kelola model 3D",
      adminThreeDLede: "Kelola deskripsi perangkat, titik belajar, thumbnail, dan URL model GLB/GLTF.",
      adminAnaTitle: "Analitik belajar",
      adminAnaLede: "Ringkasan konten dan aktivitas yang sudah tersimpan di basis data.",
      adminDashTitle: "Admin dashboard",
      adminDashLede: "Konten dan akses dilindungi dengan pemeriksaan peran di server.",
      adminStatMaterials: "Materi",
      adminStatStudents: "Siswa",
      fallbackPreviewTitle: "Pratinjau materi",
      fallbackPreviewLede: "Jaringan komputer menghubungkan perangkat agar dapat bertukar data dan berbagi sumber daya. Setiap perangkat menggunakan aturan komunikasi yang disepakati bersama.",
      fallbackPreviewH2: "Yang akan kamu pahami",
      fallbackB1: "Fungsi dan peran konsep dalam jaringan komputer.",
      fallbackB2: "Hubungan konsep dengan perangkat yang digunakan sehari-hari.",
      fallbackB3: "Cara mengamati dan menguji pemahaman melalui praktik.",
      fallbackNote: "AI Tutor dan lab simulasi menggunakan konfigurasi demo. Viewer model 3D memerlukan koneksi untuk memuat komponennya.",
    },
    footer: {
      tagline: "Learn. Practice. Troubleshoot.",
      copyright: "© 2026 NEXANET · PRETEST → MATERIALS → POSTTEST → LAB",
    },
    landing: {
      hero: {
        kicker: "PLATFORM BELAJAR TKJ · PRETEST → POSTTEST",
        title: {
          line1: "Ukur. Belajar.",
          line2: "Buktikan naiknya."
        },
        description: "NexaNet menyusun belajar jaringan jadi satu alur: kerjakan pretest 25 soal, pelajari materi dan video, lalu buktikan hasilnya lewat posttest 25 soal — ditutup dengan praktik lab.",
        cta: {
          primary: "Masuk & mulai belajar",
          secondary: "Lihat alur belajar"
        },
        meta: {
          pretest: "soal pretest",
          materials: "materi + video",
          posttest: "soal posttest"
        }
      },
      flow: {
        subtitle: "Satu jalur jelas, dari tes ke praktik.",
        pretest: { title: "Pretest", desc: "25 soal pilihan ganda untuk memetakan pemahaman awalmu.", cta: "Mulai pretest" },
        materials: { title: "Belajar materi", desc: "6 materi ringkas + video: dari dasar jaringan hingga troubleshooting.", cta: "Buka materi" },
        posttest: { title: "Posttest", desc: "25 soal paralel untuk mengukur kenaikan pemahamanmu.", cta: "Mulai posttest" },
        lab: { title: "Praktik lab", desc: "Uji pemahaman di Network Lab dan Troubleshooting Lab.", cta: "Masuk lab" }
      },
      materials: {
        items: [
          { title: "Dasar Jaringan Komputer", desc: "Perangkat, media, dan cara data berpindah." },
          { title: "Model OSI", desc: "Tujuh lapisan komunikasi jaringan." },
          { title: "Model TCP/IP", desc: "Lapisan internet, IP, TCP vs UDP." },
          { title: "IPv4 Addressing", desc: "Format alamat, kelas, privat, mask." },
          { title: "Subnetting IPv4", desc: "Prefix CIDR dan rentang host." },
          { title: "Troubleshooting Jaringan", desc: "Langkah teratur menemukan penyebab gangguan." }
        ]
      },
      sections: {
        featured: {
          title: "MATERI UNGGULAN",
          subtitle: "Mulai dari fondasi, naik bertahap.",
          allMaterials: "Semua materi"
        },
        pretestPosttest: {
          title: "PRETEST & POSTTEST",
          subtitle: "25 soal sebelum, 25 soal sesudah.",
          description: "Kedua paket mencakup dasar jaringan, perangkat, topologi, OSI & TCP/IP, IPv4 & subnetting, routing-switching, keamanan, dan troubleshooting — dengan soal paralel agar kenaikan skor valid.",
          before: "SEBELUM BELAJAR",
          after: "SETELAH BELAJAR",
          pretestTitle: "Pretest Jaringan Dasar",
          pretestDesc: "Petakan pemahaman awalmu. Tidak perlu sempurna — ini titik berangkatmu.",
          pretestCta: "Kerjakan pretest",
          pretestFeatures: [
            "25 pilihan ganda",
            "Skor & pembahasan langsung",
            "Tersimpan di progress kamu"
          ],
          posttestTitle: "Posttest Jaringan Dasar",
          posttestDesc: "Kerjakan setelah materi selesai dan bandingkan dengan skor pretest-mu.",
          posttestCta: "Kerjakan posttest",
          posttestFeatures: [
            "25 pilihan ganda paralel",
            "Skor & pembahasan langsung",
            "Bukti kenaikan belajar"
          ]
        },
        lab: {
          title: "RUANG PRAKTIK",
          subtitle: "Rakit. Hubungkan. Diagnosis.",
          description: "Setelah tes, buktikan pemahaman lewat simulasi: susun topologi di Network Lab dan latih pola pikir diagnosis di Troubleshooting Lab.",
          networkLab: "Masuk Network Lab",
          networkLabDesc: "Simulasi topologi star, bus, mesh",
          troubleshooting: "Troubleshooting Lab",
          troubleshootingDesc: "5 kasus: no-internet, IP conflict, DNS…",
        },
        activity: {
          title: "Aktivitas terbaru",
          empty: "Aktivitas belajarmu akan muncul di sini."
        },
        closing: {
          title: "SIAP MEMULAI BELAJARMU?",
          subtitle: "Masuk, ikuti alurnya, lihat progresmu naik.",
          cta: {
            primary: "Masuk ke dashboard",
            secondary: "Mulai pretest"
          }
        }
      }
    },
  },
  en: {
    nav: {
      dashboard: "Dashboard",
      materials: "Materials",
      videos: "Videos",
      learningPath: "Learning Path",
      aiTutor: "AI Tutor",
      networkLab: "Network Lab",
      troubleshooting: "Troubleshooting Lab",
      threeDModels: "3D Models",
      quizzes: "Quizzes",
      progress: "Progress",
      admin: "Admin",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      login: "Login",
      register: "Register",
      manualBook: "User Manual",
    },
    auth: {
      welcome: "Welcome to NexaNet",
      subtitle: "Sign in to save materials, practice, and learning progress.",
      email: "Email",
      password: "Password",
      submit: "Sign in to NexaNet",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      signUp: "Register as student",
      demoAccounts: "Demo accounts",
      emailPlaceholder: "Enter email",
      passwordPlaceholder: "Enter password",
      currentPassword: "Current password",
      currentPasswordPlaceholder: "Enter current password",
      newPassword: "New password",
      newPasswordPlaceholder: "Enter new password",
    },
    dashboard: {
      title: "Your Learning Space",
      subtitle: "Recommended flow: Pretest → Materials → Posttest → Lab.",
      pretest: "Pretest (25 questions)",
      materials: "Browse Materials",
      posttest: "Posttest (25 questions)",
      labs: "Enter Network Lab",
      stats: {
        completed: "Materials completed",
        videos: "Videos watched",
        quizzes: "Quizzes taken",
        average: "Average score",
      },
      continue: "Continue Learning",
      recommendations: "Next Recommendation",
      startFrom: "Start from",
      quickLinks: "Quick Links",
      recentActivity: "Recent Activity",
    },
    materials: {
      title: "Learning Materials",
      subtitle: "Choose a topic and build your networking knowledge from the ground up.",
      search: "Search materials...",
      filter: "Filter",
      allCategories: "All Categories",
      allDifficulties: "All Difficulties",
      duration: "Duration",
      startLearning: "Start Learning",
      progress: "Progress",
      objectives: "Learning Objectives",
      content: "Content",
      related: "Related Content",
    },
    common: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      publish: "Publish",
      draft: "Draft",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      actions: "Actions",
      language: "Language",
      indonesian: "Indonesia",
      english: "English",
    },
    admin: {
      dashboard: "Admin Dashboard",
      materials: "Manage Materials",
      videos: "Manage Videos",
      quizzes: "Manage Quizzes",
      questions: "Question Bank",
      troubleshooting: "Manage Troubleshooting",
      threeDModels: "Manage 3D Models",
      students: "Manage Students",
      analytics: "Analytics",
      addMaterial: "Add Material",
      addVideo: "Add Video",
      addQuiz: "Add Quiz",
      edit: "Edit",
      delete: "Delete",
      publish: "Publish",
      draft: "Draft",
      draftLabel: "Make Draft",
      title: "Title",
      slug: "URL Slug",
      description: "Description",
      category: "Category",
      difficulty: "Difficulty",
      duration: "Duration (mins)",
      content: "Content",
      objectives: "Objectives",
      published: "Published",
      unpublish: "Unpublish",
      actions: "Actions",
      noMaterials: "No materials yet.",
      addNew: "Add New",
      save: "Save",
      cancel: "Cancel",
      deleteConfirm: "Delete this material? Related progress will also be deleted.",
    },
    quizzes: {
      title: "Practice Quizzes",
      subtitle: "Use questions to check your understanding.",
      pretest: "Pretest",
      posttest: "Posttest",
      start: "Start",
      submit: "Submit",
      score: "Score",
      correct: "Correct",
      incorrect: "Incorrect",
      review: "Review",
      hint: "Hint",
      time: "Time",
      question: "Question",
      answer: "Answer",
      explanation: "Explanation",
      next: "Next",
      previous: "Previous",
      finish: "Finish",
      result: "Result",
      retry: "Retry",
    },
    labs: {
      networkLab: "Network Lab",
      troubleshooting: "Troubleshooting Lab",
      title: "Network Lab",
      subtitle: "Design topologies and observe device connections.",
      troubleshootingSubtitle: "Follow the symptoms, test possible causes, and record the results of each check.",
      diagnosisSteps: "Diagnosis steps",
      symptomsLabel: "SYMPTOMS",
      signsLabel: "SIGNS",
      yes: "Yes",
      no: "No",
      notChecked: "Not checked yet",
      answerForStep: "Answer for step",
      analysisTitle: "Analysis based on your picks",
      pickAtLeastOne: "Pick results for at least one diagnosis step.",
      runCheckRecord: "Run this check, then record the result.",
      changeOneAtATime: "Change one thing at a time, repeat the test, then record the result.",
      start: "Start",
      devices: "Devices",
      connections: "Connections",
      simulate: "Simulate",
      reset: "Reset",
      topology: "Topology",
    },
    threeD: {
      title: "3D Network Models", subtitle: "Explore network devices in an interactive 3D viewer.", devices: "MODELS", components: "Components", modelReady: "3D MODEL", illustration: "ILLUSTRATION",
      eyebrow: "3D MODEL CATALOG", intro: "Choose a device, rotate its model, and open a learning point to understand each component.", chooseDevice: "CHOOSE A DEVICE", chooseHint: "Select a model to start exploring", livePreview: "3D PREVIEW", loading: "Loading 3D model…", loadError: "The model could not load; showing its illustration.",
      sceneHint: "Drag to rotate the model; use the scroll wheel or a gesture to zoom.", deviceOverview: "DEVICE OVERVIEW", selectedPoint: "LEARNING POINT", example: "EXAMPLE", learningPoints: "Learning points", noModels: "No 3D models have been published yet.",
    },
    sidebar: {
      studyRoom: "LEARNING SPACE",
      overview: "OVERVIEW",
      learn: "LEARN",
      practice: "PRACTICE",
      explore: "EXPLORE",
      analyze: "ANALYZE & ASSIST",
      account: "ACCOUNT",
      guide: "GUIDE",
      toggleOpen: "Open navigation",
      toggleClose: "Close navigation",
    },
    manualBook: {
      title: "NexaNet User Manual",
      kicker: "APPLICATION GUIDE",
      intro: "A guide to NexaNet for students, teachers, and administrators exploring computer networking lessons and practice features.",
      contentsHeading: "What is inside",
      contents1: "NexaNet overview, requirements, account creation, sign-in, password recovery, and sign-out.",
      contents2: "Student features: dashboard, learning path, materials, videos, pretest/posttest, quizzes, labs, 3D models, AI Tutor, progress, and profile.",
      contents3: "Teacher/Admin features: manage materials, videos, quizzes and questions, troubleshooting, 3D models, student data, and analytics.",
      contents4: "Common issue guidance, usage tips, conclusion, recommendations, and references.",
      formatsHeading: "Download the user manual",
      wordTitle: "Microsoft Word (.docx)",
      wordDescription: "An editable file for Microsoft Word and compatible word-processing apps.",
      wordAction: "Download Word",
      pdfTitle: "PDF (.pdf)",
      pdfDescription: "A 40-page A4 edition that is easy to read and ready to print.",
      pdfAction: "Download PDF",
      note: "Choose Word to edit the manual or add notes. Choose PDF to read or print a fixed copy.",
    },
    footer: {
      tagline: "Learn. Practice. Troubleshoot.",
      copyright: "© 2026 NEXANET · PRETEST → MATERIALS → POSTTEST → LAB",
    },
    pages: {
      genericDesc: "Learn concepts, observe how things work, and connect them to computer networking practice.",
      backList: "Back to list",
      toDashboard: "To dashboard",
      emptyMaterials: "No materials yet. Run the seed script to load the starter materials.",
      toc: "Table of contents",
      objectivesTitle: "Learning objectives",
      contentTitle: "Material",
      progressSaved: "Saved progress",
      relatedDefault: "Related videos, quizzes, and devices",
      quizRecommendTitle: "RECOMMENDED FLOW",
      quizRecommendSub: "Pretest → Materials → Posttest",
      quizRecommendCta: "Start with the Pretest (25 questions) →",
      questionsSuffix: "questions",
      quizKickerPre: "PRETEST",
      quizKickerPost: "POSTTEST",
      quizKickerPractice: "PRACTICE QUIZ",
      questionsWord: "QUESTIONS",
      notePre: "Take this before studying to measure your starting knowledge. Continue to the materials when done.",
      notePost: "Take this after studying to measure your final knowledge. Compare it with your pretest result.",
      dashboardKicker: "OVERVIEW / LEARNING SPACE",
      dashboardHello: "Hello,",
      dashboardLede: "Ready to continue learning TKJ?",
      dashboardLabTitle: "Network Lab",
      dashboardLabDesc: "Topology practice and network simulation",
      dashboardContinue: "Continue learning",
      dashboardContinueDone: "done",
      dashboardContinueDefault: "Intro to Computer Networks",
      dashboardRecommend: "NEXT RECOMMENDATION",
      dashboardStartLearning: "Start learning",
      dashboardRecent: "Recent activity",
      dashboardEmptyActivity: "Your saved learning activity will appear here.",
      actQuizTaken: "Quiz taken",
      actVideoWatched: "Video watched",
      actMaterialStarted: "Material started",
      actLabSaved: "Network Lab simulation saved",
      actMaterialDone: "Material completed",
      actQuizCompleted: "Quiz completed",
      pathKicker: "LEARN / ROUTE MAP",
      pathLede: "Material order from networking foundations to troubleshooting. Progress is pulled from your account when you sign in.",
      journeyTitle: "Learning journey",
      journeyIntro: "Follow the suggested sequence and see which stages have saved progress.",
      journeyNextStep: "Next step",
      journeyMaterialsProgress: "materials completed",
      journeyPretestDesc: "Check your starting knowledge before you begin.",
      journeyMaterialsDesc: "Study the six core materials in sequence.",
      journeyPosttestDesc: "Check your understanding after studying the materials.",
      journeyLabsDesc: "Save a Network Lab simulation, then continue to Troubleshooting Lab.",
      journeyLabsSavedDesc: "Network Lab simulation saved. Continue with a Troubleshooting Lab case.",
      journeyContinuePretest: "Start the Pretest",
      journeyContinueMaterial: "Continue material",
      journeyContinuePosttest: "Start the Posttest",
      journeyContinueNetworkLab: "Open Network Lab",
      journeyContinueTroubleshooting: "Continue to Troubleshooting Lab",
      stCompleted: "Completed",
      stInProgress: "In progress",
      stNotStarted: "Not started",
      openLabel: "Open",
      progressKicker: "ANALYZE / LEARNING DATA",
      progressLede: "Summary of materials, video activity, and saved quiz attempts.",
      progressHProgress: "Material progress",
      progressHResults: "Latest quiz results",
      progressHActivity: "Recent activity",
      progressEmptyProgress: "You have not started any material.",
      progressEmptyResults: "No saved quiz results yet.",
      progressEmptyActivity: "Saved learning activity will appear here.",
      profileKicker: "SYSTEM / STUDENT PROFILE",
      profileTitle: "Profile",
      profileLede: "Manage your identity and education info.",
      settingsKicker: "SYSTEM / ACCOUNT SECURITY",
      settingsTitle: "Account settings",
      settingsLede: "Update your password to keep your account secure.",
      loginKicker: "NEXANET / ACCOUNT",
      loginDemoTitle: "Demo accounts",
      loginDemoDesc: "Use the student or admin accounts created with `npm run db:seed`. Credentials can be changed via `DEMO_*` variables before seeding.",
      registerKicker: "NEXANET / STUDENT ACCOUNT",
      registerTitle: "Create a learning account",
      registerLede: "Register to save your materials, practice, and learning progress.",
      forgotKicker: "NEXANET / ACCOUNT RECOVERY",
      forgotTitle: "Forgot your password?",
      forgotLede: "Enter your account email. If registered, recovery instructions will be sent.",
      resetKicker: "NEXANET / ACCOUNT RECOVERY",
      resetTitle: "Create a new password",
      resetLede: "Use a password of at least 10 characters. Links last 30 minutes and are single-use.",
      adminKickerContent: "ADMIN / CONTENT MANAGEMENT",
      adminKickerAssess: "ADMIN / ASSESSMENT",
      adminKickerUsers: "ADMIN / USERS",
      adminKickerThreeD: "ADMIN / 3D MODELS",
      adminKickerAnalytics: "ADMIN / ANALYTICS",
      adminMatTitle: "Manage materials",
      adminMatLede: "Create TKJ materials, edit publish status, and delete unused content.",
      adminVidTitle: "Manage videos",
      adminVidLede: "Save video metadata, add media URLs, and set publish status.",
      adminQuizTitle: "Manage quizzes",
      adminQuizBankTitle: "Question bank",
      adminQuizLede: "Create quizzes, set their status, and manage questions with answer keys on the server.",
      adminStuTitle: "Manage students",
      adminStuLede: "View brief student activity or promote accounts to admin.",
      adminCaseTitle: "Manage troubleshooting cases",
      adminCaseLede: "Create step-by-step diagnosis cases, set symptoms, then publish them for students.",
      adminThreeDTitle: "Manage 3D models",
      adminThreeDLede: "Manage device descriptions, learning hotspots, thumbnails, and GLB/GLTF model URLs.",
      adminAnaTitle: "Learning analytics",
      adminAnaLede: "Summary of content and activity stored in the database.",
      adminDashTitle: "Admin dashboard",
      adminDashLede: "Content and access protected by server-side role checks.",
      adminStatMaterials: "Materials",
      adminStatStudents: "Students",
      fallbackPreviewTitle: "Material preview",
      fallbackPreviewLede: "Computer networks connect devices so they can exchange data and share resources. Each device follows mutually agreed communication rules.",
      fallbackPreviewH2: "What you will understand",
      fallbackB1: "The function and role of concepts in computer networks.",
      fallbackB2: "How concepts relate to everyday devices.",
      fallbackB3: "How to observe and test understanding through practice.",
      fallbackNote: "AI Tutor and simulation labs use demo configuration. The 3D viewer needs a network connection to load its viewer module.",
    },
    videos: {
      title: "Learning videos",
      subtitle: "Strengthen your understanding with visual explanations.",
      l1: "Intro to computer networks",
      l2: "Understanding the OSI model",
      l3: "IPv4 subnetting basics",
      kicker: "LEARNING VIDEO",
      minSuffix: "MIN",
      readRelated: "Read related materials",
    },
    shell: {
      signIn: "Sign in",
      backHome: "← Back to home",
      footerLine: "LEARN · PRACTICE · TROUBLESHOOT",
    },
    landing: {
      hero: {
        kicker: "TKJ LEARNING PLATFORM · PRETEST → POSTTEST",
        title: {
          line1: "Measure. Learn.",
          line2: "Prove the growth."
        },
        description: "NexaNet organizes network learning into a single flow: take the 25-question pretest, study materials and videos, then prove your progress with the 25-question posttest — wrapped up with hands-on labs.",
        cta: {
          primary: "Sign in & start learning",
          secondary: "View learning flow"
        },
        meta: {
          pretest: "pretest questions",
          materials: "materials + videos",
          posttest: "posttest questions"
        }
      },
      flow: {
        subtitle: "One clear path, from test to practice.",
        pretest: { title: "Pretest", desc: "25 multiple choice questions to map your initial understanding.", cta: "Start pretest" },
        materials: { title: "Learn materials", desc: "6 concise materials + videos: from network basics to troubleshooting.", cta: "Open materials" },
        posttest: { title: "Posttest", desc: "25 parallel questions to measure your understanding gain.", cta: "Start posttest" },
        lab: { title: "Practice lab", desc: "Test your understanding in Network Lab and Troubleshooting Lab.", cta: "Enter lab" }
      },
      materials: {
        items: [
          { title: "Computer Network Basics", desc: "Devices, media, and how data moves." },
          { title: "OSI Model", desc: "Seven layers of network communication." },
          { title: "TCP/IP Model", desc: "Internet layers, IP, TCP vs UDP." },
          { title: "IPv4 Addressing", desc: "Address format, classes, private, mask." },
          { title: "IPv4 Subnetting", desc: "CIDR prefixes and host ranges." },
          { title: "Network Troubleshooting", desc: "Systematic steps to find root causes." }
        ]
      },
      sections: {
        featured: {
          title: "FEATURED MATERIALS",
          subtitle: "Start from basics, progress gradually.",
          allMaterials: "All materials"
        },
        pretestPosttest: {
          title: "PRETEST & POSTTEST",
          subtitle: "25 questions before, 25 questions after.",
          description: "Both packages cover network basics, devices, topologies, OSI & TCP/IP, IPv4 & subnetting, routing-switching, security, and troubleshooting — with parallel questions for valid gain measurement.",
          before: "BEFORE LEARNING",
          after: "AFTER LEARNING",
          pretestTitle: "Basic Network Pretest",
          pretestDesc: "Map your initial understanding. No need to be perfect — this is your starting point.",
          pretestCta: "Take pretest",
          pretestFeatures: [
            "25 multiple choice",
            "Score & instant review",
            "Saved to your progress"
          ],
          posttestTitle: "Basic Network Posttest",
          posttestDesc: "Take after completing materials and compare with your pretest score.",
          posttestCta: "Take posttest",
          posttestFeatures: [
            "25 parallel multiple choice",
            "Score & instant review",
            "Proof of learning gain"
          ]
        },
        lab: {
          title: "PRACTICE LAB",
          subtitle: "Build. Connect. Diagnose.",
          description: "After the tests, prove your understanding through simulation: build topologies in Network Lab and practice diagnostic thinking in Troubleshooting Lab.",
          networkLab: "Enter Network Lab",
          networkLabDesc: "Simulate star, bus, mesh topologies",
          troubleshooting: "Troubleshooting Lab",
          troubleshootingDesc: "5 cases: no-internet, IP conflict, DNS…",
        },
        activity: {
          title: "Recent Activity",
          empty: "Your learning activity will appear here."
        },
        closing: {
          title: "READY TO START LEARNING?",
          subtitle: "Sign in, follow the flow, watch your progress grow.",
          cta: {
            primary: "Sign in to dashboard",
            secondary: "Start pretest"
          }
        }
      }
    }
  },
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let obj: Record<string, unknown> = translations[locale];
  for (const k of keys) {
    if (obj && typeof obj === "object" && k in obj) {
      obj = obj[k] as Record<string, unknown>;
    } else {
      return key;
    }
  }
  return typeof obj === "string" ? obj : key;
}
