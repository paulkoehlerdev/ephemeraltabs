const HIDE_TAB_LIFETIME = 10 * 60 * 1000;
const TAB_LIFETIME = 30 * 60 * 1000; // 30min

setInterval(async () => {
    const windows = await browser.windows.getAll({populate: true});
    const tabs = windows
        .flatMap((window) => window.tabs)
        .filter((tab) => !tab.pinned)
        .filter((tab) => !tab.active)
        .filter((tab) => Date.now() - tab.lastAccessed > HIDE_TAB_LIFETIME);

    await Promise.all(tabs.map(async (tab) => {
        await browser.tabs.discard(tab.id);
        await browser.tabs.hide(tab.id);

        if (Date.now() - tab.lastAccessed > TAB_LIFETIME) {
            await browser.tabs.remove(tab.id);
        }
    }));
}, 1000);
