// --- Переменные состояния ---
let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
let selectedAlliesFront = Array(5).fill(null);
let selectedAlliesBack = Array(5).fill(null);
let selectedEnemiesFront = Array(5).fill(null);
let selectedEnemiesBack = Array(5).fill(null);
let isSelectingAllies2 = true;
let isSelectingFront = true; // Новая переменная: true — фронт, false — тыл
let activeRarities = [];

// --- DOM элементы ---
const list = document.getElementById('characters-list');
const alliesList = document.getElementById('allies-list');
const enemiesList = document.getElementById('enemies-list');
const clearButton = document.getElementById('clear-button');
const randomFightButton = document.getElementById('random-fight-button');
const rarityFiltersDiv = document.getElementById('rarity-filters');
const filterButtons = rarityFiltersDiv.querySelectorAll('.rarity-filter-btn');
const inventoryGrid = document.getElementById('inventory-grid');
const craftingList = document.getElementById('crafting-list');
const recipeItems = document.getElementById('recipe-items');
const craftingError = document.getElementById('crafting-error');
const craftButton = document.getElementById('craft-button');
const craftingModal = document.getElementById('crafting-modal');
const craftedCharacterName = document.getElementById('crafted-character-name');
const closeModalButton = document.getElementById('close-modal-button');
const itemCraftingList = document.getElementById('item-crafting-list');
const itemRecipeItems = document.getElementById('item-recipe-items');
const itemCraftingError = document.getElementById('item-crafting-error');
const itemCraftButton = document.getElementById('item-craft-button');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const toggleCraftingHeroes = document.getElementById('toggle-crafting-heroes');
const toggleCraftingItems = document.getElementById('toggle-crafting-items');
const craftingHeroesSection = document.getElementById('crafting-heroes');
const craftingItemsSection = document.getElementById('crafting-items');
const playerPanel = document.getElementById('player-panel');
const profileModal = document.getElementById('profile-modal');
const profileAvatar = document.getElementById('profile-avatar');
const closeProfileModal = document.getElementById('close-profile-modal');
const saveSquadBtn = document.getElementById('save-squad-btn');
const campaignButton = document.getElementById('campaign-button');
const closeCampaignModal = document.getElementById('close-campaign-modal');
const sortSelect = document.getElementById('sort-characters');
const characterInfoPanel = document.getElementById('character-info-panel');
const bottomPanel = document.getElementById('bottom-panel');
const toggleBottomPanelBtn = document.getElementById('toggle-bottom-panel-btn');
const toggleBottomPanelIcon = document.getElementById('toggle-bottom-panel-icon');

let bottomPanelCollapsed = false;

(function giveStarterPeasants() {
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    if (!materializedCharacters.length) {
        const baseChar = characters.find(c => c.name === "Peasant" || c.name === "Крестьянин");
        if (baseChar) {
            for (let i = 0; i < 3; i++) {
                const level = 1;
                const maxHealth = Math.round((baseChar.maxHealth || baseChar.health || 100) * Math.pow(1.1, level - 1));
                const health = maxHealth;
                const damage = typeof baseChar.damage === 'number'
                    ? Math.round(baseChar.damage * Math.pow(1.1, level - 1))
                    : baseChar.damage;
                const newChar = {
                    ...baseChar,
                    id: Date.now() + Math.random() + i,
                    level,
                    exp: 0,
                    maxExp: 100,
                    maxHealth,
                    health,
                    damage
                };
                materializedCharacters.push(newChar);
            }
            localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
        }
    }
})();

toggleBottomPanelBtn.addEventListener('click', () => {
    bottomPanelCollapsed = !bottomPanelCollapsed;
    bottomPanel.classList.toggle('collapsed', bottomPanelCollapsed);

    // Меняем иконку (стрелка вниз/вверх)
    toggleBottomPanelIcon.innerHTML = bottomPanelCollapsed
        ? `<polyline points="6,18 14,10 22,18" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<polyline points="6,10 14,18 22,10" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
});

let currentSort = 'rarity';

sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    updateCharactersList();
});

// --- Вспомогательные функции ---

function getPlayerProfile() { return JSON.parse(localStorage.getItem('playerProfile')) || { ...defaultProfile }; }
function setPlayerProfile(profile) { localStorage.setItem('playerProfile', JSON.stringify(profile)); }

function saveSelectedCharacters() {
    localStorage.setItem('selectedAlliesFront', JSON.stringify(selectedAlliesFront));
    localStorage.setItem('selectedAlliesBack', JSON.stringify(selectedAlliesBack));
    localStorage.setItem('selectedEnemiesFront', JSON.stringify(selectedEnemiesFront.filter(Boolean)));
    localStorage.setItem('selectedEnemiesBack', JSON.stringify(selectedEnemiesBack.filter(Boolean)));
}

function clearSelectedCharacters() {
    selectedAlliesFront = Array(5).fill(null);
    selectedAlliesBack = Array(5).fill(null);
}
function updatePlayerPanel() {
    const profile = getPlayerProfile();
    document.getElementById('player-avatar').src = profile.avatar;
    document.getElementById('player-nickname').textContent = profile.nickname;
    document.getElementById('player-level-number').textContent = `${profile.level}`;
}

function addItemToInventory(name, rarity, quantity = 1, type = 'item') {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const existingItem = inventory.find(item => item.name === name && item.rarity === rarity && item.type === type);
    if (existingItem) existingItem.quantity += quantity;
    else if (inventory.length < 80) inventory.push({ name, rarity, quantity, type });
    else return;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory();
    updateCharactersList();
}
window.addItemToInventory = addItemToInventory;

// --- Инвентарь ---
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.sort((a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity));
    inventoryGrid.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const cell = document.createElement('div');
        cell.classList.add('inventory-cell');
        if (i < inventory.length) {
            const item = inventory[i];
            cell.style.backgroundColor = rarityColors[item.rarity] || '#fff';
            // Получаем ключ для перевода
            const itemKey = itemNameToKey[item.name];
            const itemName = itemKey ? i18next.t(`items.${itemKey}`) : item.name;
            cell.innerHTML = `<div class="item-name">${itemName}</div><div class="item-quantity">${item.quantity}</div>`;
        } else cell.style.backgroundColor = '#f0f0f0';
        inventoryGrid.appendChild(cell);
    }
}

function addCharacterToFirstFreeSlot(character, selectionFront, selectionBack) {
    let arr = selectionFront.length < 5 ? selectionFront : selectionBack;
    if (arr.length < 5) {
        arr.push(character);
        saveSelectedCharacters();
        renderAllGrids();
        updateCharactersList();
        return true;
    }
    return false;
}

// --- Списки выбора союзников и врагов ---
function updateSelection(listElement, selectionArray, className) {
    listElement.innerHTML = '';
    selectionArray.forEach((character, index) => {
        if (!character) return; // пропускаем пустые ячейки
        const listItem = document.createElement('li');
        listItem.textContent = `${character.name} (${index + 1})`;
        listItem.classList.add(className);
        listItem.addEventListener('click', () => {
            // Удаляем персонажа из сетки
            selectionArray[index] = null;
            saveSelectedCharacters();
            renderAllGrids();
            updateCharactersList();
        });
        listElement.appendChild(listItem);
    });
}

// --- Кнопки и фильтры ---
clearButton.addEventListener('click', () => {
    selectedAlliesFront = Array(5).fill(null);
    selectedAlliesBack = Array(5).fill(null);
    renderAlliesGrids();
    updateCharactersList();
});

    toggleCraftingHeroes.addEventListener('click', () => {
        toggleCraftingHeroes.classList.add('active');
        toggleCraftingItems.classList.remove('active');
        craftingHeroesSection.style.display = 'block';
        craftingItemsSection.style.display = 'none';
    });

    toggleCraftingItems.addEventListener('click', () => {
        toggleCraftingItems.classList.add('active');
        toggleCraftingHeroes.classList.remove('active');
        craftingHeroesSection.style.display = 'none';
        craftingItemsSection.style.display = 'block';
    });

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const rarity = btn.getAttribute('data-rarity');
        if (activeRarities.includes(rarity)) {
            activeRarities = activeRarities.filter(r => r !== rarity);
            btn.classList.remove('active');
        } else {
            activeRarities.push(rarity);
            btn.classList.add('active');
        }
        updateCharactersList();
    });
});

// --- Список персонажей для выбора ---
function updateCharactersList() {
    list.innerHTML = '';
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
        materializedCharacters = materializedCharacters.map(char =>
            char.code === "Balanced" ? { ...char, code: "Peasant" } : char
        );
localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    let chars = [...materializedCharacters];
    if (currentSort === 'rarity') {
        chars.sort((a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity));
    } else if (currentSort === 'level') {
        chars.sort((a, b) => (b.level || 1) - (a.level || 1));
    } else if (currentSort === 'name') {
        chars.sort((a, b) => i18next.t(`${a.code}.name`).localeCompare(i18next.t(`${b.code}.name`)));
    } else if (currentSort === 'speed') {
        chars.sort((a, b) => (b.speed || 0) - (a.speed || 0));
    }
    const selectedIds = selectedAlliesFront.concat(selectedAlliesBack)
        .filter(Boolean)
        .map(c => c.isMaterialized ? String(c.materializedId) : c.id);

    chars
        .filter(char =>
            (activeRarities.length === 0 || activeRarities.includes(char.rarity)) &&
            !selectedIds.includes(String(char.id))
        )
        .forEach(char => {
            const listItem = document.createElement('li');
            listItem.classList.add(getRarityClass(char.rarity), 'materialized-character-list');
            listItem.innerHTML = `
                <span style="font-weight:bold; display:flex; justify-content:center; font-size:14px; text-align: center;">${i18next.t(`${char.code}.name`)}</span>
                <strong>${i18next.t('Level')}:</strong> ${char.level} <br>
                <strong>${i18next.t('Experience')}:</strong> ${Math.floor(char.exp)}/${char.maxExp} <br>
                <strong>${i18next.t('Rarity')}:</strong> <span style="font-weight:bold">${i18next.t(`${char.code}.rarity`)}</span><br>
                <strong>${i18next.t('Health')}:</strong> ${char.health}<br>
                <strong>${i18next.t('Defense') || 'Defense'}:</strong> ${char.defense}%<br>
                <strong>${i18next.t(`${char.code}.damagetype`)}:</strong> ${typeof char.damage === 'function' 
                    ? Math.round(char.damage.call(char)) 
                    : char.damage}<br>
                <strong>${i18next.t('Speed') || 'Speed'}:</strong> ${char.speed}<br>
                <strong>${i18next.t('Ability')}:</strong> ${i18next.t(`${char.code}.ability`)}<br>
            `;
            listItem.draggable = true;
            listItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(char));
            });
            listItem.addEventListener('click', () => {
                let gridArr = isSelectingFront ? selectedAlliesFront : selectedAlliesBack;
                let idx = gridArr.findIndex(cell => cell === null);
                if (idx !== -1) {
                    gridArr[idx] = { ...char, isMaterialized: true, materializedId: String(char.id) };
                    saveSelectedCharacters();
                    renderAlliesGrids();
                    updateCharactersList();
                }
            });
                listItem.onmouseenter = () => {
                characterInfoPanel.style.display = 'flex';
                characterInfoPanel.innerHTML = `
                    <h3 style="margin-top:0; text-align:center">${i18next.t(`${char.code}.name`, { defaultValue: char.name })}</h3>
                    <div><b>${i18next.t('Rarity', { defaultValue: 'Редкость' })}:</b> ${i18next.t(`${char.code}.rarity`, { defaultValue: char.rarity })}</div>
                    <div><b>${i18next.t('Level', { defaultValue: 'Уровень' })}:</b> ${char.level || 1}</div>
                    <div><b>${i18next.t('Experience', { defaultValue: 'Опыт' })}:</b> ${Math.floor(char.exp)}/${char.maxExp || 100}</div>
                    <div><b>${i18next.t('Health', { defaultValue: 'Здоровье' })}:</b> ${char.maxHealth || char.health}</div>
                    <div><b>${i18next.t('Defense', { defaultValue: 'Защита' })}:</b> ${char.defense || 0}</div>
                    <div><b>${i18next.t('Damage', { defaultValue: 'Урон' })}:</b> ${typeof char.damage === 'function' ? i18next.t('Special formula', { defaultValue: 'Спец. формула' }) : char.damage}</div>
                    <div><b>${i18next.t('Speed', { defaultValue: 'Скорость' })}:</b> ${char.speed || 0}</div>
                    <div><b>${i18next.t('DamageType', { defaultValue: 'Тип урона' })}:</b> ${i18next.t(`${char.code}.damagetype`, { defaultValue: char.damagetype || '-' })}</div> <br>
                    <div><i>${i18next.t(`${char.code}.description`, { defaultValue: char.description || '-' })}</i></div> <br>
                    <div><b>${i18next.t('Ability', { defaultValue: 'Способность' })}:</b> ${i18next.t(`${char.code}.ability`, { defaultValue: char.ability || '-' })}</div>
                `;
            };
                listItem.onmouseleave = () => {
                    characterInfoPanel.style.display = 'none';
                };
                list.appendChild(listItem);
            });
}

// --- Кнопки битвы ---

randomFightButton.addEventListener('click', () => {
    const alliesCount = [...selectedAlliesFront, ...selectedAlliesBack].filter(Boolean).length;
    if (alliesCount === 0) return;

    // Фильтруем персонажей по типу урона
    const frontChars = characters.filter(c => c.damagetype === "Damage" || c.damagetype === "Penetrating Damage");
    const backChars = characters.filter(c => c.damagetype !== "Damage" && c.damagetype !== "Penetrating Damage");

    // Заполняем фронт (только "Урон")
    const randomEnemiesFront = [];
    while (randomEnemiesFront.length < 5 && frontChars.length > 0) {
        const idx = Math.floor(Math.random() * frontChars.length);
        randomEnemiesFront.push({ ...frontChars[idx] });
    }
    // Если вдруг не хватает, добираем из backChars (но это маловероятно)
    while (randomEnemiesFront.length < 5 && backChars.length > 0) {
        const idx = Math.floor(Math.random() * backChars.length);
        randomEnemiesFront.push({ ...backChars[idx] });
    }

    // Заполняем тыл (все, кроме "Урон")
    const randomEnemiesBack = [];
    while (randomEnemiesBack.length < 5 && backChars.length > 0) {
        const idx = Math.floor(Math.random() * backChars.length);
        randomEnemiesBack.push({ ...backChars[idx] });
    }
    // Если вдруг не хватает, добираем из frontChars
    while (randomEnemiesBack.length < 5 && frontChars.length > 0) {
        const idx = Math.floor(Math.random() * frontChars.length);
        randomEnemiesBack.push({ ...frontChars[idx] });
    }

    localStorage.setItem('selectedEnemiesFront', JSON.stringify(randomEnemiesFront));
    localStorage.setItem('selectedEnemiesBack', JSON.stringify(randomEnemiesBack));
    localStorage.setItem('selectedAlliesFront', JSON.stringify(selectedAlliesFront));
    localStorage.setItem('selectedAlliesBack', JSON.stringify(selectedAlliesBack));
    window.location.href = 'index.html';
});

setInterval(() => {
    const alliesCount = [...selectedAlliesFront, ...selectedAlliesBack].filter(Boolean).length;
    randomFightButton.disabled = alliesCount === 0;
}, 50);

// --- Фильтры и вкладки ---
function renderCharactersList() { updateCharactersList(); }
filterButtons.forEach(btn => btn.addEventListener('click', renderCharactersList));
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        if (!tabId) return;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        const activeTab = document.getElementById(tabId);
        if (activeTab) activeTab.classList.add('active');
    });
});

// --- Крафт персонажей ---
function renderCraftingList() {
    craftingList.innerHTML = '';
    allCharacters
        .filter(character => character.canBeCrafted)
        .forEach(character => {
            const listItem = document.createElement('div');
            listItem.classList.add('crafting-item', rarityColors2[character.rarity]);
            const charName = i18next.t(`${character.code}.name`);
            const charRarity = i18next.t(`${character.code}.rarity`);
            listItem.textContent = `${charName} (${charRarity})`;
            listItem.addEventListener('click', () => {
                document.querySelectorAll('.crafting-item').forEach(item => item.classList.remove('selected'));
                listItem.classList.add('selected');
                if (craftingRecipes[character.name]) selectCharacterForCrafting(character.name);
            });
            craftingList.appendChild(listItem);
        });
}

function selectCharacterForCrafting(characterName) {
    const recipe = craftingRecipes[characterName];
    recipeItems.innerHTML = '';
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    recipe.forEach(item => {
        const itemData = items.find(i => i.name === item.name);
        const itemKey = itemData ? itemData.key : null;
        const itemName = itemKey ? i18next.t(`items.${itemKey}`, { defaultValue: item.name }) : item.name;
        const rarity = itemData ? itemData.rarity : item.rarity;
        const inventoryItem = inventory.find(i => i.name === item.name && i.rarity === rarity);
        const currentQuantity = inventoryItem ? inventoryItem.quantity : 0;
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');
        recipeItem.innerHTML = `
            <div class="item-icon" style="background-color: ${rarityColors[rarity]}; width: 30px; height: 30px; border-radius: 5px;"></div>
            <span>x${item.quantity} ${itemName} (${currentQuantity}/${item.quantity})</span>
        `;
        recipeItems.appendChild(recipeItem);
    });
    const canCraft = recipe.every(item => {
        const itemData = items.find(i => i.name === item.name);
        const rarity = itemData ? itemData.rarity : item.rarity;
        const inventoryItem = inventory.find(i => i.name === item.name && i.rarity === rarity);
        return inventoryItem && inventoryItem.quantity >= item.quantity;
    });
    craftingError.style.display = canCraft ? 'none' : 'block';
    craftButton.disabled = !canCraft;
    craftButton.onclick = () => craftCharacter(characterName, recipe);
}

function craftCharacter(characterName, recipe) {
    // Списываем ресурсы
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    recipe.forEach(item => {
        const itemData = items.find(i => i.name === item.name);
        const rarity = itemData ? itemData.rarity : item.rarity;
        const invItem = inventory.find(i => i.name === item.name && i.rarity === rarity);
        if (invItem) invItem.quantity -= item.quantity;
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Добавляем персонажа в материализованные
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    // Берём базу из characters, а не allCharacters!
    const baseChar = characters.find(c => c.name === characterName);
    if (baseChar) {
        const level = 1;
        const maxHealth = Math.round((baseChar.maxHealth || baseChar.health || 100) * Math.pow(1.1, level - 1));
        const health = maxHealth;
        const damage = typeof baseChar.damage === 'number'
            ? Math.round(baseChar.damage * Math.pow(1.1, level - 1))
            : baseChar.damage;
        const newChar = {
            ...baseChar,
            id: Date.now() + Math.random(),
            level,
            exp: 0,
            maxExp: 100,
            maxHealth,
            health,
            damage
        };
        materializedCharacters.push(newChar);
        localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
        // Мультиязычный вывод имени персонажа
        const craftedName = i18next.t(`${baseChar.code}.name`, { defaultValue: baseChar.name });
        // Показываем модальное окно вместо alert
        document.getElementById('crafted-character-name').textContent = `${craftedName} ${i18next.t('crafted', { defaultValue: 'создан!' })}`;
        document.getElementById('crafting-modal').style.display = 'flex';
    }
    renderCraftingList();
    renderMaterializedCharacters();
    updateCharactersList();
    loadInventory();
    selectCharacterForCrafting(characterName)
}

closeModalButton.addEventListener('click', () => { craftingModal.style.display = 'none'; });

// --- Крафт предметов ---
function renderItemCraftingList() {
    itemCraftingList.innerHTML = '';
    Object.keys(sortedItemCraftingRecipes).forEach(itemName => {
        const itemData = items.find(item => item.name.toLowerCase().trim() === itemName.toLowerCase().trim());
        const itemKey = itemData ? itemData.key : null;
        const rarity = itemData ? itemData.rarity : 'Обычный';
        const displayName = itemKey ? i18next.t(`items.${itemKey}`, { defaultValue: itemName }) : itemName;

        const listItem = document.createElement('div');
        listItem.classList.add('crafting-item', rarityColors2[rarity]);
        listItem.textContent = displayName;

        listItem.addEventListener('click', () => {
            document.querySelectorAll('.crafting-item').forEach(item => item.classList.remove('selected'));
            listItem.classList.add('selected');
            selectItemForCrafting(itemName);
        });

        itemCraftingList.appendChild(listItem);
    });
}
    
function selectItemForCrafting(itemName) {
    const recipe = itemCraftingRecipes[itemName];
    if (!recipe) return;
    itemRecipeItems.innerHTML = '';
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    recipe.forEach(item => {
        const itemData = items.find(i => i.name === item.name);
        const itemKey = itemData ? itemData.key : null;
        const displayName = itemKey ? i18next.t(`items.${itemKey}`, { defaultValue: item.name }) : item.name;
        const rarity = itemData ? itemData.rarity : "Common";
        const inventoryItem = inventory.find(i => i.name === item.name && i.rarity === rarity);
        const currentQuantity = inventoryItem ? inventoryItem.quantity : 0;
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');
        recipeItem.innerHTML = `
            <div class="item-icon" style="background-color: ${rarityColors[rarity]}; width: 30px; height: 30px; border-radius: 5px;"></div>
            <span>x${item.quantity} ${displayName} (${currentQuantity}/${item.quantity})</span>
        `;
        itemRecipeItems.appendChild(recipeItem);
    });
    const canCraft = recipe.every(item => {
        const itemData = items.find(i => i.name === item.name);
        const rarity = itemData ? itemData.rarity : "Common";
        const inventoryItem = inventory.find(i => i.name === item.name && i.rarity === rarity);
        return inventoryItem && inventoryItem.quantity >= item.quantity;
    });
    itemCraftingError.style.display = canCraft ? 'none' : 'block';
    itemCraftButton.disabled = !canCraft;
    itemCraftButton.onclick = () => {
        craftItem(itemName, recipe);
        selectItemForCrafting(itemName);
    };
}

function craftItem(itemName, recipe) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    recipe.forEach(item => {
        const inventoryItem = inventory.find(i => i.name === item.name && i.rarity === item.rarity);
        if (inventoryItem) inventoryItem.quantity -= item.quantity;
    });
    const itemData = items.find(i => i.name === itemName);
    const rarity = itemData ? itemData.rarity : "Common";
    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory();
    addItemToInventory(itemName, rarity, 1, "item");
    renderItemCraftingList();
}

function renderMaterializedCharacters() {
    const container = document.getElementById('materialized-characters-list');
    if (!container) return;
    materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    container.innerHTML = '';
    materializedCharacters.forEach((char, idx) => {
        const div = document.createElement('div');
        div.className = 'materialized-character';
        div.style.background = rarityColors[char.rarity] || '#fff';
        div.style.margin = '4px';
        div.style.padding = '4px';
        div.innerHTML = `
            <b>${i18next.t(`${char.code}.name`)}</b> (${i18next.t(`${char.code}.rarity`)}, ${i18next.t(`${char.code}.damagetype`)})<br>
            ${i18next.t('Level')}: ${char.level}<br>
            ${i18next.t('Health')}: ${char.health}<br>
            ${i18next.t('Experience')}: ${Math.floor(char.exp)}/${char.maxExp}<br>
            <span style="font-size:0.95em;color:#444;">${i18next.t(`${char.code}.description`)}</span><br>
            <span style="font-size:0.95em;color:#444;"><b>${i18next.t('Ability')}:</b> ${i18next.t(`${char.code}.ability`)}</span>
            <button data-idx="${idx}" class="add-to-allies-btn">${i18next.t('To Characters') || 'To Squad'}</button>
        `;
        container.appendChild(div);
    });
    container.querySelectorAll('.add-to-allies-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = +btn.dataset.idx;
            addCharacterToFirstFreeSlot(
                { ...materializedCharacters[idx], isMaterialized: true, materializedId: materializedCharacters[idx].id },
                selectedAlliesFront,
                selectedAlliesBack
            );
        };
    });
}

// --- Сохранение и восстановление отряда ---
function loadSavedSquad() {
    const savedFront = JSON.parse(localStorage.getItem('selectedAlliesFront')) || Array(5).fill(null);
    const savedBack = JSON.parse(localStorage.getItem('selectedAlliesBack')) || Array(5).fill(null);
    selectedAlliesFront = savedFront;
    selectedAlliesBack = savedBack;
    renderAlliesGrids();
    updateCharactersList();
}

function renderSavedSquad() {
    const front = JSON.parse(localStorage.getItem('selectedAlliesFront')) || [];
    const back = JSON.parse(localStorage.getItem('selectedAlliesBack')) || [];
    const container = document.getElementById('saved-squad-list');
    container.innerHTML = '';

    // Фронт
    const frontDiv = document.createElement('div');
    frontDiv.style.marginBottom = '8px';
    front.forEach(char => {
        if (!char) return;
        const div = document.createElement('div');
        div.style.background = '#f3f3f3';
        div.style.borderRadius = '8px';
        div.style.width = '120px';
        div.style.padding = '4px 8px';
        div.style.display = 'inline-block';
        div.style.margin = '2px';
        div.innerHTML = `<span style="font-weight:bold;">${i18next.t(`${char.code}.name`)}</span> <br> <span style="font-size:0.9em;">${i18next.t('Level')}: ${char.level}</span>`;
        frontDiv.appendChild(div);
    });
    container.appendChild(frontDiv);

    // Тыл
    const backDiv = document.createElement('div');
    back.forEach(char => {
        if (!char) return;
        const div = document.createElement('div');
        div.style.background = '#f3f3f3';
        div.style.borderRadius = '8px';
        div.style.width = '120px';
        div.style.padding = '4px 8px';
        div.style.display = 'inline-block';
        div.style.margin = '2px';
        div.innerHTML = `<span style="font-weight:bold;">${i18next.t(`${char.code}.name`)}</span> <br> <span style="font-size:0.9em;">${i18next.t('Level')}: ${char.level}</span>`;
        backDiv.appendChild(div);
    });
    container.appendChild(backDiv);
}

// --- Профиль игрока ---
function addPlayerExp(amount) {
    let profile = getPlayerProfile();
    profile.exp += amount;
    let leveledUp = false;
    while (profile.exp >= profile.maxExp) {
        profile.exp -= profile.maxExp;
        profile.level += 1;
        profile.maxExp = Math.round(profile.maxExp * 2 / 10) * 10;
        leveledUp = true;
    }
    setPlayerProfile(profile);
    updatePlayerPanel();
    return leveledUp;
}
playerPanel.onclick = () => {
    const profile = getPlayerProfile();
    document.getElementById('profile-avatar').src = profile.avatar;
    document.getElementById('profile-nickname').textContent = profile.nickname;
    document.getElementById('profile-level').textContent = profile.level;
    document.getElementById('profile-exp-label').textContent = `${i18next.t('Experience', { defaultValue: 'Опыт' })}: ${profile.exp}/${profile.maxExp}`;
    document.getElementById('profile-exp-bar').style.width = `${Math.min(100, 100 * profile.exp / profile.maxExp)}%`;
    document.getElementById('nickname-input').style.display = 'none';
    document.getElementById('profile-nickname').style.display = '';
    renderSavedSquad();
    profileModal.style.display = 'flex';
};
closeProfileModal.onclick = () => profileModal.style.display = 'none';
profileAvatar.onmouseenter = () => profileAvatar.style.filter = 'grayscale(0.5)';
profileAvatar.onmouseleave = () => profileAvatar.style.filter = '';
profileAvatar.onclick = () => document.getElementById('avatar-input').click();
document.getElementById('avatar-input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        const profile = getPlayerProfile();
        profile.avatar = evt.target.result;
        setPlayerProfile(profile);
        updatePlayerPanel();
        profileAvatar.src = profile.avatar;
    };
    reader.readAsDataURL(file);
};
document.getElementById('profile-edit-nickname').onclick = () => {
    document.getElementById('profile-nickname').style.display = 'none';
    const input = document.getElementById('nickname-input');
    input.value = getPlayerProfile().nickname;
    input.style.display = '';
    input.focus();
};
document.getElementById('nickname-input').onblur = function() {
    const val = this.value.trim() || "Player";
    const profile = getPlayerProfile();
    profile.nickname = val;
    setPlayerProfile(profile);
    updatePlayerPanel();
    document.getElementById('profile-nickname').textContent = val;
    this.style.display = 'none';
    document.getElementById('profile-nickname').style.display = '';
};
document.getElementById('nickname-input').onkeydown = function(e) {
    if (e.key === 'Enter') this.blur();
};
saveSquadBtn.addEventListener('click', function() {
    localStorage.setItem('selectedAlliesFront', JSON.stringify(selectedAlliesFront))
    localStorage.setItem('selectedAlliesBack', JSON.stringify(selectedAlliesBack))
    loadSavedSquad();
});

// --- Кампания ---
campaignButton.onclick = function() {
    const modal = document.getElementById('campaign-modal');
    for (let j = 0; j < 5; j++) {
        const location = document.getElementsByClassName('campaign-levels')[j];
        location.innerHTML = '';
    }
    // Получаем список завершённых уровней
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    // Определяем максимальный открытый уровень (по умолчанию 1)
    let maxUnlocked = 1;
    for (let lvl = 1; lvl <= 100; lvl++) {
        if (completedLevels.includes(lvl)) {
            maxUnlocked = lvl + 1;
        }
    }

    for (let j = 0; j < 5; j++) {
        const location = document.getElementsByClassName('campaign-levels')[j];
        for (let i = 0; i < 20; i++) {
            const btn = document.createElement('button');
            const levelNum = j * 20 + i + 1;
            btn.textContent = `${i18next.t('Level', { defaultValue: 'Уровень' })} ${levelNum}`;
            btn.classList.add('level');
            // Разрешаем только если уровень <= maxUnlocked и уровень существует в campaignLevels
            btn.disabled = !(campaignLevels[j * 20 + i] && levelNum <= maxUnlocked);
            if (completedLevels.includes(levelNum)) btn.classList.add('completed-level');
            btn.onclick = () => {
                startCampaignBattle(j * 20 + i);
                modal.style.display = 'none';
            };
            location.appendChild(btn);
        }
    }
    modal.style.display = 'flex';
};

closeCampaignModal.onclick = function() {
    document.getElementById('campaign-modal').style.display = 'none';
};
function chooseLocation(x) {
    for (let j = 0; j < 5; j++) {
        const location = document.getElementsByClassName('campaign-levels')[j];
        location.style.display = 'none';
    }
    document.getElementsByClassName('campaign-levels')[x].style.display = 'grid';
}
document.getElementsByClassName('location-choose')[0].onclick = function() { chooseLocation(0); }
document.getElementsByClassName('location-choose')[1].onclick = function() { chooseLocation(1); }
document.getElementsByClassName('location-choose')[2].onclick = function() { chooseLocation(2); }
document.getElementsByClassName('location-choose')[3].onclick = function() { chooseLocation(3); }
document.getElementsByClassName('location-choose')[4].onclick = function() { chooseLocation(4); }

function startCampaignBattle(levelIdx) {
    const level = campaignLevels[levelIdx];
    localStorage.setItem('currentLevel', levelIdx + 1);

    let enemiesFront = [], enemiesBack = [];
    if (Array.isArray(level)) {
        // Старый формат — всё в передний фронт
        enemiesFront = level.map(enemyDef => createEnemyFromDef(enemyDef)).filter(Boolean);
    } else {
        enemiesFront = (level.front || []).map(enemyDef => createEnemyFromDef(enemyDef)).filter(Boolean);
        enemiesBack = (level.back || []).map(enemyDef => createEnemyFromDef(enemyDef)).filter(Boolean);
    }
    localStorage.setItem('selectedEnemiesFront', JSON.stringify(enemiesFront));
    localStorage.setItem('selectedEnemiesBack', JSON.stringify(enemiesBack));
    localStorage.setItem('selectedAlliesFront', JSON.stringify(selectedAlliesFront));
    localStorage.setItem('selectedAlliesBack', JSON.stringify(selectedAlliesBack));
    window.location.href = 'index.html';
}
function createEnemyFromDef(enemyDef) {
    const base = characters.find(c => c.name === enemyDef.name);
    if (!base) return null;
    let enemy = { ...base };
    const lvl = enemyDef.level || 1;
    enemy.level = lvl;
    enemy.maxHealth = Math.round((base.maxHealth || base.health || 100) * Math.pow(1.1, lvl - 1));
    enemy.health = enemy.maxHealth;

    // Определяем множитель по типу урона
    let multiplier = 1;
    switch (base.damagetype) {
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

    if (typeof base.damage === 'number') {
        enemy.damage = Math.round(base.damage * Math.pow(multiplier, lvl - 1));
    } else if (typeof base.damage === 'function') {
        const baseFunc = base.damage;
        enemy.damage = function() {
            return Math.round(baseFunc.call(this) * Math.pow(multiplier, lvl - 1));
        };
    }
    return enemy;
}
// --- Инициализация ---
window.addEventListener('DOMContentLoaded', () => {
    loadSavedSquad();
    renderCraftingList();
    renderItemCraftingList();
    loadInventory();
    renderMaterializedCharacters();
    updatePlayerPanel();
    updateCharactersList();
    renderAscensionCharactersList()
    updateUnlocks()
    renderAlliesGrids();
});

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('isRefreshing', 'true');
});
window.addEventListener('load', function() {
    const isRefreshing = sessionStorage.getItem('isRefreshing');
    if (isRefreshing === 'true') {
        sessionStorage.removeItem('isRefreshing');
        returnCharactersToInventory2();
        clearSelectedCharacters();
        renderCraftingList();
        loadSavedSquad();
        updateCharactersList();
        renderMaterializedCharacters();
        renderAscensionCharactersList()
    } else {
        loadSavedSquad();
    }
});
function returnCharactersToInventory2() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const allies = JSON.parse(localStorage.getItem('selectedAllies')) || [];
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    allies.forEach(character => {
        if (character.isMaterialized && character.materializedId) {
            if (!materializedCharacters.some(c => c.id === character.materializedId)) {
                materializedCharacters.push(character);
            }
        } else {
            const inventoryItem = inventory.find(item => item.name === character.name && item.rarity === character.rarity);
            if (inventoryItem) inventoryItem.quantity += 1;
            else inventory.push({ name: character.name, rarity: character.rarity, quantity: 1, type: 'character' });
        }
    });
    const filteredInventory = inventory.filter(item => item.quantity > 0);
    localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    localStorage.setItem('inventory', JSON.stringify(filteredInventory));
    loadInventory();
}

function renderAlliesGrids() {
    const frontGrid = document.getElementById('allies-front-grid');
    const backGrid = document.getElementById('allies-back-grid');
    frontGrid.innerHTML = '';
    backGrid.innerHTML = '';

    function handleDragStart(e, line, idx) {
        e.dataTransfer.setData('application/json', JSON.stringify({
            from: line,
            index: idx,
            character: line === 'front' ? selectedAlliesFront[idx] : selectedAlliesBack[idx]
        }));
    }

    // Фронт
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('li');
        cell.className = 'ally-cell';
        cell.dataset.index = i;
        cell.dataset.line = 'front';

        if (selectedAlliesFront[i]) {
            cell.innerHTML = `${i18next.t(`${selectedAlliesFront[i].code}.name`)} <br> ${i18next.t('Level')}: ${selectedAlliesFront[i].level}`;
            cell.style.background = '#e0ffe0';
            cell.draggable = true;
            cell.addEventListener('dragstart', (e) => handleDragStart(e, 'front', i));
            cell.addEventListener('click', () => {
                selectedAlliesFront[i] = null;
                renderAlliesGrids();
                updateCharactersList();
            });
        } else {
            cell.textContent = i18next.t('Empty') || 'Empty';
        }

        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            cell.classList.add('drag-over');
        });
        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
        });
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const data = e.dataTransfer.getData('application/json');
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.from) {
                    let fromArr = parsed.from === 'front' ? selectedAlliesFront : selectedAlliesBack;
                    let char = fromArr[parsed.index];
                    if (!selectedAlliesFront[i]) {
                        fromArr[parsed.index] = null;
                        selectedAlliesFront[i] = char;
                        renderAlliesGrids();
                        updateCharactersList();
                    }
                } else if (parsed.name) {
                    if (!selectedAlliesFront[i]) {
                        selectedAlliesFront[i] = {
                            ...parsed,
                            isMaterialized: true,
                            materializedId: String(parsed.id)
                        };
                        renderAlliesGrids();
                        updateCharactersList();
                    }
                }
            }
        });
        frontGrid.appendChild(cell);
    }

    // Тыл
    for (let i = 0; i < 5; i++) {
        const cell = document.createElement('li');
        cell.className = 'ally-cell';
        cell.dataset.index = i;
        cell.dataset.line = 'back';

        if (selectedAlliesBack[i]) {
            cell.innerHTML = `${i18next.t(`${selectedAlliesBack[i].code}.name`)} <br> ${i18next.t('Level')}: ${selectedAlliesBack[i].level}`;
            cell.style.background = '#e0ffe0';
            cell.draggable = true;
            cell.addEventListener('dragstart', (e) => handleDragStart(e, 'back', i));
            cell.addEventListener('click', () => {
                selectedAlliesBack[i] = null;
                renderAlliesGrids();
                updateCharactersList();
            });
        } else {
            cell.textContent = i18next.t('Empty') || 'Empty';
        }

        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
            cell.classList.add('drag-over');
        });
        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
        });
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            const data = e.dataTransfer.getData('application/json');
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.from) {
                    let fromArr = parsed.from === 'front' ? selectedAlliesFront : selectedAlliesBack;
                    if (!selectedAlliesBack[i]) {
                        selectedAlliesBack[i] = fromArr[parsed.index];
                        fromArr[parsed.index] = null;
                        renderAlliesGrids();
                        updateCharactersList();
                    }
                } else if (parsed.name) {
                    if (!selectedAlliesBack[i]) {
                        selectedAlliesBack[i] = {
                            ...parsed,
                            isMaterialized: true,
                            materializedId: String(parsed.id)
                        };
                        renderAlliesGrids();
                        updateCharactersList();
                    }
                }
            }
        });

        backGrid.appendChild(cell);
    }
}

list.addEventListener('dragover', (e) => {
    e.preventDefault();
    list.classList.add('drag-over');
});
list.addEventListener('dragleave', () => {
    list.classList.remove('drag-over');
});
list.addEventListener('drop', (e) => {
    e.preventDefault();
    list.classList.remove('drag-over');
    const data = e.dataTransfer.getData('application/json');
    if (data) {
        const parsed = JSON.parse(data);
        if (parsed.from) {
            let fromArr = parsed.from === 'front' ? selectedAlliesFront : selectedAlliesBack;
            fromArr[parsed.index] = null;
            renderAlliesGrids();
            updateCharactersList();
        }
    }
});

// ...existing code...

// --- Переключение вкладок ---
document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', function() {
        const tabId = btn.getAttribute('data-tab');
        if (!tabId) return;
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tab => {
            if (tab.id === tabId) {
                tab.classList.add('active');
                tab.style.display = '';
            } else {
                tab.classList.remove('active');
                tab.style.display = 'none';
            }
        });
    });
});

function renderCharactersListUniversal(characters, container, options = {}) {
    container.innerHTML = '';
    let chars = [...characters];
    if (currentSort === 'rarity') {
        chars.sort((a, b) => getRarityOrder(a.rarity) - getRarityOrder(b.rarity));
    } else if (currentSort === 'level') {
        chars.sort((a, b) => (b.level || 1) - (a.level || 1));
    } else if (currentSort === 'name') {
        chars.sort((a, b) => i18next.t(`${a.code}.name`).localeCompare(i18next.t(`${b.code}.name`)));
    } else if (currentSort === 'speed') {
        chars.sort((a, b) => (b.speed || 0) - (a.speed || 0));
    }
    chars.forEach(char => {
        const listItem = document.createElement('li');
        listItem.classList.add(getRarityClass(char.rarity), 'materialized-character-list');
        listItem.innerHTML = `
            <span style="font-weight:bold; display:flex; justify-content:center; font-size:14px; text-align: center;">${i18next.t(`${char.code}.name`)}</span>
            <strong>${i18next.t('Level')}:</strong> ${char.level} <br>
            <strong>${i18next.t('Experience')}:</strong> ${Math.floor(char.exp)}/${char.maxExp} <br>
            <strong>${i18next.t('Rarity')}:</strong> <span style="font-weight:bold">${i18next.t(`${char.code}.rarity`)}</span><br>
            <strong>${i18next.t('Health')}:</strong> ${char.health}<br>
            <strong>${i18next.t('Defense')}:</strong> ${char.defense}%<br>
            <strong>${i18next.t(`${char.code}.damagetype`) || char.damagetype}:</strong> ${typeof char.damage === 'function' 
                ? Math.round(char.damage.call(char)) 
                : char.damage}<br>
            <strong>${i18next.t('Speed') || 'Speed'}:</strong> ${char.speed}<br>
            <strong>${i18next.t('Ability') || 'Ability'}:</strong> ${i18next.t(`${char.code}.ability`)}<br>
        `;
        // Drag&Drop только если нужно (например, для возвышения)
        if (options.dragForAscension) {
            listItem.draggable = true;
            listItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(char));
            });
        }
        container.appendChild(listItem);
    });
}

const ascensionList = document.getElementById('ascension-characters-list');
ascensionList.ondragover = (e) => {
    if (e.dataTransfer.types.includes('ascension-remove')) e.preventDefault();
};
ascensionList.ondrop = (e) => {
    if (e.dataTransfer.types.includes('ascension-remove')) {
        e.preventDefault();
        ascensionSelectedCharacter = null;
        renderAscensionDropzone();
        showAscensionBranches(null);
        renderAscensionRecipe(null);
        renderAscensionCharactersList();
    }
};

// --- Список персонажей для возвышения ---
function renderAscensionCharactersList() {
    const materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    const container = document.getElementById('ascension-characters-list');
    // Скрываем выбранного персонажа
    const filtered = ascensionSelectedCharacter
        ? materializedCharacters.filter(c => c.id !== ascensionSelectedCharacter.id)
        : materializedCharacters;
    renderCharactersListUniversal(filtered, container, { dragForAscension: true });
}


let ascensionSelectedCharacter = null;

const dropzone = document.getElementById('ascension-dropzone');
dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.style.background = '#e0f7fa';
});
dropzone.addEventListener('dragleave', e => {
    dropzone.style.background = '#f9f9f9';
});
dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.style.background = '#f9f9f9';
    const char = JSON.parse(e.dataTransfer.getData('application/json'));
    ascensionSelectedCharacter = char;
    renderAscensionDropzone();
    showAscensionBranches(char);
    renderAscensionRecipe(null); // Сброс рецепта
    renderAscensionCharactersList(); // Обновить список (убрать выбранного)
});

// Рендер дропа
function renderAscensionDropzone() {
    const dz = document.getElementById('ascension-dropzone');
    dz.innerHTML = '';
    if (ascensionSelectedCharacter) {
        dz.textContent = i18next.t(`${ascensionSelectedCharacter.code}.name`, { defaultValue: ascensionSelectedCharacter.name });
        dz.draggable = true;
        dz.style.cursor = 'grab';
        dz.ondragstart = (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify(ascensionSelectedCharacter));
            // Специальная метка для возврата
            e.dataTransfer.setData('ascension-remove', '1');
        };
        dz.ondragend = (e) => {
            // Если отпустили вне dropzone — убираем персонажа
            if (e.dataTransfer.dropEffect === 'none') {
                ascensionSelectedCharacter = null;
                renderAscensionDropzone();
                showAscensionBranches(null);
                renderAscensionRecipe(null);
                renderAscensionCharactersList();
            }
        };
    } else {
        dz.innerHTML = `<span id="ascension-dropzone-placeholder" style="color:#aaa;">${i18next.t('Drag character here', { defaultValue: 'Перетащите персонажа' })}</span>`;
        dz.draggable = false;
        dz.style.cursor = 'default';
        dz.ondragstart = null;
        dz.ondragend = null;
    }
}

// --- Отображение веток возвышения ---
function showAscensionBranches(char) {
    const branches = document.querySelectorAll('#ascension-branches .ascension-branch');
    ascensionSelectedCharacter = char;
    localStorage.setItem('ascensionSelectedCharacter', JSON.stringify(char));

    const asc = char ? ASCENSIONS[char.name] : null;
    for (let i = 0; i < 3; i++) {
        const branch = branches[i];
        const targetNames = asc ? Object.keys(asc) : [];
        if (targetNames[i]) {
            const target = targetNames[i];
            // Получаем code цели возвышения
            const targetChar = characters.find(c => c.name === target);
            const targetDisplayName = targetChar ? i18next.t(`${targetChar.code}.name`, { defaultValue: target }) : target;
            branch.querySelector('.ascension-target').textContent = targetDisplayName;
            branch.querySelector('.ascension-target').style.background = '#fff';
            branch.querySelector('.ascension-target').style.cursor = 'pointer';
            branch.querySelector('.ascension-target').style.border = '2px solid black';
            branch.querySelector('.ascension-target').style.color = 'black';
            branch.querySelector('.ascension-target').onclick = () => renderAscensionRecipe({char, target});
        } else {
            branch.querySelector('.ascension-target').textContent = '-';
            branch.querySelector('.ascension-target').style.background = '#aaa';
            branch.querySelector('.ascension-target').style.cursor = 'not-allowed';
            branch.querySelector('.ascension-target').style.border = '2px solid black';
            branch.querySelector('.ascension-target').style.color = 'black';
            branch.querySelector('.ascension-target').onclick = null;
        }
    }
    if (!char) renderAscensionRecipe(null);
}

window.ascendCharacter = function(fromName, toName) {
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    const fromNameKey = `${fromName}.name`;
    const toNameKey = `${toName}.name`;

    const fromNameTranslated = i18next.t(fromNameKey, { defaultValue: fromName });
    const toNameTranslated = i18next.t(toNameKey, { defaultValue: toName });

    console.log(fromName)
    console.log(toName)
    console.log(ASCENSIONS[fromNameKey])
    const ascRecipe = ASCENSIONS[fromName][toName];

    // Находим персонажа для возвышения
    let charIdx = materializedCharacters.findIndex(c => c.name === fromName && c.id === (ascensionSelectedCharacter && ascensionSelectedCharacter.id));
    if (charIdx === -1) charIdx = materializedCharacters.findIndex(c => c.name === fromName);

    if (charIdx === -1) {
        return;
    }
    const char = materializedCharacters[charIdx];

    // Проверка уровня
    const levelReq = ascRecipe.find(r => r.level)?.level || 0;
    if (char.level < levelReq) {
        return;
    }

    // Проверка предметов
    let hasAll = true;
    for (let req of ascRecipe) {
        if (req.name) {
            const invItem = inventory.find(i => i.name === req.name && i.rarity === req.rarity);
            if (!invItem || invItem.quantity < req.quantity) {
                hasAll = false;
                break;
            }
        }
    }
    if (!hasAll) {
        return;
    }

    // Списание предметов
    for (let req of ascRecipe) {
        if (req.name) {
            let invItem = inventory.find(i => i.name === req.name && i.rarity === req.rarity);
            if (invItem) invItem.quantity -= req.quantity;
        }
    }

    // Удаление старого персонажа из materializedCharacters
    const oldCharId = char.id;
    materializedCharacters.splice(charIdx, 1);

    // Удаление из отряда, если был
    let updateSquad = false;
    [selectedAlliesFront, selectedAlliesBack].forEach(arr => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i].isMaterialized && arr[i].materializedId == oldCharId) {
                arr[i] = null;
                updateSquad = true;
            }
        }
    });

    // Добавление нового персонажа с характеристиками из characters
    const baseChar = characters.find(c => c.name === toName);
    if (!baseChar) {
        return;
    }
    // Новый id для нового материализованного персонажа
    const newChar = {
        ...baseChar,
        id: Date.now() + Math.random(),
        level: 1,
        exp: 0,
        maxExp: 100
    };
    materializedCharacters.push(newChar);

    // Сохраняем
    localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('selectedAlliesFront', JSON.stringify(selectedAlliesFront));
    localStorage.setItem('selectedAlliesBack', JSON.stringify(selectedAlliesBack));

    // Убираем из ячейки для возвышения
    ascensionSelectedCharacter = null;

    // Обновляем UI
    renderAscensionCharactersList();
    renderCharactersList();
    renderAlliesGrids();
    renderAscensionDropzone();
    showAscensionBranches(null) 

    // Показываем модальное окно
    const ascensionText = i18next.t('ascension_message', { from: fromNameTranslated, to: toNameTranslated });
    document.getElementById('ascension-modal-text').textContent = ascensionText;
    document.getElementById('ascension-modal').style.display = 'block';
};

document.getElementById('close-ascension-modal').onclick = function() {
    document.getElementById('ascension-modal').style.display = 'none';
    // Обновить список после возвышения
    renderAscensionCharactersList();
};

if (document.getElementById('ascension-characters-list')) {
    renderAscensionCharactersList();
}

function renderAscensionRecipe(data) {
    const panel = document.getElementById('ascension-recipe-panel');
    if (!data) {
        panel.innerHTML = '';
        return;
    }
    const { char, target } = data;
    const asc = ASCENSIONS[char.name];
    const recipe = asc && asc[target] ? asc[target] : [];
    // Получаем code цели возвышения (если есть)
    const targetChar = characters.find(c => c.name === target);
    const targetDisplayName = targetChar ? i18next.t(`${targetChar.code}.name`, { defaultValue: target }) : target;

    let html = `<div style="font-weight:bold;font-size:1.1em;margin-bottom:6px;">${i18next.t('Ascend to', { defaultValue: 'Для возвышения в' })} ${targetDisplayName} ${i18next.t('required', { defaultValue: 'требуется:' })}</div>`;
    let levelReq = null;
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    let allEnough = true;

    recipe.forEach(item => {
        if (item.level) {
            levelReq = item.level;
            html += `<div style="margin:4px 0;">
                <b>${i18next.t('Required level', { defaultValue: 'Требуемый уровень' })}: ${char.level}/${item.level}</b>
            </div>`;
            if (char.level < item.level) allEnough = false;
        } else {
            // Получаем key предмета
            const itemData = items.find(i => i.name === item.name);
            const itemKey = itemData ? itemData.key : null;
            const itemName = itemKey ? i18next.t(`items.${itemKey}`, { defaultValue: item.name }) : item.name;
            const currentQuantity = (inventory.find(i => i.name === item.name && i.rarity === item.rarity)?.quantity) || 0;
            if (currentQuantity < item.quantity) allEnough = false;
            html += `
                <div class="recipe-item" style="display:flex;align-items:center;gap:8px;margin:4px 0;">
                    <div class="item-icon" style="background-color: ${rarityColors[item.rarity]}; width: 30px; height: 30px; border-radius: 5px;"></div>
                    <span>x${item.quantity} ${itemName} (${currentQuantity}/${item.quantity})</span>
                </div>
            `;
        }
    });
    html += `<button ${allEnough ? '' : 'disabled'} style="margin-top:8px;" onclick="ascendCharacter('${char.code}','${target}')">${i18next.t('Ascend', { defaultValue: 'Возвысить' })}</button>`;
    panel.innerHTML = html;
}

function localizeHtml(root=document) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.i18next) el.textContent = i18next.t(key);
    });
}
function renderLevelRewardsList() {
    const list = document.getElementById('level-rewards-list');
    list.innerHTML = '';
    // Получаем текущий уровень игрока (пример: из localStorage или переменной)
    const profile = getPlayerProfile ? getPlayerProfile() : { level: 1 };
    const playerLevel = profile.level || 1;

    levelRewards.forEach(reward => {
        const div = document.createElement('div');
        div.className = 'level-reward-card';
        if (playerLevel >= reward.level) {
            div.classList.add('reward-unlocked');
        }
        const rewardText = window.i18next ? i18next.t(reward.textKey) : reward.textKey;
        div.innerHTML = `
            <div style="font-weight:bold;font-size:1.2em;margin-bottom:10px;">${rewardText}</div>
            <div style="margin-top:12px;color:#888;" data-i18n="Required Level">Required Level</div>
            <div class="level-required-number" style="font-size:1.5em;font-weight:bold;color:#f7b500;">${reward.level}</div>
        `;
        list.appendChild(div);
    });
    if (typeof localizeHtml === 'function') localizeHtml(list);
}

document.getElementById('level-rewards-btn').onclick = function(e) {
    e.stopPropagation();
    renderLevelRewardsList();
    document.getElementById('level-rewards-modal').style.display = 'flex';
};
document.getElementById('close-level-rewards-modal').onclick = function() {
    document.getElementById('level-rewards-modal').style.display = 'none';
};
// Чтобы закрывать по клику вне окна:
document.getElementById('level-rewards-modal').onclick = function(e) {
    if (e.target === this) this.style.display = 'none';
};

function unlockFeaturesByLevel(playerLevel) {
    // Крафт и выведение (уровень 2)
    const craftingPanel = document.getElementById('crafting-panel');
    if (craftingPanel) craftingPanel.style.display = playerLevel >= 2 ? '' : 'none';

    // Возвышение (уровень 3)
    const ascensionTabBtn = document.querySelector('.tab-button[data-tab="ascension-tab"]');
    if (ascensionTabBtn) ascensionTabBtn.style.display = playerLevel >= 3 ? '' : 'none';

    // Случайная битва (уровень 5)
    const randomFightBtn = document.getElementById('random-fight-button');
    if (randomFightBtn) randomFightBtn.style.display = playerLevel >= 7 ? '' : 'none';
}

// Вызовите эту функцию после загрузки профиля игрока или при изменении уровня
function updateUnlocks() {
    let profile = typeof getPlayerProfile === 'function' ? getPlayerProfile() : { level: 1 };
    unlockFeaturesByLevel(profile.level || 1);
}

function syncMaterializedCharactersWithBase() {
    let materializedCharacters = JSON.parse(localStorage.getItem('materializedCharacters')) || [];
    let updated = false;

    materializedCharacters = materializedCharacters.map(matChar => {
        const base = characters.find(c => c.code === matChar.code);
        if (!base) return matChar;

        const {
            id, level = 1, exp, maxExp, isMaterialized, materializedId
        } = matChar;

        // Базовые значения
        const baseMaxHealth = base.maxHealth || base.health;
        const baseDamage = typeof base.damage === 'number' ? base.damage : null;

        // Новые значения с учётом уровня
        const newMaxHealth = Math.round(baseMaxHealth * Math.pow(1.1, level - 1));
        const newDamage = baseDamage !== null ? Math.round(baseDamage * Math.pow(1.1, level - 1)) : base.damage;

        const updatedChar = {
            ...base,
            id,
            level,
            exp,
            maxExp,
            isMaterialized,
            materializedId,
            maxHealth: newMaxHealth,
            health: newMaxHealth,
            damage: newDamage
        };

        updated = true;
        return updatedChar;
    });

    if (updated) {
        localStorage.setItem('materializedCharacters', JSON.stringify(materializedCharacters));
    }
    renderMaterializedCharacters && renderMaterializedCharacters();
    updateCharactersList && updateCharactersList();
}

