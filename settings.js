if (document.getElementById('lang-switch-btn')) document.getElementById('lang-switch-btn').onclick = function() {
    const newLang = i18next.language === 'ru' ? 'en' : 'ru';
    i18next.changeLanguage(newLang, () => {
        localStorage.setItem('lang', newLang);
        updateAllTexts();
    });
    this.textContent = newLang === 'ru' ? i18next.t('Switch to English') : i18next.t('Switch to Russian');
};

// --- Импорт настроек/прогресса ---
document.getElementById('import-settings-btn').onclick = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const base64 = evt.target.result;
                const json = decodeURIComponent(escape(atob(base64)));
                const data = JSON.parse(json);
                Object.keys(data).forEach(key => localStorage.setItem(key, JSON.stringify(data[key])));
                alert('Импорт успешно завершён!');
                location.reload();
            } catch (e) {
                alert('Ошибка импорта!');
            }
        };
        reader.readAsText(file);
    };
    input.click();
};

// --- Экспорт настроек/прогресса ---
document.getElementById('export-settings-btn').onclick = function() {
    const keys = Object.keys(localStorage);
    const data = {};
    keys.forEach(key => {
        try {
            data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
            data[key] = localStorage.getItem(key);
        }
    });
    const json = JSON.stringify(data, null, 2);
    const base64 = btoa(unescape(encodeURIComponent(json)));

    // Формируем дату в формате YYYY-MM-DD_HH-MM-SS
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    const blob = new Blob([base64], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warriors-of-destiny-save_${dateStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};

// --- Сбросить игру ---
document.getElementById('reset-game-btn').onclick = function() {
    const confirmText = prompt(i18next.t('reset_confirm_prompt', 'To reset the game, enter CONFIRM'));
    if (confirmText === 'CONFIRM') {
        localStorage.clear();
        alert(i18next.t('reset_success', 'Game reset! The page will be reloaded.'));
        location.reload();
    } else {
        alert(i18next.t('reset_cancel', 'Reset cancelled.'));
    }
};

// --- Футер и модальное окно версии ---
document.getElementById('game-footer').onclick = function() {
    document.getElementById('version-modal').style.display = 'flex';
};
document.getElementById('version-modal').onclick = function(e) {
    if (e.target === this) this.style.display = 'none';
};
document.querySelectorAll('.version-select-btn').forEach(btn => {
    btn.onclick = function() {
        const v = btn.dataset.version;
        document.getElementById('version-modal-title').textContent =
            v === '0.1' ? i18next.t('version_0_1_title') : v;
        document.getElementById('version-modal-changelog').innerHTML =
            v === '0.1'
                ? i18next.t('version_0_1_changelog')
                : '';
    };
});

// --- Громкость музыки и звуков ---
const musicVolumeSlider = document.getElementById('music-volume');
const soundVolumeSlider = document.getElementById('sound-volume');
const musicVolumeValue = document.getElementById('music-volume-value');
const soundVolumeValue = document.getElementById('sound-volume-value');

// Загрузка значений из localStorage
const savedMusicVolume = parseFloat(localStorage.getItem('musicVolume') || '1');
const savedSoundVolume = parseFloat(localStorage.getItem('soundVolume') || '1');
if (musicVolumeSlider) {
    musicVolumeSlider.value = savedMusicVolume;
    musicVolumeValue.textContent = Math.round(savedMusicVolume * 100) + '%';
}
if (soundVolumeSlider) {
    soundVolumeSlider.value = savedSoundVolume;
    soundVolumeValue.textContent = Math.round(savedSoundVolume * 100) + '%';
}

// Слушатели событий
if (musicVolumeSlider) {
    musicVolumeSlider.oninput = function() {
        localStorage.setItem('musicVolume', this.value);
        musicVolumeValue.textContent = Math.round(this.value * 100) + '%';
        // Если у вас есть глобальный объект backgroundMusic:
        if (window.backgroundMusic) window.backgroundMusic.volume = parseFloat(this.value);
    };
}
if (soundVolumeSlider) {
    soundVolumeSlider.oninput = function() {
        localStorage.setItem('soundVolume', this.value);
        soundVolumeValue.textContent = Math.round(this.value * 100) + '%';
    };
}