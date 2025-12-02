// Options page script

document.addEventListener('DOMContentLoaded', () => {
    const blurIntensity = document.getElementById('blurIntensity');
    const blurIntensityValue = document.getElementById('blurIntensityValue');
    const enabled = document.getElementById('enabled');
    const detectPasswords = document.getElementById('detectPasswords');
    const detectApiKeys = document.getElementById('detectApiKeys');
    const detectEmails = document.getElementById('detectEmails');
    const detectUsernames = document.getElementById('detectUsernames');
    const detectCreditCards = document.getElementById('detectCreditCards');
    const saveBtn = document.getElementById('saveBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Load current settings
    chrome.storage.sync.get([
        'enabled',
        'blurIntensity',
        'detectPasswords',
        'detectApiKeys',
        'detectEmails',
        'detectUsernames',
        'detectCreditCards'
    ], (result) => {
        enabled.checked = result.enabled !== undefined ? result.enabled : true;
        blurIntensity.value = result.blurIntensity || 8;
        blurIntensityValue.textContent = `${blurIntensity.value}px`;
        detectPasswords.checked = result.detectPasswords !== undefined ? result.detectPasswords : true;
        detectApiKeys.checked = result.detectApiKeys !== undefined ? result.detectApiKeys : true;
        detectEmails.checked = result.detectEmails !== undefined ? result.detectEmails : true;
        detectUsernames.checked = result.detectUsernames !== undefined ? result.detectUsernames : true;
        detectCreditCards.checked = result.detectCreditCards !== undefined ? result.detectCreditCards : true;
    });

    // Update blur intensity display
    blurIntensity.addEventListener('input', (e) => {
        blurIntensityValue.textContent = `${e.target.value}px`;
    });

    // Save settings
    saveBtn.addEventListener('click', () => {
        const settings = {
            enabled: enabled.checked,
            blurIntensity: parseInt(blurIntensity.value),
            detectPasswords: detectPasswords.checked,
            detectApiKeys: detectApiKeys.checked,
            detectEmails: detectEmails.checked,
            detectUsernames: detectUsernames.checked,
            detectCreditCards: detectCreditCards.checked
        };

        chrome.storage.sync.set(settings, () => {
            // Reload all tabs to apply changes
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    chrome.tabs.reload(tab.id).catch(() => {
                        // Ignore errors for tabs that can't be reloaded (e.g., chrome:// pages)
                    });
                });
            });
            
            // Show success message
            const message = document.createElement('div');
            message.className = 'success-message';
            message.textContent = 'Settings saved! Reloading pages to apply changes...';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
        });
    });

    // Reset to defaults
    resetBtn.addEventListener('click', () => {
        if (confirm('Reset all settings to defaults?')) {
            chrome.storage.sync.set({
                enabled: true,
                blurIntensity: 8,
                detectPasswords: true,
                detectApiKeys: true,
                detectEmails: true,
                detectUsernames: true,
                detectCreditCards: true
            }, () => {
                // Reload page to show defaults
                location.reload();
            });
        }
    });
});

