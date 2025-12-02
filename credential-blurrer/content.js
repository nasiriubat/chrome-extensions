// Credential Blurrer - Content Script
// Detects and blurs sensitive credentials on web pages

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        enabled: true,
        blurIntensity: 8,
        detectPasswords: true,
        detectApiKeys: true,
        detectEmails: true,
        detectUsernames: true,
        detectCreditCards: true,
        hoverDelay: 0
    };

    // Detection patterns
    const PATTERNS = {
        password: {
            selectors: [
                'input[type="password"]',
                'input[name*="password" i]',
                'input[name*="passwd" i]',
                'input[name*="pwd" i]',
                'input[id*="password" i]',
                'input[id*="passwd" i]',
                'input[id*="pwd" i]'
            ]
        },
        apiKey: {
            regex: [
                /sk-[a-zA-Z0-9]{32,}/g,
                /[a-zA-Z0-9]{40,}/g,
                /Bearer\s+[a-zA-Z0-9._-]+/gi,
                /token[:=]\s*[a-zA-Z0-9]{20,}/gi,
                /api[_-]?key[:=]\s*[a-zA-Z0-9]{20,}/gi,
                /secret[:=]\s*[a-zA-Z0-9]{20,}/gi
            ]
        },
        email: {
            selectors: [
                'input[type="email"]',
                'input[name*="email" i]',
                'input[name*="e-mail" i]',
                'input[id*="email" i]',
                'input[id*="e-mail" i]',
                'input[placeholder*="email" i]',
                'input[placeholder*="e-mail" i]'
            ],
            regex: [
                /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g
            ],
            excludeDomains: ['example.com', 'test.com', 'localhost']
        },
        username: {
            selectors: [
                'input[name*="username" i]',
                'input[name*="user" i]',
                'input[name*="login" i]',
                'input[id*="username" i]',
                'input[id*="user" i]',
                'input[id*="login" i]',
                'input[type="email"][name*="user" i]',
                'input[type="text"][name*="username" i]'
            ],
            regex: [
                /\b(username|user|login)[:=]\s*([a-zA-Z0-9._-]{3,})\b/gi
            ]
        },
        creditCard: {
            regex: [
                /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
            ]
        }
    };

    // State
    let detectedCount = 0;
    let processedElements = new WeakSet();
    let observer = null;

    // Clear all blurred elements
    function clearAllBlurred() {
        // Remove blur classes and attributes
        document.querySelectorAll('.credential-blurred').forEach(el => {
            el.classList.remove('credential-blurred');
            el.removeAttribute('data-credential-type');
            el.style.removeProperty('--blur-intensity');
            el.removeAttribute('title');
        });
        
        // Reset processed elements
        processedElements = new WeakSet();
        detectedCount = 0;
        updateBadge();
    }

    // Load settings from storage
    function loadSettings() {
        chrome.storage.sync.get(['enabled', 'blurIntensity', 'detectPasswords', 'detectApiKeys', 'detectEmails', 'detectUsernames', 'detectCreditCards'], (result) => {
            const wasEnabled = CONFIG.enabled;
            
            CONFIG.enabled = result.enabled !== undefined ? result.enabled : true;
            CONFIG.blurIntensity = result.blurIntensity || 8;
            CONFIG.detectPasswords = result.detectPasswords !== undefined ? result.detectPasswords : true;
            CONFIG.detectApiKeys = result.detectApiKeys !== undefined ? result.detectApiKeys : true;
            CONFIG.detectEmails = result.detectEmails !== undefined ? result.detectEmails : true;
            CONFIG.detectUsernames = result.detectUsernames !== undefined ? result.detectUsernames : true;
            CONFIG.detectCreditCards = result.detectCreditCards !== undefined ? result.detectCreditCards : true;
            
            // Clear existing blurred elements when settings change
            clearAllBlurred();
            
            // Stop observer if it exists
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            
            if (CONFIG.enabled) {
                startDetection();
            } else {
                stopDetection();
            }
        });
    }

    // Initialize
    function init() {
        loadSettings();
        
        // Listen for settings changes
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync') {
                loadSettings();
            }
        });
    }

    // Start detection
    function startDetection() {
        // Clear any existing observer
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        
        // Initial scan
        scanPage();
        
        // Watch for dynamic content
        observer = new MutationObserver((mutations) => {
            let shouldRescan = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    shouldRescan = true;
                }
            });
            
            if (shouldRescan) {
                // Debounce rescanning
                setTimeout(() => scanPage(), 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Stop detection
    function stopDetection() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        
        // Remove all blur effects
        document.querySelectorAll('.credential-blurred').forEach(el => {
            el.classList.remove('credential-blurred');
            el.removeAttribute('data-credential-type');
        });
        
        detectedCount = 0;
        updateBadge();
    }

    // Scan page for credentials
    function scanPage() {
        if (!CONFIG.enabled) return;

        // Detect password fields
        if (CONFIG.detectPasswords) {
            detectPasswordFields();
        }

        // Detect email input fields first (before username to avoid conflicts)
        if (CONFIG.detectEmails) {
            detectEmailFields();
        }

        // Detect username fields
        if (CONFIG.detectUsernames) {
            detectUsernameFields();
        }

        // Detect API keys and tokens in text
        if (CONFIG.detectApiKeys) {
            detectApiKeys();
        }

        // Detect email addresses in text content
        if (CONFIG.detectEmails) {
            detectEmails();
        }

        // Detect credit card numbers
        if (CONFIG.detectCreditCards) {
            detectCreditCards();
        }

        updateBadge();
    }

    // Detect password input fields
    function detectPasswordFields() {
        PATTERNS.password.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(input => {
                if (!processedElements.has(input) && !input.classList.contains('credential-blurred')) {
                    blurElement(input, 'password');
                    processedElements.add(input);
                    detectedCount++;
                }
            });
        });
    }

    // Detect username input fields
    function detectUsernameFields() {
        PATTERNS.username.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(input => {
                // Skip email input fields (they're handled separately)
                if (input.type === 'email') return;
                
                if (!processedElements.has(input) && !input.classList.contains('credential-blurred')) {
                    blurElement(input, 'username');
                    processedElements.add(input);
                    detectedCount++;
                }
            });
        });
    }

    // Detect email input fields
    function detectEmailFields() {
        PATTERNS.email.selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(input => {
                if (!processedElements.has(input) && !input.classList.contains('credential-blurred')) {
                    blurElement(input, 'email');
                    processedElements.add(input);
                    detectedCount++;
                }
            });
        });
    }

    // Detect API keys in text content
    function detectApiKeys() {
        PATTERNS.apiKey.regex.forEach(regex => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (parent && parent.classList.contains('credential-blurred')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodesToProcess = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.length >= 20) {
                    nodesToProcess.push(node);
                }
            }

            nodesToProcess.forEach(textNode => {
                const text = textNode.textContent;
                const matches = [...text.matchAll(regex)];
                
                if (matches.length > 0) {
                    const parent = textNode.parentElement;
                    if (!parent || parent.classList.contains('credential-blurred')) return;
                    
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    
                    matches.forEach(match => {
                        // Add text before match
                        if (match.index > lastIndex) {
                            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                        }
                        
                        // Add blurred span for match
                        const span = document.createElement('span');
                        span.className = 'credential-blurred';
                        span.setAttribute('data-credential-type', 'api-key');
                        span.style.setProperty('--blur-intensity', `${CONFIG.blurIntensity}px`);
                        span.textContent = match[0];
                        fragment.appendChild(span);
                        
                        lastIndex = match.index + match[0].length;
                        detectedCount++;
                    });
                    
                    // Add remaining text
                    if (lastIndex < text.length) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                    }
                    
                    // Replace the original text node
                    if (fragment.childNodes.length > 0) {
                        parent.replaceChild(fragment, textNode);
                    }
                }
            });
        });
    }

    // Detect email addresses
    function detectEmails() {
        PATTERNS.email.regex.forEach(regex => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // Skip if parent is already blurred or is an input/textarea
                        if (parent && (parent.classList.contains('credential-blurred') || 
                            parent.tagName === 'INPUT' || parent.tagName === 'TEXTAREA')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // Skip if parent is inside a link (emails in links are usually intentional)
                        if (parent && parent.closest('a')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodesToProcess = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.length >= 5) {
                    nodesToProcess.push(node);
                }
            }

            nodesToProcess.forEach(textNode => {
                const text = textNode.textContent;
                const matches = [...text.matchAll(regex)];
                
                if (matches.length > 0) {
                    const parent = textNode.parentElement;
                    if (!parent || parent.classList.contains('credential-blurred')) return;
                    
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    
                    matches.forEach(match => {
                        const email = match[0];
                        const domain = email.split('@')[1];
                        if (PATTERNS.email.excludeDomains.includes(domain)) {
                            // Skip this match but add the text
                            if (match.index > lastIndex) {
                                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index + email.length)));
                            }
                            lastIndex = match.index + email.length;
                            return;
                        }
                        
                        // Add text before match
                        if (match.index > lastIndex) {
                            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                        }
                        
                        // Add blurred span for email
                        const span = document.createElement('span');
                        span.className = 'credential-blurred';
                        span.setAttribute('data-credential-type', 'email');
                        span.style.setProperty('--blur-intensity', `${CONFIG.blurIntensity}px`);
                        span.textContent = email;
                        fragment.appendChild(span);
                        
                        lastIndex = match.index + email.length;
                        detectedCount++;
                    });
                    
                    // Add remaining text
                    if (lastIndex < text.length) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                    }
                    
                    // Only replace if we have matches to blur
                    if (fragment.childNodes.length > 0) {
                        parent.replaceChild(fragment, textNode);
                    }
                }
            });
        });
    }

    // Detect credit card numbers
    function detectCreditCards() {
        PATTERNS.creditCard.regex.forEach(regex => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (parent && parent.classList.contains('credential-blurred')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodesToProcess = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent && node.textContent.length >= 16) {
                    nodesToProcess.push(node);
                }
            }

            nodesToProcess.forEach(textNode => {
                const text = textNode.textContent;
                const matches = [...text.matchAll(regex)];
                
                if (matches.length > 0) {
                    const parent = textNode.parentElement;
                    if (!parent || parent.classList.contains('credential-blurred')) return;
                    
                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    
                    matches.forEach(match => {
                        const cleaned = match[0].replace(/[-\s]/g, '');
                        if (cleaned.length === 16 && /^\d+$/.test(cleaned)) {
                            // Add text before match
                            if (match.index > lastIndex) {
                                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                            }
                            
                            // Add blurred span for credit card
                            const span = document.createElement('span');
                            span.className = 'credential-blurred';
                            span.setAttribute('data-credential-type', 'credit-card');
                            span.style.setProperty('--blur-intensity', `${CONFIG.blurIntensity}px`);
                            span.textContent = match[0];
                            fragment.appendChild(span);
                            
                            lastIndex = match.index + match[0].length;
                            detectedCount++;
                        } else {
                            // Not a valid credit card, skip but advance index
                            lastIndex = match.index + match[0].length;
                        }
                    });
                    
                    // Add remaining text
                    if (lastIndex < text.length) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                    }
                    
                    if (fragment.childNodes.length > 0) {
                        parent.replaceChild(fragment, textNode);
                    }
                }
            });
        });
    }

    // Walk through text nodes
    function walkTextNodes(callback) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script and style tags
                    const parent = node.parentElement;
                    if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Skip already processed elements
                    if (parent && parent.classList.contains('credential-blurred')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            callback(node);
        }
    }

    // Apply blur to element
    function blurElement(element, type) {
        if (!element || processedElements.has(element)) return;
        
        element.classList.add('credential-blurred');
        element.setAttribute('data-credential-type', type);
        element.style.setProperty('--blur-intensity', `${CONFIG.blurIntensity}px`);
        
        // Add hover tooltip
        element.setAttribute('title', 'Sensitive data - hover to reveal');
        
        processedElements.add(element);
    }

    // Update badge with detection count
    function updateBadge() {
        chrome.runtime.sendMessage({
            action: 'updateBadge',
            count: detectedCount
        }).catch(() => {
            // Ignore errors (extension might not be ready)
        });
    }

    // Handle messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getCount') {
            sendResponse({ count: detectedCount });
        }
        return true;
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

