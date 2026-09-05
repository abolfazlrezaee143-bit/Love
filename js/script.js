/* ==========================================
   متغیرهای قابل تخصیص
   ========================================== */

const CONFIG = {
    // مسیر یا لینک آهنگ
    MUSIC_PATH: 'music/song.mp3',
    
    // نام آهنگ
    SONG_NAME: 'یک نامه برای تو',
    
    // تأخیر نمایش پیام‌ها (میلی‌ثانیه)
    MESSAGE_1_DELAY: 1000,
    MESSAGE_2_DELAY: 5000,
    FINAL_SECTION_DELAY: 8000
};

/* ==========================================
   عناصر DOM
   ========================================== */

// صفحات
const welcomeScreen = document.getElementById('welcome-screen');
const mainScreen = document.getElementById('main-screen');

// دکمه‌ها
const startBtn = document.getElementById('start-btn');
const musicTriggerBtn = document.getElementById('music-trigger-btn');
const playBtn = document.getElementById('play-btn');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// بخش‌ها
const musicSection = document.getElementById('music-section');
const finalSection = document.getElementById('final-section');

// متن‌های احساسی
const message1 = document.getElementById('message-1');
const message2 = document.getElementById('message-2');
const yesResponse = document.getElementById('yes-response');
const noResponse = document.getElementById('no-response');

// عناصر موسیقی
const audioPlayer = document.getElementById('audio-player');
const songTitle = document.getElementById('song-title');
const progressBar = document.getElementById('progress');
const progress = document.querySelector('.progress');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');

/* ==========================================
   وضعیت برنامه
   ========================================== */

let appState = {
    isPlaying: false,
    musicStarted: false,
    responded: false
};

/* ==========================================
   تابع شروع
   ========================================== */

function init() {
    setupEventListeners();
    updateSongTitle();
    setAudioVolume();
}

/* ==========================================
   تنظیم رویدادها
   ========================================== */

function setupEventListeners() {
    // صفحه خوش‌آمد
    startBtn.addEventListener('click', startExperience);

    // دکمه موسیقی
    musicTriggerBtn.addEventListener('click', openMusicSection);

    // کنترل‌های موسیقی
    playBtn.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('play', onAudioPlay);
    audioPlayer.addEventListener('pause', onAudioPause);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', onAudioEnded);

    // نوار پیشرفت
    document.querySelector('.progress-bar').addEventListener('click', setProgress);

    // کنترل صدا
    volumeSlider.addEventListener('input', setAudioVolume);

    // دکمه‌های پاسخ
    yesBtn.addEventListener('click', respondYes);
    noBtn.addEventListener('click', respondNo);
}

/* ==========================================
   مدیریت صفحات
   ========================================== */

function startExperience() {
    welcomeScreen.classList.remove('active');
    setTimeout(() => {
        mainScreen.classList.add('active');
    }, 50);
}

function openMusicSection() {
    musicSection.classList.remove('hidden');
    musicTriggerBtn.classList.add('hidden');
    
    // نمایش پیام اول با تأخیر
    setTimeout(() => {
        message1.classList.remove('hidden');
    }, CONFIG.MESSAGE_1_DELAY);

    // نمایش پیام دوم با تأخیر بیشتر
    setTimeout(() => {
        message2.classList.remove('hidden');
    }, CONFIG.MESSAGE_2_DELAY);

    // نمایش بخش نهایی
    setTimeout(() => {
        finalSection.classList.remove('hidden');
    }, CONFIG.FINAL_SECTION_DELAY);
}

/* ==========================================
   کنترل موسیقی
   ========================================== */

function togglePlay() {
    if (appState.isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(error => {
            console.error('خطا در پخش آهنگ:', error);
            showNotification('متاسفانه آهنگ پخش نشد. لطفاً فایل را بررسی کنید.');
        });
    }
}

function onAudioPlay() {
    appState.isPlaying = true;
    appState.musicStarted = true;
    playBtn.textContent = '⏸';
}

function onAudioPause() {
    appState.isPlaying = false;
    playBtn.textContent = '▶';
}

function onAudioEnded() {
    appState.isPlaying = false;
    playBtn.textContent = '▶';
    progressBar.style.width = '0%';
}

function updateProgressBar() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = percent + '%';
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
    durationDisplay.textContent = formatTime(audioPlayer.duration);
}

function setProgress(e) {
    const progressContainer = document.querySelector('.progress-bar');
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function setAudioVolume() {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
}

/* ==========================================
   دکمه‌های پاسخ
   ========================================== */

function respondYes() {
    if (appState.responded) return;
    
    appState.responded = true;
    yesBtn.disabled = true;
    noBtn.disabled = true;
    
    yesResponse.classList.remove('hidden');
    noResponse.classList.add('hidden');
}

function respondNo() {
    if (appState.responded) return;
    
    appState.responded = true;
    yesBtn.disabled = true;
    noBtn.disabled = true;
    
    noResponse.classList.remove('hidden');
    yesResponse.classList.add('hidden');
}

/* ==========================================
   توابع کمکی
   ========================================== */

function updateSongTitle() {
    songTitle.textContent = CONFIG.SONG_NAME;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function showNotification(message) {
    alert(message);
}

/* ==========================================
   مقداردهی اولیه
   ========================================== */

document.addEventListener('DOMContentLoaded', init);

/* ==========================================
   جلوگیری از تغییر غیر مطلوب
   ========================================== */

// بر اساس درخواست، صفحه با refresh دوباره از ابتدا شروع می‌شود
// (این رفتار پیش‌فرض است و نیازی به کد اضافی نیست)

console.log('سایت آماده است. لذت ببرید! ❤️');
