# Credential Blurrer - Chrome Extension

A Chrome extension that automatically detects and blurs sensitive credentials (passwords, API keys, emails, credit cards) on web pages to protect privacy when screen sharing or recording.

## Features

- 🔒 **Automatic Detection**: Detects passwords, API keys, email addresses, and credit card numbers
- 👁️ **Hover to Reveal**: Temporarily reveal blurred credentials by hovering over them
- ⚙️ **Customizable**: Enable/disable specific credential types, adjust blur intensity
- 🚀 **Lightweight**: Runs entirely client-side, no external API calls
- 🔄 **Dynamic Content**: Automatically detects credentials in dynamically loaded content

## Installation

**📖 For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md)**

### Quick Install

1. Create icons (optional - see INSTALLATION.md)
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" → Select `credential-blurrer` folder
5. Done! Extension is now active.

### Using the Extension

- **Automatic**: Runs on all web pages automatically
- **Toggle**: Click extension icon to enable/disable
- **Settings**: Click "Options" to customize
- **Reveal**: Hover over blurred credentials to temporarily see them

## Project Structure

```
credential-blurrer/
├── manifest.json          # Extension configuration
├── content.js            # Main content script (runs on web pages)
├── background.js         # Background service worker
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic
├── options.html          # Options page
├── options.js           # Options page logic
├── styles/
│   ├── content.css     # Styles for blurred elements
│   ├── popup.css       # Popup styling
│   └── options.css     # Options page styling
└── icons/              # Extension icons (create these)
```

## Detection Patterns

### Password Fields
- `<input type="password">`
- Inputs with `name` or `id` containing "password", "passwd", or "pwd"

### API Keys & Tokens
- OpenAI/Stripe keys: `sk-[a-zA-Z0-9]{32,}`
- Generic tokens: `[a-zA-Z0-9]{40,}`
- Bearer tokens: `Bearer [a-zA-Z0-9._-]+`
- Token patterns: `token[:=]\s*[a-zA-Z0-9]{20,}`

### Email Addresses
- Standard email regex: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`

### Credit Card Numbers
- Pattern: `\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b`
- Validates 16-digit format

## Privacy & Security

- **100% Local Processing**: All detection and blurring happens in your browser
- **No Data Collection**: No credentials are stored or transmitted
- **No External APIs**: No data is sent to external servers
- **Open Source**: Review the code to verify privacy

## Browser Compatibility

- Chrome/Chromium (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Development

### Creating Icons

You'll need to create icon files:
- `icons/icon16.png` (16x16)
- `icons/icon48.png` (48x48)
- `icons/icon128.png` (128x128)

You can use any image editor or online icon generator. A simple lock icon (🔒) works well.

### Testing

1. Load the extension in developer mode
2. Visit various websites to test detection
3. Check the popup for detection counts
4. Test hover-to-reveal functionality
5. Verify settings persistence

## Troubleshooting

**Extension not working?**
- Check if it's enabled in the popup
- Reload the page after enabling
- Check browser console for errors

**Too many false positives?**
- Disable specific detection types in options
- Adjust blur intensity
- Report issues for pattern improvements

**Performance issues?**
- The extension uses efficient selectors and debouncing
- Large pages may take a moment to scan
- Detection runs asynchronously to avoid blocking

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Contributions welcome! Areas for improvement:
- Better detection patterns
- Performance optimizations
- Additional credential types
- UI/UX improvements

