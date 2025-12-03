// Popup script for Blur-It

document.addEventListener('DOMContentLoaded', () => {
    const toggleEnabled = document.getElementById('toggleEnabled');
    const detectPasswords = document.getElementById('detectPasswords');
    const detectApiKeys = document.getElementById('detectApiKeys');
    const detectEmails = document.getElementById('detectEmails');
    const detectUsernames = document.getElementById('detectUsernames');
    const detectCreditCards = document.getElementById('detectCreditCards');
    const detectedCount = document.getElementById('detectedCount');
    const refreshBtn = document.getElementById('refreshBtn');
    const optionsBtn = document.getElementById('optionsBtn');

    // Load current settings
    chrome.storage.sync.get([
        'enabled',
        'detectPasswords',
        'detectApiKeys',
        'detectEmails',
        'detectUsernames',
        'detectCreditCards'
    ], (result) => {
        toggleEnabled.checked = result.enabled !== undefined ? result.enabled : true;
        detectPasswords.checked = result.detectPasswords !== undefined ? result.detectPasswords : true;
        detectApiKeys.checked = result.detectApiKeys !== undefined ? result.detectApiKeys : true;
        detectEmails.checked = result.detectEmails !== undefined ? result.detectEmails : true;
        detectUsernames.checked = result.detectUsernames !== undefined ? result.detectUsernames : true;
        detectCreditCards.checked = result.detectCreditCards !== undefined ? result.detectCreditCards : true;
    });

    // Get detection count from current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getCount' }, (response) => {
            if (response && response.count !== undefined) {
                detectedCount.textContent = response.count;
            }
        });
    });

    // Toggle enabled/disabled
    toggleEnabled.addEventListener('change', (e) => {
        chrome.storage.sync.set({ enabled: e.target.checked }, () => {
            // Reload current tab to apply changes
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    });

    // Helper function to reload current tab after settings change
    function reloadCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    }

    // Toggle detection types
    detectPasswords.addEventListener('change', (e) => {
        chrome.storage.sync.set({ detectPasswords: e.target.checked }, () => {
            reloadCurrentTab();
        });
    });

    detectApiKeys.addEventListener('change', (e) => {
        chrome.storage.sync.set({ detectApiKeys: e.target.checked }, () => {
            reloadCurrentTab();
        });
    });

    detectEmails.addEventListener('change', (e) => {
        chrome.storage.sync.set({ detectEmails: e.target.checked }, () => {
            reloadCurrentTab();
        });
    });

    detectUsernames.addEventListener('change', (e) => {
        chrome.storage.sync.set({ detectUsernames: e.target.checked }, () => {
            reloadCurrentTab();
        });
    });

    detectCreditCards.addEventListener('change', (e) => {
        chrome.storage.sync.set({ detectCreditCards: e.target.checked }, () => {
            reloadCurrentTab();
        });
    });

    // Refresh page
    refreshBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
            window.close();
        });
    });

    // Open options page
    optionsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});

