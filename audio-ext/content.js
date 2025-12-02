// Content script to extract and sanitize main content from page

function extractMainContent() {
  // Try to find main content using various selectors
  const selectors = [
    'article',
    'main',
    '[role="main"]',
    '.article',
    '.content',
    '.post',
    '.entry-content',
    '#content',
    '#main-content',
    '.main-content'
  ];

  let contentElement = null;
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      contentElement = element;
      break;
    }
  }

  // Fallback to body if no main content found
  if (!contentElement) {
    contentElement = document.body;
  }

  // Clone the element to avoid modifying the original
  const clone = contentElement.cloneNode(true);

  // Remove script and style elements
  clone.querySelectorAll('script, style, noscript, iframe, embed, object').forEach(el => el.remove());

  // Remove common non-content elements
  clone.querySelectorAll('nav, header, footer, aside, .sidebar, .navigation, .menu, .advertisement, .ad').forEach(el => el.remove());

  // Extract text content and sanitize
  let text = clone.textContent || clone.innerText || '';

  // Normalize whitespace
  text = text
    .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n')  // Replace multiple newlines with single newline
    .trim();

  // Limit text length (OpenAI TTS has limits)
  const maxLength = 4000; // Conservative limit
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }

  return text;
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    try {
      const content = extractMainContent();
      sendResponse({ success: true, content: content });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true; // Keep channel open for async response
  }

  if (request.action === 'showOverlay') {
    // Inject overlay iframe
    const overlayId = 'audio-extension-overlay';
    if (document.getElementById(overlayId)) {
      // Overlay already exists, just show it
      document.getElementById(overlayId).style.display = 'block';
      sendResponse({ success: true });
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.id = overlayId;
    iframe.src = chrome.runtime.getURL('overlay.html');
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      z-index: 999999;
      background: transparent;
      pointer-events: none;
    `;
    iframe.setAttribute('allowtransparency', 'true');
    document.body.appendChild(iframe);
    
    // Enable pointer events on the iframe itself
    iframe.style.pointerEvents = 'auto';
    
    // Wait for iframe to load, then adjust its size to fit content
    iframe.onload = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const widget = iframeDoc.getElementById('audioWidget');
        if (widget) {
          // Resize iframe to fit widget
          const rect = widget.getBoundingClientRect();
          iframe.style.width = (rect.width + 4) + 'px';
          iframe.style.height = (rect.height + 4) + 'px';
        }
      } catch (e) {
        // Cross-origin or other error, keep fullscreen iframe
      }
    };
    sendResponse({ success: true });
  }

  if (request.action === 'hideOverlay') {
    const overlay = document.getElementById('audio-extension-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    sendResponse({ success: true });
  }
});

// Listen for hideOverlay messages from overlay via postMessage
window.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'hideOverlay' && event.data.source === 'overlay') {
    const overlay = document.getElementById('audio-extension-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
});

// Listen for messages from overlay iframe via postMessage
window.addEventListener('message', (event) => {
  // Only accept messages from our extension overlay
  if (event.data && event.data.action === 'extractContent' && event.data.source === 'overlay') {
    try {
      const content = extractMainContent();
      const response = { 
        success: true, 
        content: content,
        action: 'extractContent'
      };
      
      // Send response back to overlay
      const iframe = document.getElementById('audio-extension-overlay');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(response, '*');
      }
    } catch (error) {
      const response = { 
        success: false, 
        error: error.message,
        action: 'extractContent'
      };
      
      const iframe = document.getElementById('audio-extension-overlay');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(response, '*');
      }
    }
  }
});

