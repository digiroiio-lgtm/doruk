const pages = [
  { id: "home", label: "Genel Bakış" },
  { id: "dashboard", label: "Teknik Kadro Kontrol Paneli" },
  { id: "players", label: "Sporcu Profili" },
  { id: "training", label: "Antrenman Yükü" },
  { id: "medical", label: "Medikal Kontrol Paneli" },
  { id: "ai-predictions", label: "YZ Sakatlık Risk Skoru" },
  { id: "reports", label: "Raporlar" },
  { id: "settings", label: "Ayarlar" }
];

const architecture = [
  "Garmin API", "WHOOP API", "Polar", "Catapult Dışa Aktarım", "Apple Health", "Google Fit", "Kan Testleri",
  "Uyku", "Beslenme", "Antrenman Yükü", "YZ Motoru", "Risk Zekâsı", "Performans Zekâsı",
  "Hazırlık Skoru", "Türkçe Kontrol Paneli", "Kulüp Doktoru", "Performans Departmanı", "Baş Antrenör"
];

const aiEngineCards = [
  ["Büyük Dil Modelleri", "Çok kaynaklı sporcu notlarını ve antrenman bağlamını aranabilir zekâya dönüştür."],
  ["Zaman Serisi Analizi", "Proaktif planlama için günlük ve haftalık yük/toparlanma eğilimlerini modelle."],
  ["Anomali Tespiti", "Görünür performans düşüşlerinden önce olağandışı biyobelirteç ve hazırlık değişimlerini işaretle."],
  ["XGBoost", "Sakatlık ve uygunluk sonuçları için güçlü tablo tabanlı risk tahmini sun."],
  ["LightGBM", "Kadro düzeyinde öneri senaryoları için hızlı, yüksek performanslı gradyan artırma çalıştır."],
  ["Transformer Modeller", "Antrenman ve medikal geçmişlerdeki uzun menzilli zamansal bağımlılıkları yakala."],
  ["Özellik Mühendisliği", "Güvenilir akut/kronik yük, KHA, uyku ve esenlik göstergeleri oluştur."],
  ["Tahmin Motoru", "Hazırlık, yorgunluk ve oyuna dönüş trajektörlerini sürekli puanla."],
  ["RAG Bilgi Tabanı", "YZ önerilerini klinik protokoller ve kulüp işletim prosedürlerine dayandır."],
  ["Bulut Altyapısı", "Veri alımı, model sunumu ve rol tabanlı analizleri güvenli şekilde ölçekte yönet."]
];

const dorukCompanyArchitecture = [
  ["DORUK AI", "İnsan Performansı Zekâsı"],
  ["DORUK Medical", "Spor Hekimliği Platformu"],
  ["DORUK Vision", "Bilgisayarlı Görü & Video Analitiği"],
  ["DORUK Scout", "YZ Yetenek Zekâsı"],
  ["DORUK Labs", "Araştırma & Yapay Zekâ"],
  ["DORUK Cloud", "Veri Platformu"]
];

const reportTitles = [
  "Haftalık Hazırlık Raporu", "Aylık Performans Raporu", "Sezon Uygunluk Analizi",
  "Sakatlık Özeti", "Yük Özeti", "Hazırlık Raporu", "Performans Raporu"
];

const staffRoles = [
  ["Spor Bilimcisi", "Antrenman yükü progresyonu, hazırlık güveni ve sprint maruziyet panelleri."],
  ["Fizyoterapist", "Toparlanma belirteçleri, tedavi uyumu ve oyuna dönüş tahminleri."],
  ["Kulüp Doktoru", "Medikal risk zekâsı, kan biyobelirteç deltaları ve sakatlık gözetimi."],
  ["Baş Antrenör", "Uygunluk tahmini, taktiksel yük uyumu ve haftalık öneri genel bakışı."],
  ["Sportif Direktör", "Kadro dayanıklılık KPI'ları, yatırım koruma ve sezon uzunluğu uygunluk raporları."]
];

const names = [
  "Arda Güler", "Hakan Çalhanoğlu", "Kenan Yıldız", "Barış Alper Yılmaz", "Mert Müldür",
  "Orkun Kökçü", "İsmail Yüksek", "Cengiz Ünder", "Ahmetcan Kaplan", "Doğan Alemdar",
  "Kaan Ayhan", "Ferdi Kadıoğlu", "Abdülkerim Bardakcı", "Salih Özcan", "Semih Kılıçsoy",
  "Luka Modrić", "Martin Ødegaard", "Jude Bellingham", "Pedri González", "Victor Osimhen",
  "Heung-min Son", "Mohamed Salah", "Virgil van Dijk", "Rodri Hernández", "Kevin De Bruyne"
];

// Baseline readiness score before sleep/load adjustments.
const READINESS_BASE = 78;
// Clamp readiness output to a realistic squad range.
const READINESS_MIN = 62;
const READINESS_MAX = 96;
// Clamp injury risk output to a realistic demo range.
const INJURY_RISK_MIN = 6;
const INJURY_RISK_MAX = 49;
// Baseline target sleep duration (hours) used in risk scoring.
const SLEEP_BASELINE = 7.8;
// Readiness gap anchor used to increase risk when readiness falls.
const READINESS_GAP_BASE = 85;
// Normalizes acute/chronic load difference impact.
const LOAD_DIFF_DIVISOR = 18;
// Maintains one decimal place when calculating displayed recovery hours.
const RECOVERY_DECIMAL_FACTOR = 10;
// AI recommendation keeps 85% of current acute load for high-risk profiles.
const RECOMMENDED_LOAD_REDUCTION_FACTOR = 0.85;
const LOAD_REDUCTION_PERCENT = Math.round((1 - RECOMMENDED_LOAD_REDUCTION_FACTOR) * 100);
// Injury-risk threshold above which recovery-first recommendations are shown.
const RECOVERY_RECOMMENDATION_THRESHOLD = 28;

const players = names.map((name, i) => {
  const acute = 520 + i * 7;
  const chronic = 580 + i * 5;
  const sleep = 6.4 + (i % 5) * 0.35;
  const hrv = 55 + (i % 8) * 3;
  const readiness = Math.max(
    READINESS_MIN,
    Math.min(READINESS_MAX, Math.round(READINESS_BASE + sleep * 2 - (acute - chronic) / LOAD_DIFF_DIVISOR))
  );
  const injuryRisk = Math.max(
    INJURY_RISK_MIN,
    Math.min(
      INJURY_RISK_MAX,
      Math.round((acute / chronic) * 20 + (SLEEP_BASELINE - sleep) * 5 + (READINESS_GAP_BASE - readiness) / 2)
    )
  );
  return {
    name,
    position: ["GK", "RB", "CB", "LB", "DM", "CM", "AM", "RW", "LW", "ST"][i % 10],
    age: 18 + (i % 15),
    sleep: sleep.toFixed(1),
    hrv,
    heartRate: 49 + (i % 9),
    gpsDistance: 8.5 + (i % 6) * 0.7,
    nutrition: 74 + (i % 12),
    wellness: 70 + (i % 17),
    biomarkers: 68 + (i % 20),
    acuteLoad: acute,
    chronicLoad: chronic,
    readiness,
    injuryRisk,
    fatigueRisk: Math.min(95, injuryRisk + 9),
    overtrainingRisk: Math.min(92, injuryRisk + 4),
    availability: 100 - Math.floor(injuryRisk * 1.1)
  };
});

const topNav = document.getElementById("top-nav");
const sidebar = document.getElementById("sidebar");

function renderNav(container, variant = "top") {
  pages.forEach((page) => {
    const button = document.createElement("button");
    button.textContent = page.label;
    button.dataset.target = page.id;
    button.addEventListener("click", () => activatePage(page.id));
    if (variant === "side" && page.id === "home") return;
    container.appendChild(button);
  });
}

function activatePage(id) {
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.id === id));
  document.querySelectorAll("#top-nav button, #sidebar button").forEach((button) => {
    button.classList.toggle("active", button.dataset.target === id);
  });
}

function renderArchitecture() {
  const flow = document.getElementById("architecture-flow");
  architecture.forEach((item, idx) => {
    const node = document.createElement("span");
    node.className = "node";
    node.textContent = item;
    flow.appendChild(node);
    if (idx < architecture.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";
      flow.appendChild(arrow);
    }
  });
}

function renderCompanyArchitecture() {
  const container = document.getElementById("company-architecture");
  dorukCompanyArchitecture.forEach(([title, detail]) => {
    const card = document.createElement("article");
    card.innerHTML = `<h4>${title}</h4><p>${detail}</p>`;
    container.appendChild(card);
  });
}

function renderKPIs() {
  const avgReadiness = Math.round(players.reduce((s, p) => s + p.readiness, 0) / players.length);
  const avgRisk = Math.round(players.reduce((s, p) => s + p.injuryRisk, 0) / players.length);
  const avgLoad = Math.round(players.reduce((s, p) => s + p.acuteLoad, 0) / players.length);
  const avgAvailability = Math.round(players.reduce((s, p) => s + p.availability, 0) / players.length);
  const avgRecovery = Math.round(
    (players.reduce((s, p) => s + Number(p.sleep), 0) / players.length) * RECOVERY_DECIMAL_FACTOR
  );

  document.getElementById("hero-readiness").textContent = `${avgReadiness}%`;
  document.getElementById("hero-risk").textContent = `${avgRisk}%`;
  document.getElementById("hero-availability").textContent = `${avgAvailability}%`;

  const kpis = [
    ["Takım Hazırlığı", `${avgReadiness}%`, "Kadroda YZ hazırlık güveni"],
    ["Ortalama Risk", `${avgRisk}%`, "Sakatlık risk skoru (sürekli 7 gün)"],
    ["Antrenman Yükü", `${avgLoad}`, "Giyilebilir + saha seanslarından akut yük toplamı"],
    ["Uygunluk", `${avgAvailability}%`, "7 günlük oyuncu uygunluk tahmini"],
    ["Toparlanma", `${avgRecovery / RECOVERY_DECIMAL_FACTOR}s`, "Ortalama uyku ve KHA ayarlı toparlanma"],
  ];

  const kpiGrid = document.getElementById("kpi-grid");
  kpis.forEach(([title, value, desc]) => {
    const card = document.createElement("article");
    card.className = "glass";
    card.innerHTML = `<h3>${title}</h3><strong>${value}</strong><p>${desc}</p>`;
    kpiGrid.appendChild(card);
  });
}

function drawChart(canvasId, values, color) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const max = Math.max(...values) * 1.1;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(120,166,255,.25)";
  for (let i = 0; i < 5; i++) {
    const y = 20 + i * ((h - 40) / 4);
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = 30 + i * ((w - 60) / (values.length - 1));
    const y = h - 20 - (v / max) * (h - 45);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
}

function drawBars(canvasId, values, colors) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const total = values.reduce((a, b) => a + b, 0);
  ctx.clearRect(0, 0, w, h);
  values.forEach((v, i) => {
    const barW = (w - 80) / values.length;
    const x = 40 + i * barW;
    const y = h - 20 - (v / total) * (h - 50);
    const barH = h - 20 - y;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x + 8, y, barW - 14, barH);
  });
}

function renderHeatmap() {
  const heatmap = document.getElementById("risk-heatmap");
  players.slice(0, 21).forEach((player) => {
    const cell = document.createElement("span");
    const risk = player.injuryRisk;
    cell.style.background = risk > 32 ? "rgba(255,84,112,.72)" : risk > 20 ? "rgba(255,189,74,.72)" : "rgba(54,231,167,.72)";
    cell.title = `${player.name} • Risk ${risk}%`;
    heatmap.appendChild(cell);
  });
}

function renderAlerts() {
  const alerts = document.getElementById("alerts");
  players
    .filter((player) => player.injuryRisk > 30)
    .slice(0, 5)
    .forEach((player) => {
      const item = document.createElement("li");
      item.textContent = `${player.name}: yüksek yorgunluk (%${player.fatigueRisk}) — önerilen yük azaltımı %${LOAD_REDUCTION_PERCENT}.`;
      alerts.appendChild(item);
    });
}

function renderPlayerProfile(index = 0) {
  const player = players[index];
  const profile = document.getElementById("player-profile");
  const data = [
    ["Kişisel Bilgiler", `${player.name} · ${player.position} · ${player.age}`],
    ["Antrenman Geçmişi", `Akut ${player.acuteLoad} / Kronik ${player.chronicLoad}`],
    ["Toparlanma", `${player.sleep} saat uyku · KHA ${player.hrv}`],
    ["Esenlik", `${player.wellness}/100 kendi bildirimi indeksi`],
    ["Tıbbi Geçmiş", `Önceki sakatlık faktörü: ${Math.round(player.injuryRisk / 7)} puan`],
    ["GPS", `${player.gpsDistance.toFixed(1)} km ortalama seans mesafesi`],
    ["Kalp Hızı", `${player.heartRate} atım/dk istirahat ortalaması`],
    ["Uyku", `${player.sleep} saat gecelik ortalama`],
    ["Kan Biyobelirteçleri", `${player.biomarkers}/100 iltihaplanma & toparlanma paneli`],
    ["Psikolojik Skor", `${Math.round((player.wellness + player.readiness) / 2)}/100`],
    ["Mevcut Hazırlık", `${player.readiness}%`],
    ["YZ Risk Skoru", `${player.injuryRisk}%`],
    ["Performans Eğilimi", player.readiness > 80 ? "Pozitif ilerleme" : "Toparlanma müdahalesi gerekli"],
    ["Haftalık Öneri", player.injuryRisk > RECOVERY_RECOMMENDATION_THRESHOLD ? "Toparlanma + kontrollü teknik seanslar" : "Sprint + kuvvet progresyonu"],
  ];

  profile.innerHTML = "";
  data.forEach(([k, v]) => {
    const card = document.createElement("article");
    card.innerHTML = `<h4>${k}</h4><p>${v}</p>`;
    profile.appendChild(card);
  });
}

function renderPlayerSelect() {
  const select = document.getElementById("player-select");
  players.forEach((player, i) => {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = player.name;
    select.appendChild(option);
  });
  select.addEventListener("change", (event) => renderPlayerProfile(Number(event.target.value)));
}

function renderPlanner() {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const sessions = {
    Pazartesi: ["Sprint Seansı", "Kuvvet"],
    Salı: ["Teknik"],
    Çarşamba: ["Toparlanma Günü"],
    Perşembe: ["Sprint Seansı", "Teknik"],
    Cuma: ["Kuvvet"],
    Cumartesi: ["Dinlenme"],
    Pazar: ["Toparlanma Günü"],
  };

  const planner = document.getElementById("planner");
  days.forEach((day) => {
    const col = document.createElement("div");
    col.className = "day";
    col.dataset.day = day;
    col.innerHTML = `<h4>${day}</h4>`;
    col.addEventListener("dragover", (e) => e.preventDefault());
    col.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const el = document.getElementById(id);
      if (el) col.appendChild(el);
    });

    sessions[day].forEach((session, idx) => {
      const item = document.createElement("div");
      item.id = `${day}-${idx}`;
      item.className = "session";
      item.draggable = true;
      if (session.includes("Toparlanma")) item.classList.add("recovery");
      if (session.includes("Dinlenme")) item.classList.add("rest");
      item.textContent = session;
      item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.id);
      });
      col.appendChild(item);
    });
    planner.appendChild(col);
  });
}

function renderMedicalCards() {
  const cards = document.getElementById("medical-cards");
  const avgHr = Math.round(players.reduce((s, p) => s + p.heartRate, 0) / players.length);
  [
    ["Esenlik Anketi", "Günlük öznel esenlik anketi tamamlama: %96"],
    ["KH İzleme", `Kadro istirahat kalp hızı ortalaması: ${avgHr} atım/dk`],
    ["Kan Testleri", "İşaretlenen biyobelirteç sapmaları: 3 sporcu incelemede"],
    ["Toparlanma Uyumu", "Toparlanma protokol uyumu: %88 (son 7 gün)"]
  ].forEach(([title, text]) => {
    const article = document.createElement("article");
    article.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
    cards.appendChild(article);
  });
}

function renderAICards() {
  const cards = document.getElementById("ai-engine-cards");
  aiEngineCards.forEach(([title, text]) => {
    const article = document.createElement("article");
    article.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
    cards.appendChild(article);
  });
}

function renderRiskPanel() {
  const riskPanel = document.getElementById("risk-panel");
  const highestRiskPlayer = players.reduce(
    (maxRiskPlayer, currentPlayer) =>
      currentPlayer.injuryRisk > maxRiskPlayer.injuryRisk ? currentPlayer : maxRiskPlayer,
    players[0]
  );
  const items = [
    ["Sakatlık Riski", `${highestRiskPlayer.injuryRisk}%`, highestRiskPlayer.injuryRisk > 30 ? "red" : "yellow"],
    ["Yorgunluk Riski", `${highestRiskPlayer.fatigueRisk}%`, highestRiskPlayer.fatigueRisk > 35 ? "red" : "yellow"],
    ["Aşırı Antrenman Riski", `${highestRiskPlayer.overtrainingRisk}%`, highestRiskPlayer.overtrainingRisk > 30 ? "yellow" : "green"],
    ["Uygunluk Tahmini", `${highestRiskPlayer.availability}%`, highestRiskPlayer.availability > 80 ? "green" : "yellow"],
    ["Toparlanma Skoru", `${highestRiskPlayer.readiness}%`, highestRiskPlayer.readiness > 78 ? "green" : "yellow"],
    ["Önerilen Antrenman Yükü", `${Math.round(highestRiskPlayer.acuteLoad * RECOMMENDED_LOAD_REDUCTION_FACTOR)} AU`, "yellow"],
  ];

  const riskColorLabels = { red: "YÜKSEK", yellow: "ORTA", green: "DÜŞÜK" };

  items.forEach(([name, value, color]) => {
    const article = document.createElement("article");
    article.className = "glass";
    article.innerHTML = `<h4>${name}</h4><p>${value}</p><span class="badge ${color}">${riskColorLabels[color]}</span>`;
    riskPanel.appendChild(article);
  });

  const explain = document.createElement("article");
  explain.className = "glass";
  explain.innerHTML = `<h4>Açıklanabilirlik</h4>
  <p>YZ güveni: %92</p>
  <p>En yüksek katkı sağlayan değişkenler: Uyku, Akut Yük, Kronik Yük, KHA, Önceki Sakatlık</p>`;
  riskPanel.appendChild(explain);
}

function animateHeroCounters() {
  const targets = [
    ["hero-readiness", Number(document.getElementById("hero-readiness").textContent.replace("%", "")), "%"],
    ["hero-risk", Number(document.getElementById("hero-risk").textContent.replace("%", "")), "%"],
    ["hero-availability", Number(document.getElementById("hero-availability").textContent.replace("%", "")), "%"]
  ];
  targets.forEach(([id, target, suffix]) => {
    const element = document.getElementById(id);
    let current = 0;
    const step = Math.max(1, Math.round(target / 24));
    const tick = () => {
      current = Math.min(target, current + step);
      element.textContent = `${current}${suffix}`;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function renderReports() {
  const reports = document.getElementById("report-cards");
  reportTitles.forEach((title) => {
    const card = document.createElement("article");
    card.innerHTML = `<h4>${title}</h4><p>Yönetici özeti ve YZ içgörüleri ile interaktif PDF tarzı dışa aktarım.</p><button>Oluştur</button>`;
    reports.appendChild(card);
  });
}

function renderRoles() {
  const roles = document.getElementById("roles");
  staffRoles.forEach(([title, detail]) => {
    const row = document.createElement("div");
    row.className = "role";
    row.innerHTML = `<strong>${title}</strong><p>${detail}</p>`;
    roles.appendChild(row);
  });
}

renderNav(topNav, "top");
renderNav(sidebar, "side");
renderArchitecture();
renderCompanyArchitecture();
renderKPIs();
renderHeatmap();
renderAlerts();
renderPlayerSelect();
renderPlayerProfile();
renderPlanner();
renderMedicalCards();
renderAICards();
renderRiskPanel();
renderReports();
renderRoles();

drawChart("weekly-load", [660, 710, 680, 740, 770, 705, 630], "#38e4ff");
drawChart("recovery-trend", [69, 73, 75, 78, 81, 80, 83], "#36e7a7");
drawBars("training-distribution", [34, 22, 18, 15, 11], ["#2f7bff", "#38e4ff", "#36e7a7", "#ffbd4a", "#8a97c5"]);
animateHeroCounters();
activatePage("home");
