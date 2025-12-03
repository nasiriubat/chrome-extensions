// Overlay script for audio player controls

let audio = null;
let isDragging = false;
let currentPosition = { x: 20, y: 20 };
let dragOffset = { x: 0, y: 0 };
let processingMode = 'as_it_is'; // Default processing mode

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeDragging();
  loadSavedPosition();
  setupEventListeners();
  
  // Request content extraction and audio generation
  requestAudioGeneration();
});

function setupEventListeners() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const closeBtn = document.getElementById('closeBtn');

  playPauseBtn.addEventListener('click', togglePlayPause);
  regenerateBtn.addEventListener('click', regenerateAudio);
  downloadBtn.addEventListener('click', downloadAudio);
  closeBtn.addEventListener('click', closeWidget);
}

function initializeDragging() {
  const widget = document.getElementById('audioWidget');
  const bar = document.getElementById('widgetBar');

  bar.addEventListener('mousedown', (e) => {
    // Don't drag if clicking on buttons
    if (e.target.closest('button')) return;
    
    isDragging = true;
    const rect = widget.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    bar.style.cursor = 'grabbing';
    e.preventDefault();
  });

  // Use document-level listeners to handle dragging outside iframe bounds
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Also listen on window to catch mouse events that leave the iframe
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e) {
  if (!isDragging) return;
  
  const widget = document.getElementById('audioWidget');
  
  // Get coordinates relative to the iframe's viewport
  currentPosition.x = e.clientX - dragOffset.x;
  currentPosition.y = e.clientY - dragOffset.y;
  
  // Keep widget within viewport bounds
  const widgetRect = widget.getBoundingClientRect();
  const maxX = window.innerWidth - widgetRect.width;
  const maxY = window.innerHeight - widgetRect.height;
  
  currentPosition.x = Math.max(0, Math.min(currentPosition.x, maxX));
  currentPosition.y = Math.max(0, Math.min(currentPosition.y, maxY));
  
  widget.style.left = currentPosition.x + 'px';
  widget.style.top = currentPosition.y + 'px';
}

function handleMouseUp() {
  if (isDragging) {
    isDragging = false;
    const bar = document.getElementById('widgetBar');
    bar.style.cursor = 'move';
    savePosition();
  }
}

function loadSavedPosition() {
  // Get position from storage or use default
  chrome.storage.local.get(['overlayPosition'], (result) => {
    if (result.overlayPosition) {
      currentPosition = result.overlayPosition;
    }
    const widget = document.getElementById('audioWidget');
    widget.style.left = currentPosition.x + 'px';
    widget.style.top = currentPosition.y + 'px';
  });
}

function savePosition() {
  chrome.storage.local.set({ overlayPosition: currentPosition });
}

// Track if we're waiting for a response
let waitingForContent = false;
let contentTimeout = null;

// Listen for postMessage responses from content script
window.addEventListener('message', (event) => {
  // Handle processing mode setting
  if (event.data && event.data.action === 'setProcessingMode') {
    processingMode = event.data.processingMode || 'as_it_is';
    return;
  }
  
  // Only process messages that look like responses from our content script
  if (event.data && typeof event.data === 'object' && 'success' in event.data) {
    if (event.data.action === 'extractContent' || event.data.content !== undefined) {
      if (contentTimeout) {
        clearTimeout(contentTimeout);
        contentTimeout = null;
      }
      waitingForContent = false;
      handleContentExtracted(event.data);
    }
  }
});

function requestAudioGeneration() {
  updateStatus('Extracting content...', 'loading');
  waitingForContent = true;
  
  // Clear any existing timeout
  if (contentTimeout) {
    clearTimeout(contentTimeout);
  }
  
  // Request content extraction via postMessage to parent window (content script)
  window.parent.postMessage({ action: 'extractContent', source: 'overlay' }, '*');
  
  // Set a timeout in case the content script doesn't respond
  contentTimeout = setTimeout(() => {
    if (waitingForContent) {
      waitingForContent = false;
      updateStatus('Timeout: Could not extract content. Please refresh the page and try again.', 'error');
    }
  }, 10000);
}

function handleContentExtracted(response) {
  if (!response || !response.success) {
    const errorMsg = response?.error || 'Failed to extract content';
    updateStatus(errorMsg, 'error');
    console.error('Content extraction error:', errorMsg);
    return;
  }

  if (!response.content || response.content.trim().length === 0) {
    updateStatus('No content found on this page', 'error');
    return;
  }

  updateStatus('Processing with AI...', 'loading');
  
  // Get processing mode from storage if not set
  chrome.storage.local.get(['processingMode'], (result) => {
    if (result.processingMode) {
      processingMode = result.processingMode;
    }
    
    // Request background script to process and generate audio
    chrome.runtime.sendMessage({
      action: 'processAndGenerateAudio',
      text: response.content,
      processingMode: processingMode
    }, (audioResponse) => {
      // Check for runtime errors
      if (chrome.runtime.lastError) {
        updateStatus('Error: ' + chrome.runtime.lastError.message, 'error');
        console.error('Runtime error:', chrome.runtime.lastError.message);
        return;
      }
      
      if (!audioResponse || !audioResponse.success) {
        const errorMsg = audioResponse?.error || 'Failed to generate audio';
        updateStatus(errorMsg, 'error');
        console.error('Audio generation error:', errorMsg);
        return;
      }

      // Create audio element
      audio = new Audio(audioResponse.audioUrl);
      setupAudioListeners();
      
      updateStatus('Ready to play', 'success');
      enableControls();
    });
  });
}

function setupAudioListeners() {
  if (!audio) return;

  const progressFill = document.getElementById('progressFill');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const progressBar = document.querySelector('.progress-bar');

  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });
  
  // Make progress bar clickable to seek
  progressBar.addEventListener('click', (e) => {
    if (!audio || !audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = progress + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('ended', () => {
    const playPauseIcon = document.getElementById('playPauseIcon');
    playPauseIcon.textContent = '▶';
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    updateStatus('', 'success');
  });

  audio.addEventListener('error', (e) => {
    updateStatus('Audio playback error', 'error');
    console.error('Audio error:', e);
  });
}

function togglePlayPause() {
  if (!audio) return;

  const playPauseIcon = document.getElementById('playPauseIcon');
  
  if (audio.paused) {
    audio.play();
    playPauseIcon.textContent = '⏸';
    updateStatus('Playing...', 'success');
  } else {
    audio.pause();
    playPauseIcon.textContent = '▶';
    updateStatus('Paused', 'success');
  }
}

function regenerateAudio() {
  if (audio) {
    audio.pause();
    audio = null;
  }
  
  // Clear previous audio
  const progressFill = document.getElementById('progressFill');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const playPauseIcon = document.getElementById('playPauseIcon');
  
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent = '0:00';
  playPauseIcon.textContent = '▶';
  
  disableControls();
  requestAudioGeneration();
}

function downloadAudio() {
  if (!audio || !audio.src) return;

  const a = document.createElement('a');
  a.href = audio.src;
  a.download = 'audio-content.mp3';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function enableControls() {
  document.getElementById('playPauseBtn').disabled = false;
  document.getElementById('downloadBtn').disabled = false;
  document.getElementById('regenerateBtn').disabled = false;
}

function disableControls() {
  document.getElementById('playPauseBtn').disabled = true;
  document.getElementById('downloadBtn').disabled = true;
  document.getElementById('regenerateBtn').disabled = true;
}

function updateStatus(message, type = '') {
  const statusIndicator = document.getElementById('statusIndicator');
  
  // Remove all status classes
  statusIndicator.classList.remove('loading', 'error', 'hidden');
  
  if (type === 'loading') {
    statusIndicator.classList.add('loading');
    statusIndicator.style.display = 'flex';
  } else if (type === 'error') {
    statusIndicator.classList.add('error');
    statusIndicator.style.display = 'flex';
  } else if (type === 'success') {
    // Show green indicator for success
    statusIndicator.style.display = 'flex';
    statusIndicator.style.background = '#27ae60';
  } else {
    // Hide when no status
    statusIndicator.classList.add('hidden');
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function closeWidget() {
  if (audio) {
    audio.pause();
    audio = null;
  }
  
  // Hide overlay by sending message to parent window (content script)
  window.parent.postMessage({ action: 'hideOverlay', source: 'overlay' }, '*');
  
  // Also hide iframe from parent
  if (window.frameElement) {
    window.frameElement.style.display = 'none';
  }
}

