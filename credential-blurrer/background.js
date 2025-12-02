// Background Service Worker for Credential Blurrer

chrome.runtime.onInstalled.addListener(() => {
    // Set default settings
    chrome.storage.sync.set({
        enabled: true,
        blurIntensity: 8,
        detectPasswords: true,
        detectApiKeys: true,
        detectEmails: true,
        detectUsernames: true,
        detectCreditCards: true
    });
});

// Handle badge updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateBadge') {
        const count = request.count || 0;
        if (count > 0) {
            chrome.action.setBadgeText({
                text: count.toString(),
                tabId: sender.tab?.id
            });
            chrome.action.setBadgeBackgroundColor({
                color: '#667eea'
            });
        } else {
            chrome.action.setBadgeText({
                text: '',
                tabId: sender.tab?.id
            });
        }
    }
    return true;
});

