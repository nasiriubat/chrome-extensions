// Popup script for API key management

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelect = document.getElementById('model');
  const saveBtn = document.getElementById('saveBtn');
  const generateBtn = document.getElementById('generateBtn');
  const statusEl = document.getElementById('status');

  // Load saved settings
  chrome.storage.local.get(['openaiApiKey', 'gptModel'], (result) => {
    if (result.openaiApiKey) {
      apiKeyInput.value = result.openaiApiKey;
    }
    if (result.gptModel) {
      modelSelect.value = result.gptModel;
    }
  });

  generateBtn.addEventListener('click', () => {
    triggerAudioGeneration();
  });

  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    // Basic validation (OpenAI keys start with sk-)
    if (!apiKey.startsWith('sk-')) {
      showStatus('Invalid API key format. OpenAI keys start with "sk-"', 'error');
      return;
    }

    // Save API key and model
    chrome.storage.local.set({ 
      openaiApiKey: apiKey,
      gptModel: model
    }, () => {
      showStatus('Settings saved successfully!', 'success');
      
      // Clear input for security
      apiKeyInput.value = '';
      
      // Optionally trigger audio generation on current tab
      setTimeout(() => {
        triggerAudioGeneration();
      }, 1000);
    });
  });

  // Allow Enter key to save
  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });
});

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
  
  setTimeout(() => {
    statusEl.className = 'status';
    statusEl.style.display = 'none';
  }, 3000);
}

function triggerAudioGeneration() {
  // Get current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      // Send message to content script to show overlay and generate audio
      chrome.tabs.sendMessage(tabs[0].id, { action: 'showOverlay' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError);
        } else {
          // Close popup after triggering audio generation
          window.close();
        }
      });
    }
  });
}

