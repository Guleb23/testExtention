let activeTabId;

// Обновляем ID активной вкладки при переключении
chrome.tabs.onActivated.addListener((activeInfo) => {
    activeTabId = activeInfo.tabId;
});

// Инициализация при загрузке
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) activeTabId = tabs[0].id;
});

// Обработчик команд
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "copy-all") {
        try {
            // Проверяем URL вкладки
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab.url.includes("stackoverflow.com")) return;

            // Если content.js не загружен, загружаем его
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });

            // Отправляем сообщение
            await chrome.tabs.sendMessage(tab.id, { action: "copy-all" }, (allcode) => {
                console.log(allcode);

            });
        } catch (error) {
            console.error("Ошибка:", error);
            // Показываем уведомление пользователю
            chrome.notifications.create({
                title: "Ошибка копирования",
                message: "Не удалось скопировать код",
                iconUrl: "icon.png",
                type: "basic"
            });
        }
    }
});

