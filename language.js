i18next
  .use(i18nextHttpBackend)
  .init({
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    debug: false,
    backend: {
      loadPath: './locales/{{lng}}.json'
    }
  }, function(err, t) {
    updateAllTexts();
  });

function updateAllTexts() {
    // Для элементов с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = i18next.t(el.getAttribute('data-i18n'));
    });
    // Для option
    document.querySelectorAll('option[data-i18n]').forEach(opt => {
        opt.textContent = i18next.t(opt.getAttribute('data-i18n'));
    });
    // Для динамических элементов (например, карточки персонажей)
    if (typeof renderCharactersList === 'function') renderCharactersList();
    if (typeof renderAlliesGrids === 'function') renderAlliesGrids();
    if (typeof renderAscensionCharactersList === 'function') renderAscensionCharactersList();
    if (typeof loadInventory === 'function') loadInventory();
    if (typeof renderItemCraftingList === 'function') renderItemCraftingList();
    if (typeof renderCraftingList === 'function') renderCraftingList();
    // --- ДОБАВЬТЕ ЭТО ---
    if (typeof initializeBattle === 'function') initializeBattle();
    if (typeof updateTurnOrderDisplay === 'function') updateTurnOrderDisplay();
}