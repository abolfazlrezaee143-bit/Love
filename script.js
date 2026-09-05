/* ==========================================================
   تنظیمات قابل تغییر — فقط همین بخش رو ویرایش کن
   ========================================================== */
const CONFIG = {
  // نام آهنگ که بالای پلیر نمایش داده می‌شود
  songName: "نام آهنگ",

  // مسیر فایل آهنگ (اگر فایل mp3 را داخل پوشه‌ی music گذاشتی همین را نگه دار)
  songSource: "music/song.mp3",

  // اگر می‌خوای به‌جای فایل mp3 از یک لینک مستقیم استفاده کنی،
  // آدرس را همینجا بگذار و خط پایین را true کن.
  useExternalLink: false,
  externalSongUrl: "", // مثال: "https://example.com/song.mp3"

  // فاصله‌ی زمانی (میلی‌ثانیه) بین شروع پخش آهنگ و ظاهر شدن پیام اول
  delayBeforeFirstMessage: 2500,
};

/* ==========================================================
   ساخت ذرات نور و قلب‌های ظریف در پس‌زمینه
   ========================================================== */
function createParticles() {
  const container = document.getElementById("particles");
  const particleCount = window.innerWidth < 480 ? 26 : 45;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 2.5 + 1;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animationDuration = `${Math.random() * 4 + 3}s`;
    p.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(p);
  }

  // چند قلب ظریف که آرام بالا می‌روند
  const heartCount = window.innerWidth < 480 ? 4 : 7;
  for (let i = 0; i < heartCount; i++) {
    const h = document.createElement("div");
    h.className = "heart-particle";
    h.textContent = "♥";
    h.style.left = `${Math.random() * 100}%`;
    h.style.animationDuration = `${Math.random() * 5 + 8}s`;
    h.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(h);
  }
}

/* ==========================================================
   فرمت زمان به صورت ۰۰:۰۰ (با اعداد فارسی)
   ========================================================== */
function toPersianDigits(str) {
  const fa = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => fa[d]);
}

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return toPersianDigits("00:00");
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return toPersianDigits(`${m}:${s}`);
}

/* ==========================================================
   منطق پلیر موسیقی
   ========================================================== */
function setupMusicPlayer() {
  const audio = document.getElementById("audio-player");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");
  const progressBar = document.getElementById("progress-bar");
  const progressFill = document.getElementById("progress-fill");
  const currentTimeEl = document.getElementById("current-time");
  const durationTimeEl = document.getElementById("duration-time");
  const volumeSlider = document.getElementById("volume-slider");
  const songNameEl = document.getElementById("song-name");

  songNameEl.textContent = CONFIG.songName;
  audio.src = CONFIG.useExternalLink && CONFIG.externalSongUrl
    ? CONFIG.externalSongUrl
    : CONFIG.songSource;
  audio.volume = 0.8;

  let hasStartedOnce = false;

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        alert("فایل آهنگ پیدا نشد. لطفاً مسیر music/song.mp3 را بررسی کن.");
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    iconPlay.classList.add("hidden");
    iconPause.classList.remove("hidden");

    if (!hasStartedOnce) {
      hasStartedOnce = true;
      revealAfterPlay();
    }
  });

  audio.addEventListener("pause", () => {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
  });

  audio.addEventListener("loadedmetadata", () => {
    durationTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    // چون صفحه راست‌چین است، محاسبه را متناسب با جهت RTL انجام می‌دهیم
    const clickX = rect.right - e.clientX;
    const ratio = clickX / rect.width;
    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = parseFloat(e.target.value);
  });
}

/* ==========================================================
   نمایش تدریجی پیام‌ها پس از پخش آهنگ
   ========================================================== */
function revealAfterPlay() {
  const msgAfterPlay = document.getElementById("msg-after-play");
  const showMsg2Btn = document.getElementById("show-msg2-btn");

  setTimeout(() => {
    msgAfterPlay.classList.remove("hidden");
    msgAfterPlay.classList.add("fade-in-section");
    showMsg2Btn.classList.remove("hidden");
    showMsg2Btn.classList.add("fade-in-section");
  }, CONFIG.delayBeforeFirstMessage);
}

/* ==========================================================
   مراحل اصلی سایت (state machine ساده)
   ========================================================== */
function setupFlow() {
  const startBtn = document.getElementById("start-btn");
  const introScreen = document.getElementById("intro-screen");
  const mainContent = document.getElementById("main-content");

  const showMusicBtn = document.getElementById("show-music-btn");
  const musicSection = document.getElementById("music-section");

  const showMsg2Btn = document.getElementById("show-msg2-btn");
  const msgSecond = document.getElementById("msg-second");
  const showFinalBtn = document.getElementById("show-final-btn");

  const showFinalBtnClick = () => {
    document.getElementById("music-section").classList.add("hidden");
    const finalSection = document.getElementById("final-section");
    finalSection.classList.remove("hidden");
    finalSection.classList.add("fade-in-section");
    window.scrollTo({ top: finalSection.offsetTop, behavior: "smooth" });
  };

  startBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    mainContent.classList.add("fade-in-section");
  });

  showMusicBtn.addEventListener("click", () => {
    musicSection.classList.remove("hidden");
    musicSection.classList.add("fade-in-section");
    window.scrollTo({ top: musicSection.offsetTop, behavior: "smooth" });
  });

  showMsg2Btn.addEventListener("click", () => {
    msgSecond.classList.remove("hidden");
    msgSecond.classList.add("fade-in-section");
    showFinalBtn.classList.remove("hidden");
    showFinalBtn.classList.add("fade-in-section");
    showMsg2Btn.classList.add("hidden");
  });

  showFinalBtn.addEventListener("click", showFinalBtnClick);

  const yesBtn = document.getElementById("yes-btn");
  const thinkBtn = document.getElementById("think-btn");
  const responseText = document.getElementById("response-text");

  yesBtn.addEventListener("click", () => {
    responseText.textContent = "پس شاید اینجا شروع یک داستان قشنگ باشه... ❤️";
    responseText.classList.remove("hidden");
    responseText.classList.add("fade-in-section");
    yesBtn.disabled = true;
    thinkBtn.disabled = true;
  });

  thinkBtn.addEventListener("click", () => {
    responseText.textContent = "حتماً. عجله‌ای نیست. مهم اینه که انتخابت با خیال راحت و از ته دل باشه. 🌱";
    responseText.classList.remove("hidden");
    responseText.classList.add("fade-in-section");
    yesBtn.disabled = true;
    thinkBtn.disabled = true;
  });
}

/* ==========================================================
   اجرای اولیه
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  setupMusicPlayer();
  setupFlow();
});
