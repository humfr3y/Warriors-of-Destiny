let turnOrder = [];
let currentTurnHero = '';
let expMessages = [], expPlayerMessages = [];
let rewardsGenerated = false;
let battleEnded = false;

let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
let isAttackBlocked = false; 

function playRandomBattleMusic() {
    const musicCount = 5; // количество треков
    const randomIndex = Math.floor(Math.random() * musicCount) + 1;
    const musicFile = `./sounds/music/medieval${randomIndex}.mp3`;
    if (window.backgroundMusic) {
        window.backgroundMusic.pause();
        window.backgroundMusic = null;
    }
    window.backgroundMusic = new Audio(musicFile);
    window.backgroundMusic.loop = true;
    window.backgroundMusic.volume = parseFloat(localStorage.getItem('musicVolume') || '1');
    window.backgroundMusic.play().catch(() => {});
}

playRandomBattleMusic();

function loadFrontOrBack(key) {
    let arr = JSON.parse(localStorage.getItem(key)) || [];
    while (arr.length < 5) arr.push(null);
    if (arr.length > 5) arr = arr.slice(0, 5);
    return arr;
}



let selectedAlliesFront2 = (JSON.parse(localStorage.getItem('selectedAlliesFront')) || []).filter(Boolean);
let selectedAlliesBack2 = (JSON.parse(localStorage.getItem('selectedAlliesBack')) || []).filter(Boolean);
let selectedEnemiesFront2 = (JSON.parse(localStorage.getItem('selectedEnemiesFront')) || []).filter(Boolean);
let selectedEnemiesBack2 = (JSON.parse(localStorage.getItem('selectedEnemiesBack')) || []).filter(Boolean);

let selectedAllies = [...selectedAlliesFront2, ...selectedAlliesBack2];
let selectedEnemies = [...selectedEnemiesFront2, ...selectedEnemiesBack2];

// Восстанавливаем материализованных по их id
[selectedAlliesFront2, selectedAlliesBack2].forEach(arr => {
    arr.forEach((ally, i) => {
        if (ally && ally.isMaterialized && ally.materializedId) {
            const mat = materializedCharacters.find(c => c.id === ally.materializedId);
            if (mat) arr[i] = { ...mat, isMaterialized: true, materializedId: mat.id };
        }
    });
});
// Динамические функции урона
[selectedAlliesFront2, selectedAlliesBack2, selectedEnemiesFront2, selectedEnemiesBack2].forEach(arr => {
    arr.forEach(char => {
        if (!char) return;
        if (char.code === "SkeletonKing") {
            char.damage = function() { return this.health * 0.15; };
            char.hasResurrected = false;
        }
        if (char.code === "Berserker") {
            char.damage = function() { return 25 + ((70 - this.health) / 2); };
        }
        if (char.code === "Jester") {
            char.damage = function() { return Math.floor(Math.random() * 25) + 15; };
        }
        // Дубинщик: пробивает 50% защиты
        if (char.code === "clubman") {
            char.penetration = char.penetration;
        }
        // Алебардист: пробивает 60% защиты
        if (char.code === "halberdier") {
            char.penetration = char.penetration;
        }
        // Наёмник с булавой: пробивает 75% защиты
        if (char.code === "maceMercenary") {
            char.penetration = char.penetration;
        }
        // Молотоборец: пробивает 100% защиты
        if (char.code === "hammerman") {
            char.penetration = char.penetration;
        }
        // Старейшина: после атаки случайный бафф
        if (char.code === "Elder") {
            char.beforeAttack = function(target) {
                const effect = Math.floor(Math.random() * 3);
                if (effect === 0) {
                    // +50% урона себе (на 1 удар)
                    this._damageBuff = 1.5;
                } else if (effect === 1) {
                    // Проклятье защиты цели на 10
                    if (target) target.defense = (target.defense || 0) - 10;
                    showCustomEffect(target, '-10% защиты', '#ff2222', 'enemy');
                } else if (effect === 2) {
                    let healAmount = 25;
                    healAmount = Math.min(this.maxHealth - this.health, healAmount);
                    this.health += healAmount;
                    updateStatsDisplay(this, 'hero', true);
                    showHealEffect(this, healAmount);
                }
            };
        }
        // Экзорцист: наносит в 2 раза больше урона нежити
        if (char.code === "exorcist") {
            char.damageMultiplier = 1.5;
        }
    });
});

let fighters = [...selectedAlliesFront2, ...selectedAlliesBack2, ...selectedEnemiesFront2, ...selectedEnemiesBack2];

applyStartBattleEffects();

calculateTurnOrder(fighters);


function updateFronts(front, back) {
    if (front.every(c => !c || c.health <= 0) && back.some(c => c && c.health > 0)) {
        const aliveBack = back.filter(c => c && c.health > 0);
        let ai = 0;
        for (let i = 0; i < front.length; i++) {
            if (!front[i] || front[i].health <= 0) {
                front[i] = aliveBack[ai] || front[i];
                ai++;
            }
        }
        for (let i = 0; i < back.length; i++) {
            if (back[i] && back[i].health > 0 && aliveBack.includes(back[i])) {
                back[i] = null;
            }
        }
    }
}

// --- Генерация интерфейса ---
function initializeBattle() {
    [
        ...selectedAlliesFront2,
        ...selectedAlliesBack2,
        ...selectedEnemiesFront2,
        ...selectedEnemiesBack2
    ].forEach((char, idx) => {
            
        if (char) {
            char.uniqueId = `${char.code || char.name}-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        }
    });


    const alliesTop = document.getElementById('allies-top');
    const alliesBottom = document.getElementById('allies-bottom');
    const enemiesTop = document.getElementById('enemies-top');
    const enemiesBottom = document.getElementById('enemies-bottom');

    [alliesTop, alliesBottom, enemiesTop, enemiesBottom].forEach(el => {
        if (el) el.innerHTML = '';
    });

    // Всегда 5 ячеек, даже если персонажей меньше
    for (let i = 0; i < 5; i++) {
        alliesTop.appendChild(createCharacterDiv(selectedAlliesFront2[i], 'hero', i, 'front'));
        alliesBottom.appendChild(createCharacterDiv(selectedAlliesBack2[i], 'hero', i, 'back'));
        enemiesBottom.appendChild(createCharacterDiv(selectedEnemiesFront2[i], 'enemy', i, 'front'));
        enemiesTop.appendChild(createCharacterDiv(selectedEnemiesBack2[i], 'enemy', i, 'back'));
    }



}


function createCharacterDiv(char, type, index, row) {
    const div = document.createElement('div');
    div.classList.add(type, type === 'hero' ? 'hero-block' : 'enemy-block');
    div.setAttribute('data-char', `${char && char.name ? char.name : 'empty'}-${index}-${row}`);
    if (char) div.setAttribute('data-uniqueid', char.uniqueId);

    // Пустая ячейка
    if (!char) {
        div.classList.add('empty-cell');
        if (row === 'back') {
            div.innerHTML = `<span class="empty-icon"><img src="./images/shield-svgrepo-com.svg" alt="empty" style="width:32px;height:32px;opacity:0.25;"></span>`;
        }
        if (row === 'front') {
            div.innerHTML = `<span class="empty-icon"><img src="./images/sword-svgrepo-com(1).svg" alt="empty" style="width:32px;height:32px;opacity:0.25;"></span>`;
        }
        div.style.cursor = 'default';
        div.onmouseenter = null;
        div.onmouseleave = null;
        div.onmouseover = null;
        div.onmouseout = null;
        div.onclick = null;
        return div;
    }

    div.classList.add('compact-character-block');

    if (char.rarity && typeof rarityColors2 === 'object') {
        const rarityClass = rarityColors2[char.rarity];
        if (rarityClass) {
            div.classList.add(rarityClass);
        }
    }

    // Имя по центру
    const charName = i18next.t(`${char.code}.name`, { defaultValue: char.name });
    const healthId = `${char.code}-health-${fighters.indexOf(char)}`;
    const defenseId = `${char.code}-defense-${fighters.indexOf(char)}`;
    const damageId = `${char.code}-damage-${fighters.indexOf(char)}`;
    let damageLabel = i18next.t('DamageShort', { defaultValue: 'Урон' });

    if (char.code === "Saint") {
        damageLabel = i18next.t('HealShort', { defaultValue: 'Лечение' });
    } else if (char.code === "Godlikesaint") {
        damageLabel = i18next.t('ShieldShort', { defaultValue: 'Щит' });
    } else if (char.damagetype === "Проклятье урона" || char.damagetype === "CurseDmg") {
        damageLabel = i18next.t('CurseDmgShort', { defaultValue: 'Проклятье урона' });
    } else if (char.damagetype === "Проклятье защиты" || char.damagetype === "CurseDef") {
        damageLabel = i18next.t('CurseDefShort', { defaultValue: 'Проклятье защиты' });
    }

    let damageValue = typeof char.damage === 'function' ? Math.round(char.damage.call(char)) : char.damage;

    div.innerHTML = `
        <div class="char-content-square">
            <div class="char-name-center">${charName}</div>
            <div class="char-hpdef">
                <div class="char-hpdef-left">
                    <div class="char-hp">
                        <span>${i18next.t('HealthShort', { defaultValue: 'Здоровье' })}:</span>
                        <span id="${healthId}">${char.health}/${char.maxHealth}</span>
                    </div>
                    <div class="char-def">
                        <span>${i18next.t('DefenseShort', { defaultValue: 'Защита' })}:</span>
                        <span id="${defenseId}">${char.defense || 0}%</span>
                    </div>
                </div>
                <div class="char-dmg-right">
                    <span>${damageLabel}:</span>
                    <span id="${damageId}">${damageValue}</span>
                </div>
            </div>
        </div>
    `;

    // Полоска здоровья
    const hpPercent = Math.max(0, Math.min(1, char.health / char.maxHealth));
    const hpBar = document.createElement('div');
    hpBar.className = 'hp-bar';
    hpBar.innerHTML = `
        <div class="hp-bar-inner" style="width:${hpPercent * 100}%;"></div>
        <div class="hp-bar-preview" style="display:none; position:absolute; left:0; top:0; height:100%; width:100%; pointer-events:none;"></div>
    `;
    hpBar.style.position = 'relative'; // чтобы preview был поверх
    div.appendChild(hpBar);

    // Если персонаж мертв — затемнить и отключить клики
    if (char.health <= 0) {
        div.style.filter = 'grayscale(1) brightness(0.7)';
        div.style.opacity = '0.5';
        div.style.pointerEvents = 'none';
        return div;
    }
    // --- Внешняя тень для текущего персонажа (герой или враг) ---
    if (turnOrder.length > 0) {
        const [curName, curIdx] = turnOrder[0].split('-');
        const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
        if (char === curChar) {
            div.classList.add('current-turn-outline');
        }
    }

    // Наведение — подсветка и инфо
    div.onmouseenter = () => {
        // Зеленый цвет для союзника, который сейчас ходит
        if (
            type === 'hero' &&
            currentTurnHero
        ) {
            const [curName, curIdx] = currentTurnHero.split('-');
            const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
            const currentIndex = fighters.indexOf(curChar);
            if (char === curChar && turnOrder[0] === `${char.name}-${currentIndex}`) {
                div.classList.add('current-turn-hover');
            }
            // Синий цвет для лечения/щита
            else if (
                curChar &&
                (curChar.code === "Saint" || curChar.code === "Godlikesaint") &&
                curChar.health > 0
            ) {
                div.classList.add('saint-hover');
            }
        }
        // character-info-panel
        const characterInfoPanel = document.getElementById('character-info-panel');
        if (characterInfoPanel) {
            characterInfoPanel.style.display = 'flex';
            characterInfoPanel.innerHTML = `
                <h3 style="margin-top:0; text-align:center">${charName}</h3>
                <div><b>${i18next.t('Rarity', { defaultValue: 'Редкость' })}:</b> &nbsp;${i18next.t(`${char.code}.rarity`, { defaultValue: char.rarity })}</div>
                <div><b>${i18next.t('Level', { defaultValue: 'Уровень' })}:</b> &nbsp;${char.level || 1}</div>
                <div><b>${i18next.t('Experience', { defaultValue: 'Опыт' })}:</b> &nbsp;${Math.floor(char.exp) || 0}/${char.maxExp || 100}</div>
                <div><b>${i18next.t('Health', { defaultValue: 'Здоровье' })}:</b> &nbsp;${char.maxHealth || char.health}</div>
                <div><b>${i18next.t('Defense', { defaultValue: 'Защита' })}:</b> &nbsp;${char.defense || 0}</div>
                <div><b>${i18next.t('Damage', { defaultValue: 'Урон' })}:</b> &nbsp;${typeof char.damage === 'function' ? i18next.t('Special formula', { defaultValue: 'Спец. формула' }) : char.damage}</div>
                <div><b>${i18next.t('Speed', { defaultValue: 'Скорость' })}: </b>&nbsp;${char.speed || 0}</div>
                <div><b>${i18next.t('DamageType', { defaultValue: 'Тип урона' })}:</b> &nbsp;${i18next.t(`${char.code}.damagetype`, { defaultValue: char.damagetype || '-' })}</div> <br>
                <div><i>${i18next.t(`${char.code}.description`, { defaultValue: char.description || '-' })}</i></div> <br> 
                <div><b>${i18next.t('Ability', { defaultValue: 'Способность' })}:</b> &nbsp;${i18next.t(`${char.code}.ability`, { defaultValue: char.ability || '-' })}</div>
            `;
        }
    };
    div.onmouseleave = () => {
        div.classList.remove('current-turn-hover');
        div.classList.remove('saint-hover');
        const characterInfoPanel = document.getElementById('character-info-panel');
        if (characterInfoPanel) characterInfoPanel.style.display = 'none';
    };

    // Клик по врагу — атака
    if (type === 'enemy') {
        div.onclick = () => {
            if (battleEnded) return;
            if (turnOrder.length === 0) return;
            if (!currentTurnHero) return;
            const [curName, curIdx] = currentTurnHero.split('-');
            const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
            if (!curChar) return;
            const allowedTargets = getAttackableTargets(
                curChar,
                selectedEnemiesFront2,
                selectedEnemiesBack2
            );
            if (allowedTargets.includes(char)) {
                let arr, idx, rowType;
                if (selectedEnemiesFront2.includes(char)) {
                    arr = selectedEnemiesFront2;
                    idx = arr.indexOf(char);
                    rowType = 'front';
                } else if (selectedEnemiesBack2.includes(char)) {
                    arr = selectedEnemiesBack2;
                    idx = arr.indexOf(char);
                    rowType = 'back';
                }
                attack(curChar.name, char.name, idx, rowType);
            }
        };
        div.onmouseenter = () => {
            if (battleEnded) return;
            if (turnOrder.length === 0) return;
            if (!currentTurnHero) return;
            const [curName, curIdx] = currentTurnHero.split('-');
            const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
            if (!curChar) return;
            // Проверяем, союзник ли сейчас ходит
            if (!selectedAllies.includes(curChar)) return;

            // Вычисляем потенциальный урон
            const potentialDamage = calculateDamage(curChar, char);
            const newHealth = Math.max(0, char.health - potentialDamage);

            // Показываем число урона
            let dmgPreview = document.createElement('div');
            dmgPreview.className = 'dmg-preview';
            dmgPreview.textContent = `-${potentialDamage}`;
            dmgPreview.style.position = 'absolute';
            dmgPreview.style.left = '50%';
            dmgPreview.style.top = '10%';
            dmgPreview.style.transform = 'translate(-50%, 0)';
            dmgPreview.style.color = '#ff2222cc';
            dmgPreview.style.fontWeight = 'bold';
            dmgPreview.style.fontSize = '40px';
            dmgPreview.style.pointerEvents = 'none';
            dmgPreview.style.zIndex = '10';
            div.appendChild(dmgPreview);

            // Подсвечиваем часть полоски здоровья
            const hpBarPreview = div.querySelector('.hp-bar-preview');
            if (hpBarPreview) {
                hpBarPreview.style.display = 'block';
                // Проценты от максимального здоровья
                const currentPercent = Math.max(0, Math.min(1, char.health / char.maxHealth));
                const newHealth = Math.max(0, char.health - potentialDamage);
                const newPercent = Math.max(0, Math.min(1, newHealth / char.maxHealth));
                hpBarPreview.style.background = `linear-gradient(
                    to right,
                    #e74c3c 0%,
                    #e74c3c ${newPercent * 100}%,
                    #888 ${newPercent * 100}%,
                    #888 ${currentPercent * 100}%,
                    transparent ${currentPercent * 100}%,
                    transparent 100%
                )`;
            }

            const characterInfoPanel = document.getElementById('character-info-panel');
            if (characterInfoPanel) {
                characterInfoPanel.style.display = 'flex';
                characterInfoPanel.innerHTML = `
                    <h3 style="margin-top:0; text-align:center">${charName}</h3>
                    <div><b>${i18next.t('Rarity', { defaultValue: 'Редкость' })}:</b> &nbsp;${i18next.t(`${char.code}.rarity`, { defaultValue: char.rarity })}</div>
                    <div><b>${i18next.t('Level', { defaultValue: 'Уровень' })}:</b> &nbsp;${char.level || 1}</div>
                    <div><b>${i18next.t('Experience', { defaultValue: 'Опыт' })}:</b> &nbsp;${Math.floor(char.exp) || 0}/${char.maxExp || 100}</div>
                    <div><b>${i18next.t('Health', { defaultValue: 'Здоровье' })}:</b> &nbsp;${char.maxHealth || char.health}</div>
                    <div><b>${i18next.t('Defense', { defaultValue: 'Защита' })}:</b> &nbsp;${char.defense || 0}</div>
                    <div><b>${i18next.t('Damage', { defaultValue: 'Урон' })}:</b> &nbsp;${typeof char.damage === 'function' ? i18next.t('Special formula', { defaultValue: 'Спец. формула' }) : char.damage}</div>
                    <div><b>${i18next.t('Speed', { defaultValue: 'Скорость' })}: </b>&nbsp;${char.speed || 0}</div>
                    <div><b>${i18next.t('DamageType', { defaultValue: 'Тип урона' })}:</b> &nbsp;${i18next.t(`${char.code}.damagetype`, { defaultValue: char.damagetype || '-' })}</div> <br>
                    <div><i>${i18next.t(`${char.code}.description`, { defaultValue: char.description || '-' })}</i></div> <br> 
                    <div><b>${i18next.t('Ability', { defaultValue: 'Способность' })}:</b> &nbsp;${i18next.t(`${char.code}.ability`, { defaultValue: char.ability || '-' })}</div>
                `;
            }
        };
        div.onmouseleave = () => {
            // Удаляем число урона
            const dmgPreview = div.querySelector('.dmg-preview');
            if (dmgPreview) dmgPreview.remove();
            // Возвращаем полоску здоровья
            const hpBarPreview = div.querySelector('.hp-bar-preview');
            if (hpBarPreview) {
                hpBarPreview.style.display = 'none';
                hpBarPreview.style.background = '';
            }
        };
    }

    // Клик по герою — лечение/щит или пропуск хода
    if (type === 'hero') {
        div.onclick = () => {
            if (battleEnded) return;
            if (turnOrder.length === 0) return;
            if (!currentTurnHero) return;
            const [curName, curIdx] = currentTurnHero.split('-');
            const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
            const currentIndex = fighters.indexOf(curChar);
            // Пропуск хода, если клик по блоку текущего героя
            if (char === curChar && turnOrder[0] === `${char.name}-${currentIndex}`) {
                skipTurn();
                // Сразу убираем зелёную подсветку
                document.querySelectorAll('.current-turn-hover').forEach(el => el.classList.remove('current-turn-hover'));
                // Сброс курсора
                document.body.style.cursor = '';
                return;
            }
            // Лечение или щит, если ходит священник/божественный священник
            if (curChar && curChar.code === "Saint" && curChar.health > 0) {
                healAlly(curChar, char);
                playAttackSound(curChar.sound);
                processTurn();
            }
            else if (curChar && curChar.code === "Godlikesaint" && curChar.health > 0) {
                shieldAlly(curChar, char);
                showCustomEffect(char, '+5% защиты', '#00c8ff', 'hero');
                playAttackSound(curChar.sound);
                processTurn();
            }
        };
    }

    return div;
}

// --- Функция пропуска хода ---
function skipTurn() {
    turnOrder.push(turnOrder.shift());
    updateTurnOrderDisplay && updateTurnOrderDisplay();
    const [curName, curIdx] = turnOrder[0].split('-');
    const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
    if (selectedEnemies.includes(curChar)) {
        processTurn();
    }
}
initializeBattle();
highlightCurrentTurnCharacter();

function highlightCurrentTurnCharacter() {
    // Сначала убираем выделение у всех
    document.querySelectorAll('.character-current-turn').forEach(el => {
        el.classList.remove('character-current-turn');
        el.style.boxShadow = '';
        el.style.border = '';
    });

    // Определяем текущего персонажа по turnOrder
    const [curName, curIdx] = turnOrder[0].split('-');
    const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
    if (!curChar || !curChar.uniqueId) return;

    // Находим div по уникальному id
    const div = document.querySelector(`[data-uniqueid="${curChar.uniqueId}"]`);
    if (div) {
        div.classList.add('character-current-turn');
        div.style.border = '3px solid #00ff0055';
        // div.style.boxShadow = '0 0 16px 4px #00ff0055';
    }
}

// --- Порядок ходов ---
function calculateTurnOrder(fighters) {
    let queue = [];
    fighters.forEach((char, index) => {
        const id = `${char.name}-${index}`;
        const speed = char.speed;
        const nextTurn = 1 / speed;
        // Если Lightning — добавляем два раза
        if (char.code === "Lightning") {
            queue.push({ id, speed, nextTurn, index });
            queue.push({ id, speed, nextTurn, index }); // второй раз
        } else {
            queue.push({ id, speed, nextTurn, index });
        }
    });
    while (turnOrder.length < 100) {
        queue.sort((a, b) => a.nextTurn - b.nextTurn);
        let current = queue.shift();
        turnOrder.push(current.id);
        current.nextTurn += 1 / current.speed;
        queue.push(current);
    }
}

function cleanTurnOrder() {
    turnOrder = turnOrder.filter(id => {
        const [name, index] = id.split('-');
        const character = fighters.find((c, i) => c.name === name && i == index);
        return character && character.health > 0;
    });
}

// --- Звук атаки ---
function playAttackSound(characterSound) {
    const audio = new Audio(`sounds/${characterSound}.mp3`);
    audio.volume = parseFloat(localStorage.getItem('soundVolume') || '1');
    audio.play().catch(() => {});
}

// --- Расчет урона ---
function calculateDamage(attacker, defender) {
    let base = typeof attacker.damage === 'function' ? attacker.damage.call(attacker) : attacker.damage;
    const bonus = attacker.bonusDamage || 0;
    // Для Старейшины временный бафф
    if (attacker._damageBuff) {
        base = Math.round(base * attacker._damageBuff);
        attacker._damageBuff = null;
    }
    // Экзорцист: x2 по нежити
    if (attacker.damageMultiplier&& defender && defender.class === "Undead") {
        base *= attacker.damageMultiplier;
    }
    // Пробивной урон
    if (attacker.damagetype === "Penetrating Damage") {
        const penetration = attacker.penetration || 0;
        const defense = defender.defense || 0;
        const effectiveDefense = Math.max(0, defense * (1 - (penetration / 100)));
        return Math.round((base + bonus) * (1 - effectiveDefense / 100));
    }
    if (attacker.damagetype === "Magic Damage") {
        return Math.round(base + bonus);
    }
    const defense = defender.defense || 0;
    return Math.round((base + bonus) * (1 - defense / 100));
}

function getAttackableTargets(attacker, enemyFront, enemyBack) {
    // --- БЛОКИРОВКА АТАКИ ДЛЯ "Урон" с заднего фронта ---
    // Определяем, находится ли атакующий в заднем фронте
    const isBackRow =
        (selectedAlliesBack2.includes(attacker) && selectedAllies.includes(attacker)) ||
        (selectedEnemiesBack2.includes(attacker) && selectedEnemies.includes(attacker));
    if (attacker.damagetype === "Damage" && isBackRow) {
        // Если тип "Урон" и персонаж в тылу — не может атаковать
        return [];
    }
    if (enemyFront.some(c => c && c.health > 0)) {
        if (attacker.damagetype === "Damage" || attacker.damagetype === "Penetrating Damage") {
            return enemyFront.filter(c => c && c.health > 0);
        }
        // Стрелковый, поддержка и т.д.
        return [...enemyFront, ...enemyBack].filter(c => c && c.health > 0);
    } else {
        // Передний фронт мёртв — атакуем задний
        return enemyBack.filter(c => c && c.health > 0);
    }
}

// --- Атака союзника ---
function attack(attackerName, targetName, targetIndex, targetRow) {
    if (isAttackBlocked) return; // Блокировка атаки на 1 сек

    const attackerIndex = turnOrder[0].split('-')[1];
    const attacker = fighters.find((c, i) => `${c.name}-${i}` === `${attackerName}-${attackerIndex}`);
    // Запрет для Священника
    if (attacker && (attacker.code === "Saint" || attacker.code === "Godlikesaint")) return;

    let defender, arr, idx, row;
    if (targetRow === 'front') {
        arr = selectedEnemiesFront2;
        row = 'front';
    } else {
        arr = selectedEnemiesBack2;
        row = 'back';
    }
    defender = arr[targetIndex];
    if (!attacker || !defender) return;
    idx = arr.indexOf(defender);

    if (turnOrder[0] === `${attackerName}-${attackerIndex}`) {
        // Проверка возможности атаки (например, getAttackableTargets)
        const allowedTargets = getAttackableTargets(attacker, selectedEnemiesFront2, selectedEnemiesBack2);
        if (!allowedTargets.includes(defender)) return;
        singleAttack(attacker, defender, 'enemy', row, idx);
        playAttackSound(attacker.sound);
        updateDamageDisplay();
        checkBattleEnd();
        
        isAttackBlocked = true;
        setTimeout(() => {
            isAttackBlocked = false;
        }, 500);
        turnOrder.shift();
        turnOrder.push(`${attackerName}-${attackerIndex}`);
    }
}

// --- Атака врага ---
function enemyAttack(attackerId) {
    const [attackerName, attackerIndex] = attackerId.split('-');
    const attacker = fighters.find((c, i) => `${c.name}-${i}` === `${attackerName}-${attackerIndex}`);
    const attackerName2 = i18next.t(`${attacker.code}.name`, { defaultValue: attacker.name });
    if (!attacker || attacker.health <= 0) return;

    if (attacker.code === "Saint") {
        // Приоритет: раненый на переднем фронте → сильно раненый сам → любой раненый союзник → сам
        let target =
            selectedEnemiesFront2.filter(e => e && e.health > 0 && e.health < e.maxHealth && e !== attacker)
                .sort((a, b) => a.health - b.health)[0] ||
            (attacker.health > 0 && attacker.health < attacker.maxHealth * 0.7 ? attacker : null) ||
            selectedEnemies.filter(e => e.health > 0 && e.health < e.maxHealth && e !== attacker)
                .sort((a, b) => a.health - b.health)[0] ||
            attacker;

        healEnemy(attacker, target);
        playAttackSound(attacker.sound);
        updateDamageDisplay();
        updateStatsDisplay(target, 'enemy', true);
        return;
    }
    if (attacker.code === "Godlikesaint") {
        let shieldTargets = selectedEnemies.filter(e => e.health > 0 && e !== attacker);
        if (shieldTargets.length === 0) shieldTargets = [attacker];
        const target = shieldTargets[Math.floor(Math.random() * shieldTargets.length)];

        shieldEnemy(attacker, target);
        showCustomEffect(target, `+${attacker.damage}% защиты`, '#00c8ff', 'enemy');
        playAttackSound(attacker.sound);
        updateDamageDisplay();
        updateStatsDisplay(target, 'enemy', true);
        return;
    }

    // Получаем список разрешённых целей для врага
    const allowedTargets = getAttackableTargets(
        attacker,
        selectedAlliesFront2,
        selectedAlliesBack2
    );
    if (allowedTargets.length === 0) return;

    // Выбор цели (например, слабейший или приоритетный)
    let defender;
    let priorityTargets = allowedTargets.filter(ally => ally.damagetype !== "Damage");
    if (priorityTargets.length > 0 && Math.random() < 0.5) {
        defender = priorityTargets[Math.floor(Math.random() * priorityTargets.length)];
    } else {
        let minHealth = Math.min(...allowedTargets.map(a => a.health));
        let weakest = allowedTargets.filter(a => a.health === minHealth);
        defender = weakest[Math.floor(Math.random() * weakest.length)];
    }
    if (!defender) return;

    if (attacker.damagetype === "Area Damage") {
        const mainIdx = selectedAllies.findIndex(ally => ally === defender);
        if (mainIdx !== -1) tripleAttack(attacker, selectedAllies, mainIdx, 'hero');
    } else {
    // Найти индекс и фронт/тыл для defender
        let row = 'front', idx = selectedAlliesFront2.indexOf(defender);
        if (idx === -1) {
            row = 'back';
            idx = selectedAlliesBack2.indexOf(defender);
        }
        singleAttack(attacker, defender, 'hero', row, idx);
    }
    playAttackSound(attacker.sound);

    const characterInfoPanel = document.getElementById('character-info-panel');
        if (!characterInfoPanel) return;
        characterInfoPanel.style.display = 'flex';
        characterInfoPanel.innerHTML = `
            <h3 style="margin-top:0; text-align:center">${attackerName2}</h3>
            <div><b>${i18next.t('Rarity', { defaultValue: 'Редкость' })}:</b> &nbsp;${i18next.t(`${attacker.code}.rarity`, { defaultValue: attacker.rarity })}</div>
            <div><b>${i18next.t('Level', { defaultValue: 'Уровень' })}:</b> &nbsp;${attacker.level || 1}</div>
            <div><b>${i18next.t('Experience', { defaultValue: 'Опыт' })}:</b> &nbsp;${attacker.exp || 0}/${attacker.maxExp || 100}</div>
            <div><b>${i18next.t('Health', { defaultValue: 'Здоровье' })}:</b> &nbsp;${attacker.maxHealth || attacker.health}</div>
            <div><b>${i18next.t('Defense', { defaultValue: 'Защита' })}:</b> &nbsp;${attacker.defense || 0}</div>
            <div><b>${i18next.t('Damage', { defaultValue: 'Урон' })}:</b> &nbsp;${typeof attacker.damage === 'function' ? i18next.t('Special formula', { defaultValue: 'Спец. формула' }) : attacker.damage}</div>
            <div><b>${i18next.t('Speed', { defaultValue: 'Скорость' })}: </b>&nbsp;${attacker.speed || 0}</div>
            <div><b>${i18next.t('DamageType', { defaultValue: 'Тип урона' })}:</b> &nbsp;${i18next.t(`${attacker.code}.damagetype`, { defaultValue: attacker.damagetype || '-' })}</div> <br>
            <div><i>${i18next.t(`${attacker.code}.description`, { defaultValue: attacker.description || '-' })}</i></div> <br> 
            <div><b>${i18next.t('Ability', { defaultValue: 'Способность' })}:</b> &nbsp;${i18next.t(`${attacker.code}.ability`, { defaultValue: attacker.ability || '-' })}</div>
        `;
    
    updateDamageDisplay();
}
// --- Одиночная атака ---
function singleAttack(attacker, defender, type, row, idx) {
    if (typeof attacker.beforeAttack === 'function') {
        attacker.beforeAttack(defender);
    }
    // Если проклятье — не наносим урон, только эффект
    if (attacker.damagetype === "Curse Damage") {
        const debuff = typeof attacker.damage === 'function' ? Math.round(attacker.damage.call(attacker)) : attacker.damage;
        showCustomEffect(
            defender,
            `-${debuff} ${i18next.t('Damage', { defaultValue: 'урона' })}`,
            '#ff2222',
            type, row, idx
        );
        if (typeof defender.damage === 'number') {
            defender.damage = Math.max(0, defender.damage - debuff);
        } else if (typeof defender.damage === 'function') {
            // Можно реализовать логику для функций, если нужно
            defender.bonusDamage = (defender.bonusDamage || 0) - debuff;
        }
        updateStatsDisplay(defender, type);
        applySpecialEffects(attacker, type);
        updateDeadBlocks();
        return;
    }
    // Проклятье защиты
    if (attacker.damagetype === "Curse Defense") {
        const debuff = typeof attacker.damage === 'function' ? Math.round(attacker.damage.call(attacker)) : attacker.damage;
        showCustomEffect(
            defender,
            `-${debuff}% ${i18next.t('Defense', { defaultValue: 'защиты' })}`,
            '#ff2222',
            type, row, idx
        );
        defender.defense = (defender.defense || 0) - debuff;
        updateStatsDisplay(defender, type);
        applySpecialEffects(attacker, type);
        updateDeadBlocks();
        return;
    }

    // Обычная атака
    const damage = calculateDamage(attacker, defender);
    defender.health = Math.max(0, defender.health - damage);

    if (
        defender.code === "SkeletonKing" &&
        defender.health <= 0 &&
        !defender.hasResurrected
    ) {
        defender.hasResurrected = true;
        defender.health = Math.round((defender.maxHealth || 100) * 0.4);
        // Можно добавить эффект воскрешения:
        showCustomEffect(defender, `${i18next.t('Resurrection')}`, '#00ff00', type, row, idx);
        updateStatsDisplay(defender, type, true);
    }


    // Особые эффекты при атаке
    if (attacker.code === "corrosionSkeleton") {
        defender.defense = (defender.defense || 0) - 5;
        updateStatsDisplay(defender, type);
    }
    if (attacker.code === "cuirassier" && typeof attacker._originalDefense === 'number') {
        attacker.defense = attacker._originalDefense;
        delete attacker._originalDefense;
        updateStatsDisplay(attacker, type);
    }
    if (attacker.code === "halberdier" && typeof attacker._originalDefense === 'number') {
        attacker.defense = attacker._originalDefense;
        delete attacker._originalDefense;
        updateStatsDisplay(attacker, type);
    }
    if (attacker.code === "guardian" && typeof attacker._originalDefense === 'number') {
        attacker.defense = attacker._originalDefense;
        delete attacker._originalDefense;
        updateStatsDisplay(attacker, type);
    }

    // Используем index и row для поиска DOM-элемента
    const div = document.querySelector(`.${type}[data-char="${defender.name}-${idx}-${row}"]`);
    showAttackEffect(div, damage);

    // Обновление здоровья
    const healthSpan = document.getElementById(`${defender.code}-health-${fighters.indexOf(defender)}`);
    if (healthSpan) healthSpan.textContent = `${defender.health}/${defender.maxHealth}`;

    applySpecialEffects(attacker, type);
    updateDeadBlocks();
}

// --- Тройная атака ---
function tripleAttack(attacker, group, mainIdx, type) {
    let count = attacker.code === "Bombardier" || attacker.code === "Superdrone" ? 5 : 3;
    const half = Math.floor(count / 2);
    const targets = [];
    for (let offset = -half; offset <= half; offset++) {
        const idx = mainIdx + offset;
        if (idx >= 0 && idx < group.length) {
            const target = group[idx];
            if (target && target.health > 0 && !targets.includes(target)) {
                targets.push({ target, idx });
            }
        }
    }
    targets.forEach(({ target, idx }) => {
        const damage = calculateDamage(attacker, target);
        target.health = Math.max(0, target.health - damage);

        // Определяем row (front/back) для текущей цели
        let row = null;
        let arr = null;
        if (type === 'enemy') {
            if (selectedEnemiesFront2.includes(target)) {
                row = 'front';
                arr = selectedEnemiesFront2;
            } else if (selectedEnemiesBack2.includes(target)) {
                row = 'back';
                arr = selectedEnemiesBack2;
            }
        } else {
            if (selectedAlliesFront2.includes(target)) {
                row = 'front';
                arr = selectedAlliesFront2;
            } else if (selectedAlliesBack2.includes(target)) {
                row = 'back';
                arr = selectedAlliesBack2;
            }
        }
        const realIdx = arr ? arr.indexOf(target) : idx;

        // Обновить интерфейс
        if (typeof updateStatsDisplay === "function") {
            updateStatsDisplay(target, type, true);
        }

        // Показать эффект урона
        const div = document.querySelector(`.${type}[data-char="${target.name}-${realIdx}-${row}"]`);
        if (div) showAttackEffect(div, damage);
    });
    applySpecialEffects(attacker, type);
}

function applyStartBattleEffects() {
    // Главарь банды: увеличивает урон всем бандитам на 5
    const gangLeader = fighters.find(c => c.code === "GangLeader");
    if (gangLeader) {
        fighters.forEach(c => {
            if (c.name === "Bandit" && c !== gangLeader) {
                if (typeof c.damage === 'number') c.damage += 5;
                else c.bonusDamage = (c.bonusDamage || 0) + 5;
            }
        });
    }
    // Королевский мушкетёр: повышает урон мушкетёрам на 5
    const royalMusketeer = fighters.find(c => c.code === "royalMusketeer");
    if (royalMusketeer) {
        fighters.forEach(c => {
            if (c.code === "musketeer" && c !== royalMusketeer) {
                if (typeof c.damage === 'number') c.damage += 5;
                else c.bonusDamage = (c.bonusDamage || 0) + 5;
            }
        });
    }
    // Начальник стражи: увеличивает защиту союзников на 10%
    const guardCaptain = fighters.find(c => c.code === "guardCaptain");
    if (guardCaptain) {
        const team = selectedEnemies.includes(guardCaptain) ? selectedEnemies : selectedAllies;
        team.forEach(c => {
            if (c !== guardCaptain) c.defense = (c.defense || 0) + 10;
        });
    }
    // Кирасир: до первого хода имеет 90% защиту
    fighters.forEach(c => {
        if (c.code === "cuirassier") {
            c._originalDefense = c.defense;
            c.defense = 90;
        }
    });
    fighters.forEach(c => {
        if (c.code === "guardian") {
            c._originalDefense = c.defense;
            c.defense = 50;
        }
    });
    fighters.forEach(c => {
        if (c.code === "halberdier") {
            c._originalDefense = c.defense;
            c.defense = 65;
        }
    });
    // Лансер: атакует первым (ставим в начало очереди)
    const lancerIds = fighters
        .map((c, idx) => ({ code: c.code, idx, speed: c.speed }))
        .filter(obj => obj.code === "lancer")
        .sort((a, b) => b.speed - a.speed) // быстрее — раньше
        .map(obj => `${fighters[obj.idx].name}-${obj.idx}`);

    const cavalierIds = fighters
        .map((c, idx) => ({ code: c.code, idx, speed: c.speed }))
        .filter(obj => obj.code === "Cavalier")
        .sort((a, b) => b.speed - a.speed) // быстрее — раньше
        .map(obj => `${fighters[obj.idx].name}-${obj.idx}`);

    const horseCrossbowmanIds = fighters
        .map((c, idx) => ({ code: c.code, idx, speed: c.speed }))
        .filter(obj => obj.code === "horseCrossbowman")
        .sort((a, b) => b.speed - a.speed) // быстрее — раньше
        .map(obj => `${fighters[obj.idx].name}-${obj.idx}`);

    const hasCavalierGuard = selectedAllies.some(c => c && c.code === "cavalierGuard");
    const hasCavalierGuardEnemy = selectedEnemies.some(c => c && c.code === "cavalierGuard");

    if (hasCavalierGuard) {
        // Собираем id всех персонажей переднего фронта
        const frontIds = selectedAlliesFront2
            .map((c, idx) => c ? `${c.name}-${fighters.indexOf(c)}` : null)
            .filter(Boolean);

        // Вставляем весь передний фронт в начало очереди
        turnOrder = [...frontIds, ...turnOrder];
    }

    if (hasCavalierGuardEnemy) {
        // Собираем id всех персонажей переднего фронта
        const frontIds = selectedEnemiesFront2
            .map((c, idx) => c ? `${c.name}-${fighters.indexOf(c)}` : null)
            .filter(Boolean);

        // Вставляем весь передний фронт в начало очереди
        turnOrder = [...frontIds, ...turnOrder];
    }

    // Вставляем всех лансеров в начало очереди
    turnOrder = [...lancerIds, ...turnOrder];
    turnOrder = [...cavalierIds, ...turnOrder];
    turnOrder = [...horseCrossbowmanIds, ...turnOrder];
}

// --- Эффекты после атаки ---
function applySpecialEffects(attacker, type) {
    const group = type === 'enemy' ? selectedAllies : selectedEnemies;
    if (attacker.code === "Hero") {
        if (typeof attacker.damage === 'number') attacker.damage += 4;
        else attacker.bonusDamage = (attacker.bonusDamage || 0) + 5;
        attacker.defense = (attacker.defense || 0) + 2;
        updateStatsDisplay(attacker, type);
    }
    if (attacker.code === "Cavalier") {
        if (typeof attacker.damage === 'number') attacker.damage += 5;
        else attacker.bonusDamage = (attacker.bonusDamage || 0) + 5;
        updateStatsDisplay(attacker, type);
    }
    if (attacker.code === "Zombiehunter") {
        attacker.health += 20;
        attacker.health = Math.min(attacker.maxHealth, attacker.health);
        updateStatsDisplay(attacker, type, true);
    }
    if (attacker.code === "Shaman") {
        attacker.health += 15;
        attacker.health = Math.min(attacker.maxHealth, attacker.health);
        updateStatsDisplay(attacker, type, true);
    }
    if (attacker.code === "Flag") {
        group.forEach(char => {
            if (typeof char.damage === 'number') char.damage += 5;
            else char.bonusDamage = (char.bonusDamage || 0) + 5;
            char.defense = (char.defense || 0) + 2;
            updateStatsDisplay(char, type);
        });
    }
    if (attacker.code === "Healer") {
    // Лечим только передний фронт
    selectedAlliesFront2.forEach(char => {
        if (char && char.health > 0) {
            let healAmount = 10;
            healAmount = Math.min(char.maxHealth - char.health, healAmount);
            char.health += healAmount;
            char.health = Math.min(char.health, char.maxHealth);
            updateStatsDisplay(char, type, true);
            showHealEffect(char, healAmount, 'hero');
        }
    });
}
    if (attacker.code === "Paladin") {
        group.forEach(char => {
            char.defense = (char.defense || 0) + 4;
            updateStatsDisplay(char, type);
        });
    }
    if (attacker.code === "Voidemperor" || attacker.code === "Ultradrone") {
        // Если атакует союзник, урон всем врагам
        // Если атакует враг, урон всем союзникам
        const targets = type === 'enemy' ? selectedEnemies : selectedAllies;
        targets.forEach(char => {
            if (!char || char.health <= 0) return;
            char.health = Math.max(0, char.health - (typeof attacker.damage === 'function' ? attacker.damage.call(attacker) : attacker.damage));
            // Лучше обновлять через updateDamageDisplay(), а не через indexOf
        });
        updateDamageDisplay();
    }
    if (attacker.code === "Bloodknight") {
        attacker.health -= 40;
        updateStatsDisplay(attacker, type, true);
    }
}

// --- Обновление интерфейса персонажа ---
function updateStatsDisplay(char, type, updateHealth = false) {
    // Ограничиваем защиту максимум 90%
    if (char.defense > 90) char.defense = 90;

    const idx = fighters.indexOf(char);
    const damageSpan = document.getElementById(`${char.code}-damage-${idx}`);
    const defenseSpan = document.getElementById(`${char.code}-defense-${idx}`);
    if (damageSpan) {
        damageSpan.textContent = typeof char.damage === 'function'
            ? Math.round(char.damage.call(char) + (char.bonusDamage || 0))
            : char.damage;
    }
    if (updateHealth) {
        const healthSpan = document.getElementById(`${char.code}-health-${idx}`);
        if (healthSpan) healthSpan.textContent = `${char.health}/${char.maxHealth}`;
    }
    if (defenseSpan) {
        defenseSpan.textContent = `${char.defense}%`;
    }

    // --- ДОБАВЬТЕ ЭТО ДЛЯ ОБНОВЛЕНИЯ ПОЛОСКИ ЗДОРОВЬЯ ---
    // Найти div персонажа
    let group = type === 'enemy' ? selectedEnemies : selectedAllies;
    let groupIdx = group.indexOf(char);
    let row = null;
    if (type === 'enemy') {
        if (selectedEnemiesFront2.includes(char)) {
            row = 'front';
            groupIdx = selectedEnemiesFront2.indexOf(char);
        } else if (selectedEnemiesBack2.includes(char)) {
            row = 'back';
            groupIdx = selectedEnemiesBack2.indexOf(char);
        }
    } else {
        if (selectedAlliesFront2.includes(char)) {
            row = 'front';
            groupIdx = selectedAlliesFront2.indexOf(char);
        } else if (selectedAlliesBack2.includes(char)) {
            row = 'back';
            groupIdx = selectedAlliesBack2.indexOf(char);
        }
    }
    const div = document.querySelector(`.${type}[data-char="${char.name}-${groupIdx}-${row}"]`);
    if (div) {
        const hpBarInner = div.querySelector('.hp-bar-inner');
        if (hpBarInner) {
            const percent = Math.max(0, Math.min(1, char.health / char.maxHealth));
            hpBarInner.style.width = `${percent * 100}%`;
        }
    }
}

// --- Анимация атаки ---
function showAttackEffect(targetDiv, damage) {
    const effectContainer = document.getElementById('attack-effect-container');
    if (!effectContainer || !targetDiv) return;
    const gifSize = 200;
    const rect = targetDiv.getBoundingClientRect();
    const effectDiv = document.createElement('div');
    effectDiv.style.position = 'fixed';
    effectDiv.style.left = `${rect.left + rect.width / 2 - gifSize / 2}px`;
    effectDiv.style.top = `${rect.top + rect.height / 2 - gifSize / 2}px`;
    effectDiv.style.zIndex = 2100;
    effectDiv.style.width = gifSize + 'px';
    effectDiv.style.height = gifSize + 'px';
    effectDiv.style.pointerEvents = 'none';

    const gif = document.createElement('img');
    gif.src = 'attack.gif';
    gif.style.width = '100%';
    gif.style.height = '100%';
    gif.style.objectFit = 'contain';
    gif.style.position = 'absolute';
    gif.style.left = '0';
    gif.style.top = '0';
    gif.style.pointerEvents = 'none';

    const dmg = document.createElement('div');
    dmg.textContent = `-${damage}`;
    dmg.style.position = 'absolute';
    dmg.style.left = '50%';
    dmg.style.top = '50%';
    dmg.style.transform = 'translate(-50%, -50%)';
    dmg.style.color = '#ff2222';
    dmg.style.fontWeight = 'bold';
    dmg.style.fontSize = '2em';
    dmg.style.textShadow = '0 0 8px #fff, 0 0 4px #ff0000';
    dmg.style.animation = 'dmg-float 1s ease-out';

    effectDiv.appendChild(gif);
    effectDiv.appendChild(dmg);
    effectContainer.appendChild(effectDiv);

    setTimeout(() => { effectDiv.remove(); }, 400);
}
if (!document.getElementById('dmg-float-style')) {
    const style = document.createElement('style');
    style.id = 'dmg-float-style';
    style.innerHTML = `
    @keyframes dmg-float {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
        80% { opacity: 1; transform: translate(-50%, -90%) scale(1.2);}
        100% { opacity: 0; transform: translate(-50%, -120%) scale(1);}
    }`;
    document.head.appendChild(style);
}

// --- Лечение и щит ---
function healAlly(healer, target) {
    if (!target || target.health <= 0) return; // Запрет лечения мёртвых
    let healAmount = typeof healer.damage === 'function' ? Math.round(healer.damage.call(healer)) : healer.damage;
    healAmount = Math.min(target.maxHealth - target.health, healAmount);
    target.health += healAmount;
    target.health = Math.min(target.health, target.maxHealth);
    updateStatsDisplay(target, 'hero', true);
    showHealEffect(target, healAmount);
}

function shieldAlly(healer, target) {
    const shieldAmount = typeof healer.damage === 'function' ? Math.round(healer.damage.call(healer)) : healer.damage;
    target.defense += shieldAmount;
    updateStatsDisplay(target, 'hero', true);
}
function healEnemy(healer, target) {
    if (!target || target.health <= 0) return; // Запрет лечения мёртвых
    let healAmount = healer.damage;
    healAmount = Math.min(target.maxHealth - target.health, healAmount);
    target.health += healAmount;
    target.health = Math.min(target.health, target.maxHealth);
    updateStatsDisplay(target, 'enemy', true);
    showHealEffect(target, healAmount, 'enemy');
}
function shieldEnemy(healer, target) {
    const shieldAmount = typeof healer.damage === 'function' ? Math.round(healer.damage.call(healer)) : healer.damage;
    target.defense += shieldAmount;
    updateStatsDisplay(target, 'enemy', true);
}


function showHealEffect(targetChar, amount, type = 'hero', row = null, idx = null) {
    let group;
    if (type === 'hero') group = [...selectedAlliesFront2, ...selectedAlliesBack2];
    else group = [...selectedEnemiesFront2, ...selectedEnemiesBack2];

    // Если row и idx не переданы — ищем по всем фронтам
    if (row === null || idx === null) {
        let found = false;
        ['front', 'back'].forEach(r => {
            group = type === 'hero'
                ? (r === 'front' ? selectedAlliesFront2 : selectedAlliesBack2)
                : (r === 'front' ? selectedEnemiesFront2 : selectedEnemiesBack2);
            const i = group.indexOf(targetChar);
            if (i !== -1 && !found) {
                row = r;
                idx = i;
                found = true;
            }
        });
        if (!found) return;
    }

    const div = document.querySelector(`.${type}[data-char="${targetChar.name}-${idx}-${row}"]`);
    const effectContainer = document.getElementById('attack-effect-container');
    if (!effectContainer || !div) return;
    const gifSize = 200;
    const rect = div.getBoundingClientRect();
    const effectDiv = document.createElement('div');
    effectDiv.style.position = 'fixed';
    effectDiv.style.left = `${rect.left + rect.width / 2 - gifSize / 2}px`;
    effectDiv.style.top = `${rect.top + rect.height / 2 - gifSize / 2}px`;
    effectDiv.style.zIndex = 2100;
    effectDiv.style.width = gifSize + 'px';
    effectDiv.style.height = gifSize + 'px';
    effectDiv.style.pointerEvents = 'none';

    const heal = document.createElement('div');
    heal.textContent = `+${amount}`;
    heal.style.position = 'absolute';
    heal.style.left = '50%';
    heal.style.top = '50%';
    heal.style.transform = 'translate(-50%, -50%)';
    heal.style.color = '#22cc22';
    heal.style.fontWeight = 'bold';
    heal.style.fontSize = '2em';
    heal.style.textShadow = '0 0 8px #fff, 0 0 4px #22ff22';
    heal.style.animation = 'dmg-float 1s ease-out';

    effectDiv.appendChild(heal);
    effectContainer.appendChild(effectDiv);

    setTimeout(() => { effectDiv.remove(); }, 400);
}

function showCustomEffect(targetChar, text, color, type = 'hero', row = null, idx = null) {
    let group;
    if (type === 'hero') group = [...selectedAlliesFront2, ...selectedAlliesBack2];
    else group = [...selectedEnemiesFront2, ...selectedEnemiesBack2];

    if (row === null || idx === null) {
        let found = false;
        ['front', 'back'].forEach(r => {
            group = type === 'hero'
                ? (r === 'front' ? selectedAlliesFront2 : selectedAlliesBack2)
                : (r === 'front' ? selectedEnemiesFront2 : selectedEnemiesBack2);
            const i = group.indexOf(targetChar);
            if (i !== -1 && !found) {
                row = r;
                idx = i;
                found = true;
            }
        });
        if (!found) return;
    }

    const div = document.querySelector(`.${type}[data-char="${targetChar.name}-${idx}-${row}"]`);
    const effectContainer = document.getElementById('attack-effect-container');
    if (!effectContainer || !div) return;
    const gifSize = 200;
    const rect = div.getBoundingClientRect();
    const effectDiv = document.createElement('div');
    effectDiv.style.position = 'fixed';
    effectDiv.style.left = `${rect.left + rect.width / 2 - gifSize / 2}px`;
    effectDiv.style.top = `${rect.top + rect.height / 2 - gifSize / 2}px`;
    effectDiv.style.zIndex = 2100;
    effectDiv.style.width = gifSize + 'px';
    effectDiv.style.height = gifSize + 'px';
    effectDiv.style.pointerEvents = 'none';

    const effect = document.createElement('div');
    effect.textContent = text;
    effect.style.position = 'absolute';
    effect.style.left = '50%';
    effect.style.top = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.color = color;
    effect.style.fontWeight = 'bold';
    effect.style.fontSize = '1.5em';
    effect.style.textShadow = '0 0 8px #fff, 0 0 4px ' + color;
    effect.style.animation = 'dmg-float 1s ease-out';

    effectDiv.appendChild(effect);
    effectContainer.appendChild(effectDiv);

    setTimeout(() => { effectDiv.remove(); }, 400);
}

function showShieldEffect(targetChar, amount) {
    const group = selectedAllies;
    const div = document.querySelector(`.hero[data-char="${targetChar.name}-${group.indexOf(targetChar)}"]`);
    const effectContainer = document.getElementById('attack-effect-container');
    if (!effectContainer || !div) return;
    const gifSize = 200;
    const rect = div.getBoundingClientRect();
    const effectDiv = document.createElement('div');
    effectDiv.style.position = 'fixed';
    effectDiv.style.left = `${rect.left + rect.width / 2 - gifSize / 2}px`;
    effectDiv.style.top = `${rect.top + rect.height / 2 - gifSize / 2}px`;
    effectDiv.style.zIndex = 2100;
    effectDiv.style.width = gifSize + 'px';
    effectDiv.style.height = gifSize + 'px';
    effectDiv.style.pointerEvents = 'none';

    const shield = document.createElement('div');
    shield.textContent = `+${amount}`;
    shield.style.position = 'absolute';
    shield.style.left = '50%';
    shield.style.top = '50%';
    shield.style.transform = 'translate(-50%, -50%)';
    shield.style.color = '#22cc22';
    shield.style.fontWeight = 'bold';
    shield.style.fontSize = '2em';
    shield.style.textShadow = '0 0 8px #fff, 0 0 4px rgb(34,185,255)';
    shield.style.animation = 'dmg-float 1s ease-out';

    effectDiv.appendChild(shield);
    effectContainer.appendChild(effectDiv);

    setTimeout(() => { effectDiv.remove(); }, 400);
}

// --- Обновление интерфейса ---
function updateDamageDisplay() {
    selectedAllies.filter(Boolean).forEach(ally => updateStatsDisplay(ally, 'hero'));
    selectedEnemies.filter(Boolean).forEach(enemy => updateStatsDisplay(enemy, 'enemy'));

}

function updateDeadBlocks() {
    // Союзники
    [...selectedAlliesFront2, ...selectedAlliesBack2].forEach((ally) => {
        if (!ally) return;
        const group = selectedAlliesFront2.includes(ally) ? selectedAlliesFront2 : selectedAlliesBack2;
        const row = selectedAlliesFront2.includes(ally) ? 'front' : 'back';
        const idx = group.indexOf(ally);
        const div = document.querySelector(`.hero[data-char="${ally.name}-${idx}-${row}"]`);
        if (div) {
            div.style.filter = ally.health <= 0 ? 'grayscale(1) brightness(0.7)' : '';
            div.style.opacity = ally.health <= 0 ? '0.5' : '1';
        }
    });
    // Враги
    [...selectedEnemiesFront2, ...selectedEnemiesBack2].forEach((enemy) => {
        if (!enemy) return;
        const group = selectedEnemiesFront2.includes(enemy) ? selectedEnemiesFront2 : selectedEnemiesBack2;
        const row = selectedEnemiesFront2.includes(enemy) ? 'front' : 'back';
        const idx = group.indexOf(enemy);
        const div = document.querySelector(`.enemy[data-char="${enemy.name}-${idx}-${row}"]`);
        if (div) {
            if (enemy.health <= 0) {
                div.style.filter = 'grayscale(1) brightness(0.7)';
                div.style.opacity = '0.5';
            } else {
                div.style.filter = '';
                div.style.opacity = '1';
            }
        }
    });
}

// --- Порядок ходов в UI ---
function updateTurnOrderDisplay() {
    const turnOrderItems = document.querySelectorAll('.turn-order-item');
    turnOrderItems.forEach((item, index) => {
        if (index < turnOrder.length) {
            const [name, idIndex] = turnOrder[index].split('-');
            let character = selectedAllies.concat(selectedEnemies).find((c, i) => `${c.name}-${i}` === `${name}-${idIndex}`);
            if (!character) character = selectedAllies.concat(selectedEnemies).find(c => c.name === name);
            // Переводим имя по коду
            const displayName = character && character.code
                ? i18next.t(`${character.code}.name`, { defaultValue: 'chlen'})
                : name;
            item.textContent = displayName;
            const isAlly = selectedAllies.filter(Boolean).some((ally, i) => `${ally.name}-${i}` === `${name}-${idIndex}`);
            const isEnemy = selectedEnemies.filter(Boolean).some((enemy, i) => `${enemy.name}-${i}` === `${name}-${idIndex}`);
            item.style.borderColor = isAlly ? 'blue' : isEnemy ? 'red' : 'red';
        } else {
            item.textContent = '';
            item.style.borderColor = '';
        }
    });
}

// --- Возврат персонажей в инвентарь ---
function returnCharactersToInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const allies = JSON.parse(localStorage.getItem('selectedAllies')) || [];
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    allies.forEach(character => {
        if (character.isMaterialized && character.materializedId) {
            // Уже есть в materializedCharacters — ничего не делаем
        } else {
            const inventoryItem = inventory.find(item => item.name === character.name && item.rarity === character.rarity);
            if (inventoryItem) {
                inventoryItem.quantity += 1;
            } else {
                inventory.push({ name: character.name, rarity: character.rarity, quantity: 1, type: 'character' });
            }
        }
    });
    localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// --- Генерация наград ---
function getQuantityChances(rarity, quantityChancesConfig = {}) {
    if (quantityChancesConfig[rarity]) return quantityChancesConfig[rarity];
    return { 1: 100 };
}
const defaultQuantityChancesConfig = {
    "Common":     { 1: 20, 2: 50, 3: 20, 4: 10 },
    "Uncommon":   { 1: 60, 2: 30, 3: 10 },
    "Rare":      { 1: 75, 2: 18, 3: 7 },
    "Superrare": { 1: 75, 2: 25 },
    "Epic":   { 1: 90, 2: 10 },
    "Mythic":  { 1: 100 },
    "Legendary": { 1: 100 }
};
function getRandomQuantity(chances) {
    const roll = Math.random() * 100;
    let currentSum = 0;
    for (const [quantity, chance] of Object.entries(chances)) {
        currentSum += chance;
        if (roll <= currentSum) return parseInt(quantity);
    }
    return 1;
}
function generateDrop({
    minCount,
    maxCount,
    rarityWeights,
    location,
    dropChance = 100,
    quantityChancesConfig 
}) {
    if (!localStorage.getItem('currentLevel')) { return }
    const rewards = [];
    const dropCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const locationArr = Array.isArray(location) ? location : [location];
    const filteredItems = items.filter(item =>
        item.type === "drop" &&
        (item.location === "everywhere" || locationArr.includes(item.location))
    );
    let attempts = 0;
    while (rewards.length < dropCount && attempts < dropCount * 5) {
        attempts++;
        if (Math.random() * 100 > dropChance) continue;
        const rarityPool = [];
        Object.entries(rarityWeights).forEach(([rarity, weight]) => {
            if (Math.random() * 100 < weight) rarityPool.push(rarity);
        });
        if (rarityPool.length === 0) continue;
        const selectedRarity = rarityPool[Math.floor(Math.random() * rarityPool.length)];
        const itemsOfRarity = filteredItems.filter(item => item.rarity === selectedRarity);
        if (itemsOfRarity.length === 0) continue;
        const randomItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
        const quantityChances = getQuantityChances(selectedRarity, quantityChancesConfig);
        const quantity = getRandomQuantity(quantityChances);
        const already = rewards.find(r => r.name === randomItem.name && r.rarity === randomItem.rarity);
        if (already) already.quantity += quantity;
        else rewards.push({ ...randomItem, quantity });
    }
    let currentLevel = localStorage.getItem('currentLevel')
    // --- Сосуды (эпические) ---
    if (locationArr.includes("all") && Math.random() * 2000 < 1 + currentLevel) {
        const vessels = [
            { name: "Human Vessel", key: "human_vessel", rarity: "Epic", weight: 97 },
            { name: "Inhuman Vessel", key: "inhuman_vessel", rarity: "Epic", weight: 1 },
            { name: "Ubdead Vessel", key: "undead_vessel", rarity: "Epic", weight: 1 },
            { name: "Cybernetic Vessel", key: "cybernetic_vessel", rarity: "Epic", weight: 1 }
        ];
        const totalWeight = vessels.reduce((sum, vessel) => sum + vessel.weight, 0);
        let randomWeight = Math.random() * totalWeight;
        for (const vessel of vessels) {
            if (randomWeight < vessel.weight) {
                rewards.push({ name: vessel.name, key: vessel.key, rarity: vessel.rarity, quantity: 1 });
                break;
            }
            randomWeight -= vessel.weight;
        }
    }
    // --- Легендарные сосуды ---
    if (locationArr.includes("divine") && Math.random() * 100000 < currentLevel) {
        const legendaryVessels = [
            { name: "Hero Vessel", key: "hero_vessel", rarity: "Legendary" },
            // { name: "Пустотный сосуд", key: "void_vessel", rarity: "Legendary" }
        ];
        const selectedLegendaryVessel = legendaryVessels[Math.floor(Math.random() * legendaryVessels.length)];
        rewards.push({ ...selectedLegendaryVessel, quantity: 1 });
    }

    return rewards;
}

// --- Награды за уровень ---
function getLevelRewards(level) {
    switch (true) {
        case (level <= 5):
            return {
                minCount: 0,
                maxCount: 1,
                rarityWeights: { "Common": 100 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 0: 20, 1: 79, 2: 1 }
                }
            };
        case (level >= 6 && level <= 10):
            return {
                minCount: 1,
                maxCount: 1,
                rarityWeights: { "Common": 75, "Uncommon": 25 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 60, 2: 30, 3: 10 },
                    "Uncommon": { 1: 90, 2: 10 }
                }
            };
        case (level >= 11 && level <= 20):
            return {
                minCount: 1,
                maxCount: 2,
                rarityWeights: { "Common": 65, "Uncommon": 35 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 40, 2: 45, 3: 15 },
                    "Uncommon": { 1: 80, 2: 20 }
                }
            };
        case (level >= 21 && level <= 30):
            return {
                minCount: 1,
                maxCount: 2,
                rarityWeights: { "Common": 70, "Uncommon": 25, "Rare": 5 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 30, 2: 50, 3: 20 },
                    "Uncommon": { 1: 75, 2: 25 },
                    "Rare": { 1: 100 }
                }
            };
        case (level >= 31 && level <= 40):
            return {
                minCount: 1,
                maxCount: 2,
                rarityWeights: { "Common": 60, "Uncommon": 40 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 25, 2: 50, 3: 25 },
                    "Uncommon": { 1: 70, 2: 25, 3: 5 }
                }
            };
        case (level >= 41 && level <= 50):
            return {
                minCount: 1,
                maxCount: 2,
                rarityWeights: { "Common": 55, "Uncommon": 45 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 20, 2: 50, 3: 30 },
                    "Uncommon": { 1: 65, 2: 27, 3: 8 }
                }
            };
        case (level >= 51 && level <= 60):
            return {
                minCount: 1,
                maxCount: 3,
                rarityWeights: { "Common": 100},
                location: "all",
                quantityChancesConfig: {
                    "Common": { 2: 45, 3: 30, 4: 20, 5: 5 },
                }
            };
        case (level >= 61 && level <= 70):
            return {
                minCount: 1,
                maxCount: 2,
                rarityWeights: { "Common": 60, "Uncommon": 28, "Rare": 12 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 25, 2: 50, 3: 25 },
                    "Uncommon": { 1: 70, 2: 25, 3: 5 },
                    "Rare": { 1: 95, 2: 5 }
                }
            };
        case (level >= 71 && level <= 80):
            return {
                minCount: 1,
                maxCount: 3,
                rarityWeights: { "Uncommon": 100},
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 95, 2: 5 },
                }
            };
        case (level >= 81 && level <= 90):
            return {
                minCount: 1,
                maxCount: 3,
                rarityWeights: { "Common": 55, "Uncommon": 30, "Rare": 15 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 20, 2: 55, 3: 25 },
                    "Uncommon": { 1: 65, 2: 28, 3: 7 },
                    "Rare": { 1: 92, 2: 8 }
                }
            };
        case (level >= 91 && level <= 99):
            return {
                minCount: 1,
                maxCount: 3,
                rarityWeights: { "Common": 47, "Uncommon": 32, "Rare": 16, "Superrare": 5 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 15, 2: 55, 3: 30 },
                    "Uncommon": { 1: 60, 2: 31, 3: 9 },
                    "Rare": { 1: 90, 2: 10 },
                    "Superrare": { 1: 95, 2: 5 }
                }
            };
        case (level == 100):
            return {
                minCount: 1,
                maxCount: 4,
                rarityWeights: { "Common": 45, "Uncommon": 30, "Rare": 16, "Superrare": 6, "Epic": 2, "Mythic": 1 },
                location: "all",
                quantityChancesConfig: {
                    "Common": { 1: 13, 2: 54, 3: 33 },
                    "Uncommon": { 1: 60, 2: 30, 3: 10 },
                    "Rare": { 1: 88, 2: 12 },
                    "Superrare": { 1: 92, 2: 8 },
                    "Epic": { 1: 97, 2: 3 },
                    "Mythic": { 1: 100},
                }
            };       
        default:
            return undefined;
    }
}

// --- Модальное окно наград ---
function showRewardsModal(rewards) {
    const modal = document.getElementById('battleResultModal');
    const title = document.getElementById('battleResultTitle');
    const text = document.getElementById('battleResultText');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const toCharactersBtn = document.getElementById('toCharactersBtn');
    title.textContent = i18next.t('Victory', { defaultValue: 'Победа!' });
    let expBlock = '';
    if (expMessages.length > 0) {
        expBlock = `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top:10px;margin-bottom:10px;">
            ${expMessages.map(msg => `<div>${msg}</div>`).join('')}
        </div>`;
    }
    text.innerHTML = `
        ${i18next.t('You received the following rewards', { defaultValue: 'Вы получили следующие награды:' })}<br>
        ${rewards.map(reward => {
            // Получаем ключ предмета для перевода
            const itemKey = reward.key || (items.find(it => it.name === reward.name)?.key);
            const itemName = itemKey ? i18next.t(`items.${itemKey}`, { defaultValue: reward.name }) : reward.name;
            return `
                <div style="display: flex; align-items: center; margin: 5px;">
                    <div style="width: 30px; height: 30px; background-color: ${rarityColors[reward.rarity]}; border-radius: 5px; margin-right: 10px;"></div>
                    <span>+${reward.quantity} ${itemName}</span>
                </div>
            `;
        }).join('')}
        <br> <b>${i18next.t('Experience and levels', { defaultValue: 'Опыт и уровни:' })}</b><br>
        <div style="display: flex; justify-content: center; font-weight: 900; font-size: 20px">
            ${expPlayerMessages.join('<br>')}
        </div>
        ${expBlock}
    `;
    modal.style.display = 'flex';
    tryAgainBtn.textContent = i18next.t('Try Again', { defaultValue: 'Попробовать ещё раз' });
    toCharactersBtn.textContent = i18next.t('To Characters', { defaultValue: 'К персонажам' });
    tryAgainBtn.onclick = () => {
    if (selectedAllies.length === 0) return;
    selectedAllies.forEach(ally => { ally.health = ally.maxHealth || 100; });
    const currentLevel = parseInt(localStorage.getItem('currentLevel'));
    let selectedEnemiesFront = [];
    let selectedEnemiesBack = [];
    if (currentLevel) {
        const levelEnemies = campaignLevels[currentLevel - 1];
        if (levelEnemies) {
            selectedEnemiesFront = (levelEnemies.front || []).map(enemyDef => {
                const enemyTemplate = characters.find(c => c.name === enemyDef.name);
                if (!enemyTemplate) return null;
                const enemy = { ...enemyTemplate };
                enemy.level = enemyDef.level;
                enemy.maxHealth = Math.round((enemy.maxHealth || enemy.health || 100) * Math.pow(1.1, enemyDef.level - 1));
                enemy.health = enemy.maxHealth;
                let multiplier = 1;
                switch (enemyTemplate.damagetype) {
                    case "Damage":
                    case "Area Damage":
                    case "Ranged Damage":
                        multiplier = 1.1;
                        break;
                    case "Curse Defense":
                        multiplier = 1.02;
                        break;
                    case "Defense Buff":
                        multiplier = 1.05;
                        break;
                    case "Heal":
                        multiplier = 1.075;
                        break;
                    case "Curse Damage":
                        multiplier = 1.025;
                        break;
                    default:
                        multiplier = 1.1;
                }

                if (typeof enemyTemplate.damage === 'number') {
                    enemy.damage = Math.round(enemyTemplate.damage * Math.pow(multiplier, enemy.level - 1));
                } else if (typeof enemyTemplate.damage === 'function') {
                    const baseFunc = enemyTemplate.damage;
                    enemy.damage = function() {
                        return Math.round(baseFunc.call(this) * Math.pow(multiplier, enemy.level - 1));
                    };
                }
                return enemy;
            }).filter(Boolean);

            selectedEnemiesBack = (levelEnemies.back || []).map(enemyDef => {
                const enemyTemplate = characters.find(c => c.name === enemyDef.name);
                if (!enemyTemplate) return null;
                const enemy = { ...enemyTemplate };
                enemy.level = enemyDef.level;
                enemy.maxHealth = Math.round((enemy.maxHealth || enemy.health || 100) * Math.pow(1.1, enemyDef.level - 1));
                enemy.health = enemy.maxHealth;
                let multiplier = 1;
                    switch (enemyTemplate.damagetype) {
                        case "Damage":
                        case "Area Damage":
                        case "Ranged Damage":
                            multiplier = 1.1;
                            break;
                        case "Curse Defense":
                            multiplier = 1.02;
                            break;
                        case "Defense Buff":
                            multiplier = 1.05;
                            break;
                        case "Heal":
                            multiplier = 1.075;
                            break;
                        case "Curse Damage":
                            multiplier = 1.025;
                            break;
                        default:
                            multiplier = 1.1;
                    }

                    if (typeof enemyTemplate.damage === 'number') {
                        enemy.damage = Math.round(enemyTemplate.damage * Math.pow(multiplier, enemy.level - 1));
                    } else if (typeof enemyTemplate.damage === 'function') {
                        const baseFunc = enemyTemplate.damage;
                        enemy.damage = function() {
                            return Math.round(baseFunc.call(this) * Math.pow(multiplier, enemy.level - 1));
                        };
                    }
                return enemy;
            }).filter(Boolean);
        }
    } else {
         const rarityWeights = {
                "Common": 50, "Uncommon": 30, "Rare": 15,
                "Superrare": 10, "Epic": 5, "Mythic": 3, "Legendary": 2
            };
            const randomEnemies = [];
            while (randomEnemies.length < 5) {
                const rarityPool = Object.keys(rarityWeights).filter(rarity => Math.random() * 100 < rarityWeights[rarity]);
                const selectedRarity = rarityPool[Math.floor(Math.random() * rarityPool.length)];
                const charactersOfRarity = characters.filter(c => c.rarity === selectedRarity);
                if (charactersOfRarity.length > 0) {
                    const randomCharacter = charactersOfRarity[Math.floor(Math.random() * charactersOfRarity.length)];
                    randomEnemies.push({ ...randomCharacter });
                }
            }
            selectedEnemies = randomEnemies;
    }
    localStorage.setItem('selectedEnemiesFront', JSON.stringify(selectedEnemiesFront));
    localStorage.setItem('selectedEnemiesBack', JSON.stringify(selectedEnemiesBack));
    localStorage.setItem('selectedAllies', JSON.stringify(selectedAllies));
    window.location.href = 'index.html';
    };
    toCharactersBtn.onclick = () => { window.location.href = 'characters.html'; };
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    rewards.forEach(reward => {
        const itemFromList = items.find(it => it.name === reward.name);
        const key = itemFromList ? itemFromList.key : undefined;
        const existingItem = inventory.find(item => item.name === reward.name && item.rarity === reward.rarity);
        if (existingItem) {
            existingItem.quantity += reward.quantity;
        } else {
            inventory.push({
                name: reward.name,
                rarity: reward.rarity,
                quantity: reward.quantity,
                type: 'item',
                key // добавляем ключ для мультиязычности
            });
        }
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// --- Опыт и уровни ---
function checkAndUpdateLevel(char) {
    
    const rarityMap = {
        "Common": 2, "Uncommon": 4, "Rare": 6, "Superrare": 8,
        "Epic": 10, "Mythic": 15, "Legendary": 25
    };
    let expSum = selectedEnemies.reduce((sum, enemy) => sum + (rarityMap[enemy.rarity] || 1), 0);
    expSum *= 1 + selectedEnemies.length/20
    expSum = Math.ceil(expSum)
    let expForOneChar = parseFloat((expSum / selectedAllies.filter(ally => ally && ally.health > 0).length).toFixed(2));
    let levelUps = 0;
    let oldLevel = char.level || 1;
    while (char.exp >= char.maxExp) {
        char.exp -= char.maxExp;
        char.level = (char.level || 1) + 1;
        char.maxExp = Math.round(char.maxExp * 1.3 / 10) * 10;
        char.maxHealth = Math.round((char.maxHealth || char.health) * 1.1);
        char.health = char.maxHealth;

        // Формула повышения урона в зависимости от типа
        let multiplier = 1;
        switch (char.damagetype) {
            case "Damage":
            case "Area Damage":
            case "Ranged Damage":
                multiplier = 1.1;
                break;
            case "Curse Defense":
                multiplier = 1.02;
                break;
            case "Defense Buff":
                multiplier = 1.05;
                break;
            case "Heal":
                multiplier = 1.075;
                break;
            case "Curse Damage":
                multiplier = 1.025;
                break;
            default:
                multiplier = 1.1;
        }

        if (typeof char.damage === 'number') {
            char.damage = Math.round(char.damage * multiplier);
        }
        levelUps++;
    }
    return {
        character: char,
        levelUps: levelUps,
        message: levelUps > 0
            ? i18next.t('Level up message', {
                name: i18next.t(`${char.code}.name`, { defaultValue: char.name }),
                exp: expForOneChar,
                level: char.level,
                ups: levelUps,
                defaultValue: '{{name}}: +{{exp}} опыта, уровень повышен до {{level}} (+{{ups}})!'
            })
            : i18next.t('Exp gain message', {
                name: i18next.t(`${char.code}.name`, { defaultValue: char.name }),
                exp: expForOneChar,
                defaultValue: '{{name}}: +{{exp}} опыта'
            })
    };
}

function giveExpToMaterializedAllies() {
    if (!localStorage.getItem('currentLevel')) return;
    const rarityMap = {
        "Common": 2, "Uncommon": 4, "Rare": 6, "Superrare": 8,
        "Epic": 10, "Mythic": 15, "Legendary": 25
    };
    let expSum = selectedEnemies.reduce((sum, enemy) => sum + (rarityMap[enemy.rarity] || 1), 0);
    expSum *= 1 + selectedEnemies.length/20
    expSum = Math.ceil(expSum)
    let expForOneChar = expSum / selectedAllies.filter(ally => ally && ally.health > 0).length;
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    materializedCharacters = materializedCharacters.map(c => ({ ...c, id: String(c.id) }));
    selectedAllies = selectedAllies.map(a => a.isMaterialized && a.materializedId
        ? { ...a, materializedId: String(a.materializedId) }
        : a
    );
    selectedAllies.forEach(ally => {
        if (ally.isMaterialized && ally.materializedId && ally.health > 0) {
            const idx = materializedCharacters.findIndex(
                c => String(c.id) === String(ally.materializedId)
            );
            if (idx !== -1) {
                let char = materializedCharacters[idx];
                char.exp += expForOneChar;
                const result = checkAndUpdateLevel(char);
                materializedCharacters[idx] = result.character;
                expMessages.push(result.message);
            }
        }
    });
    localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    function getPlayerProfile() {
        return JSON.parse(localStorage.getItem('playerProfile')) || {
            nickname: "Player",
            avatar: "./images/avatar_default.png",
            level: 1,
            exp: 0,
            maxExp: 100
        };
    }
    function setPlayerProfile(profile) {
        localStorage.setItem('playerProfile', JSON.stringify(profile));
    }
    let profile = getPlayerProfile();
    let oldPlayerLevel = profile.level;
    profile.exp += expSum;
    let playerLevelUps = 0;
    while (profile.exp >= profile.maxExp) {
        profile.exp -= profile.maxExp;
        profile.level += 1;
        profile.maxExp = Math.round(profile.maxExp * 2 / 10) * 10;
        playerLevelUps++;
    }
    setPlayerProfile(profile);
    if (playerLevelUps > 0) {
        expPlayerMessages.push(
            i18next.t('Player level up', {
                defaultValue: `Вы повысили уровень игрока до ${profile.level} (+${playerLevelUps})!`,
                level: profile.level, ups: playerLevelUps
            })
        );
    }
    expPlayerMessages.unshift(
        i18next.t('Player exp gain', {
            defaultValue: `Игрок: +${expSum} опыта`,
            exp: expSum
        })
    );
    return expPlayerMessages;
}

// --- Проверка конца боя ---
function checkBattleEnd() {
    const aliveEnemies = selectedEnemies.filter(Boolean).filter(enemy => enemy.health > 0);
    const aliveAllies = selectedAllies.filter(Boolean).filter(ally => ally.health > 0);
    if (aliveEnemies.length === 0 && !rewardsGenerated) {
        battleEnded = true;
        showBattleResultModal('win')
        if (localStorage.getItem('currentLevel')) {
            const currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;

            expMessages = [];
            expPlayerMessages = [];
            giveExpToMaterializedAllies();
            const rewardConfig = getLevelRewards(currentLevel);
            const rewards = generateDrop(rewardConfig);
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
            if (currentLevel % 10 == 0 && !completedLevels.includes(currentLevel)) {
                rewards.push({ name: "Human Vessel", key: "human_vessel", rarity: "Epic", quantity: 1 })
            }
            if (!completedLevels.includes(currentLevel)) {

                const profile = JSON.parse(localStorage.getItem('playerProfile')) || {
                    nickname: "Игрок", avatar: "avatar_default.png", level: 1, exp: 0, maxExp: 100
                };
                profile.exp += 10;
                expPlayerMessages.push(
                    i18next.t('First time bonus', {
                        defaultValue: 'Бонус за первое прохождение уровня: +10 опыта'
                    })
                );
                localStorage.setItem('playerProfile', JSON.stringify(profile));
                let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
                selectedAllies.forEach(ally => {
                    if (ally.isMaterialized && ally.materializedId && ally.health > 0) {
                        const idx = materializedCharacters.findIndex(
                            c => String(c.id) === String(ally.materializedId)
                        );
                        if (idx !== -1) {
                            let char = materializedCharacters[idx];
                            char.exp += 10;
                            const result = checkAndUpdateLevel(char);
                            materializedCharacters[idx] = result.character;
                        }
                    }
                });
            completedLevels.push(currentLevel);    
            localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));   
        }
            showRewardsModal(rewards)
        }
        rewardsGenerated = true;

        return true;
    } else if (aliveAllies.length === 0) {
        battleEnded = true;
        showBattleResultModal('defeat');
        return true;
    }
    return false;
}

// --- Модальное окно результата ---
function showBattleResultModal(result) {
    const modal = document.getElementById('battleResultModal');
    const title = document.getElementById('battleResultTitle');
    const text = document.getElementById('battleResultText');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const toCharactersBtn = document.getElementById('toCharactersBtn');
    title.textContent = result === 'win'
        ? i18next.t('Victory', { defaultValue: 'Победа!' })
        : i18next.t('Defeat', { defaultValue: 'Поражение!' });
    text.textContent = result === 'win'
        ? i18next.t('You defeated all enemies!', { defaultValue: 'Вы победили всех врагов!' })
        : i18next.t('All your allies have fallen in battle.', { defaultValue: 'Все ваши союзники пали в бою.' });
    modal.style.display = 'flex';
    tryAgainBtn.textContent = i18next.t('Try Again', { defaultValue: 'Попробовать ещё раз' });
    toCharactersBtn.textContent = i18next.t('To Characters', { defaultValue: 'К персонажам' });
    tryAgainBtn.onclick = () => {
    if (selectedAllies.length === 0) return;
    selectedAllies.forEach(ally => { ally.health = ally.maxHealth || 100; });
    const currentLevel = parseInt(localStorage.getItem('currentLevel'));
    let selectedEnemiesFront = [];
    let selectedEnemiesBack = [];
    if (currentLevel) {
        const levelEnemies = campaignLevels[currentLevel - 1];
        if (levelEnemies) {
            const enemies = levelEnemies.map(enemyDef => {
                const enemyTemplate = characters.find(c => c.name === enemyDef.name);
                if (!enemyTemplate) return null;
                return { ...enemyTemplate };
            }).filter(Boolean);
            // Разделяем по типу урона
            selectedEnemiesFront = enemies.filter(e => e.damagetype === "Damage" || c.damagetype === "Penetrating Damage").slice(0, 5);
            selectedEnemiesBack = enemies.filter(e => e.damagetype !== "Damage" && c.damagetype !== "Penetrating Damage").slice(0, 5);
        }
    } else {
        // Рандомные враги
        const frontChars = characters.filter(c => c.damagetype === "Damage" || c.damagetype === "Penetrating Damage");
        const backChars = characters.filter(c => c.damagetype !== "Damage" && c.damagetype !== "Penetrating Damage");
        while (selectedEnemiesFront.length < 5 && frontChars.length > 0) {
            const idx = Math.floor(Math.random() * frontChars.length);
            selectedEnemiesFront.push({ ...frontChars[idx] });
        }
        while (selectedEnemiesBack.length < 5 && backChars.length > 0) {
            const idx = Math.floor(Math.random() * backChars.length);
            selectedEnemiesBack.push({ ...backChars[idx] });
        }
    }
    localStorage.setItem('selectedEnemiesFront', JSON.stringify(selectedEnemiesFront));
    localStorage.setItem('selectedEnemiesBack', JSON.stringify(selectedEnemiesBack));
    localStorage.setItem('selectedAllies', JSON.stringify(selectedAllies));
    window.location.href = 'index.html';
};
    toCharactersBtn.onclick = () => { window.location.href = 'characters.html'; };
}


setInterval(() => {
    const currentTurn = turnOrder[0];
    if (!selectedAllies.some((ally, i) => `${ally.name}-${i}` === currentTurn)) {
        processTurn();
    }
}, 1000);

function setTurnBlocker(active) {
    const blocker = document.getElementById('turn-blocker');
    if (!blocker || battleEnded) { blocker.style.display = 'none'; return }
    blocker.style.display = active ? 'block' : 'none';
}

setInterval(() => {
    currentTurnHero = turnOrder[0];
    // Показываем блокировку, если ход врага
    const [name, idx] = currentTurnHero.split('-');
    const attacker = fighters.find((c, i) => `${c.name}-${i}` === `${name}-${idx}`);
    setTurnBlocker(selectedEnemies.includes(attacker));
    updateDamageDisplay();
    updateDeadBlocks();
    cleanTurnOrder();
    updateTurnOrderDisplay();
    highlightCurrentTurnCharacter();
    updateAllEnemyPreviews()
    applyBackRowDefenseBonus();
    selectedAllies = [...selectedAlliesFront2, ...selectedAlliesBack2].filter(Boolean);
    selectedEnemies = [...selectedEnemiesFront2, ...selectedEnemiesBack2].filter(Boolean);
    
    if (checkBattleEnd()) return;
}, 50);

function processTurn() {
    const currentTurn = turnOrder.shift();
    turnOrder.push(currentTurn);
    if (currentTurn.includes('-')) {
        const [name, index] = currentTurn.split('-');
        const attacker = fighters.find((c, i) => `${c.name}-${i}` === `${name}-${index}`);
        if (!attacker || attacker.health <= 0) return;

        // Проверяем, враг ли это (есть ли он в selectedEnemies)
        if (selectedEnemies.includes(attacker)) {
            enemyAttack(currentTurn);
        }
        else {
            const characterInfoPanel = document.getElementById('character-info-panel');
            characterInfoPanel.style.display = 'none';
        }
        // Если союзник — атака по врагу происходит по клику, ничего не делаем
    }
    applyBackRowDefenseBonus();
    // updateFronts(selectedAlliesFront2, selectedAlliesBack2);
    // updateFronts(selectedEnemiesFront2, selectedEnemiesBack2);
    // initializeBattle(); // <--- ДОБАВИТЬ ЭТУ СТРОКУ

}

viewCharacters.addEventListener('click', () => {
    returnCharactersToInventory();
    localStorage.removeItem('selectedAllies');
    localStorage.removeItem('selectedEnemies');
    selectedAllies = [];
    selectedEnemies = [];
});

window.addEventListener('DOMContentLoaded', () => {
    i18next.on('initialized', function() {
        const currentLevelIndex = parseInt(JSON.parse(localStorage.getItem('currentLevel'))) - 1;
        const levelNameStr = i18next.t(`levelName.${currentLevelIndex}`);
        document.getElementById('levelName').innerText = levelNameStr;
    });
});

function applyBackRowDefenseBonus() {
    // Для союзников
    const frontAlive = selectedAlliesFront2.some(c => c && c.health > 0);
    selectedAlliesBack2.forEach(char => {
        if (!char) return;
        if (frontAlive) {
            if (!char._backDefenseBonusApplied) {
                char.defense = (char.defense || 0) + 15;
                char._backDefenseBonusApplied = true;
            }
        } else {
            if (char._backDefenseBonusApplied) {
                char.defense = (char.defense || 0) - 15;
                char._backDefenseBonusApplied = false;
            }
        }
    });

    // Для врагов (если нужно)
    const enemyFrontAlive = selectedEnemiesFront2.some(c => c && c.health > 0);
    selectedEnemiesBack2.forEach(char => {
        if (!char) return;
        if (enemyFrontAlive) {
            if (!char._backDefenseBonusApplied) {
                char.defense = (char.defense || 0) + 15;
                char._backDefenseBonusApplied = true;
            }
        } else {
            if (char._backDefenseBonusApplied) {
                char.defense = (char.defense || 0) - 15;
                char._backDefenseBonusApplied = false;
            }
        }
    });
}

function clearAllDamagePreviews() {
    document.querySelectorAll('.hp-bar-preview').forEach(preview => {
        preview.style.display = 'none';
        preview.style.background = '';
    });
    document.querySelectorAll('.dmg-preview').forEach(dmg => dmg.remove());
}

function updateAllEnemyPreviews() {
    // Для всех врагов, на которых сейчас есть .hp-bar-preview:visible
    document.querySelectorAll('.enemy-block').forEach(div => {
        const hpBarPreview = div.querySelector('.hp-bar-preview');
        if (hpBarPreview && hpBarPreview.style.display === 'block') {
            // Повторяем логику onmouseenter для врага
            const charName = div.getAttribute('data-char');
            const idx = parseInt(charName.split('-')[1]);
            const row = charName.split('-')[2];
            let char = null;
            if (row === 'front') char = selectedEnemiesFront2[idx];
            else if (row === 'back') char = selectedEnemiesBack2[idx];
            if (!char) return;

            const [curName, curIdx] = currentTurnHero.split('-');
            const curChar = fighters.find((c, i) => `${c.name}-${i}` === `${curName}-${curIdx}`);
            if (!curChar) return;
            if (!selectedAllies.includes(curChar)) return;

            const potentialDamage = calculateDamage(curChar, char);
            const currentPercent = Math.max(0, Math.min(1, char.health / char.maxHealth));
            const newHealth = Math.max(0, char.health - potentialDamage);
            const newPercent = Math.max(0, Math.min(1, newHealth / char.maxHealth));
            hpBarPreview.style.background = `linear-gradient(
                to right,
                #e74c3c 0%,
                #e74c3c ${newPercent * 100}%,
                #888 ${newPercent * 100}%,
                #888 ${currentPercent * 100}%,
                transparent ${currentPercent * 100}%,
                transparent 100%
            )`;

            // Обновить число урона
            let dmgPreview = div.querySelector('.dmg-preview');
            if (dmgPreview) {
                dmgPreview.textContent = `-${potentialDamage}`;
            }
        }
    });
}