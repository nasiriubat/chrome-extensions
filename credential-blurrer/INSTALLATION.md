# Credential Blurrer - Installation Guide

Complete step-by-step guide to install and use the Credential Blurrer Chrome extension.

## 📋 Prerequisites

- Google Chrome browser (or any Chromium-based browser)
- The `credential-blurrer` folder with all extension files

## 🚀 Installation Steps

### Step 1: Create Extension Icons (Optional but Recommended)

The extension needs icon files to display properly. You have three options:

#### Option A: Quick Placeholder Icons (Fastest - 2 minutes)

1. Create a folder named `icons` inside the `credential-blurrer` directory
2. Create three simple colored square images:
   - **icon16.png** - 16x16 pixels, solid color #667eea (purple-blue)
   - **icon48.png** - 48x48 pixels, solid color #667eea
   - **icon128.png** - 128x128 pixels, solid color #667eea
3. You can use:
   - **Windows Paint**: Create new image → Resize to exact dimensions → Fill with color #667eea → Save as PNG
   - **Online tool**: https://www.iloveimg.com/resize-image → Resize to exact size → Download
   - **Any image editor**: GIMP, Photoshop, etc.

#### Option B: Use Online Icon Generator (Best Quality - 5 minutes)

1. Visit https://www.favicon-generator.org/ or https://realfavicongenerator.net/
2. Upload a lock emoji (🔒) or create a simple lock icon
3. Download the generated icons
4. Rename them to `icon16.png`, `icon48.png`, `icon128.png`
5. Place them in the `icons/` folder inside `credential-blurrer`

#### Option C: Skip Icons (For Quick Testing)

- The extension will work without icons
- Chrome will show a default gray puzzle piece icon
- You can add icons later

**Note**: If you skip icons, make sure the `icons/` folder exists (even if empty) or remove icon references from `manifest.json`.

### Step 2: Load Extension in Chrome

1. **Open Google Chrome**

2. **Navigate to Extensions Page**
   - Type `chrome://extensions/` in the address bar and press Enter
   - Or: Click the three dots menu (⋮) → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle the switch labeled **"Developer mode"** in the top-right corner
   - It should turn blue when enabled

4. **Load the Extension**
   - Click the **"Load unpacked"** button (appears after enabling Developer mode)
   - Navigate to and select the `credential-blurrer` folder
   - Click "Select Folder" (Windows) or "Open" (Mac/Linux)

5. **Verify Installation**
   - You should see "Credential Blurrer" appear in your extensions list
   - The extension icon should appear in your Chrome toolbar (top-right)
   - Status should show "Enabled"

### Step 3: Test the Extension

1. **Visit a Website with Login Forms**
   - Try: GitHub (github.com), Gmail (gmail.com), or any site with password fields
   - Password input fields should be automatically blurred

2. **Check Detection**
   - Click the extension icon in the toolbar
   - You should see a popup showing "Detected Credentials: X"
   - Toggle switches should be visible

3. **Test Hover-to-Reveal**
   - Hover your mouse over a blurred password field
   - It should temporarily become clear
   - Move mouse away to blur again

## 🎯 Using the Extension

### Basic Usage

- **Automatic**: The extension runs automatically on all websites
- **No action needed**: Credentials are blurred as soon as pages load
- **Hover to reveal**: Move your mouse over blurred credentials to see them temporarily

### Extension Popup Controls

Click the extension icon to access:

- **Enable Blurring Toggle**: Turn the extension on/off
- **Detection Counter**: See how many credentials were found
- **Detection Types**: Enable/disable specific types (passwords, API keys, emails, credit cards)
- **Refresh Page**: Reload current page to re-scan
- **Options**: Open settings page

### Options Page

Access via popup → "Options" button, or right-click extension → Options:

- **Blur Intensity**: Adjust how strong the blur effect is (2-20px)
- **Enable/Disable**: Master toggle for the extension
- **Detection Types**: Choose which credential types to detect
- **Save Settings**: Click "Save Settings" to apply changes
- **Reset**: Restore default settings

## ⚙️ Configuration

### Default Settings

- **Enabled**: Yes
- **Blur Intensity**: 8px
- **Detect Passwords**: Yes
- **Detect API Keys**: Yes
- **Detect Emails**: Yes
- **Detect Credit Cards**: Yes

### Customizing Detection

1. Click extension icon → "Options"
2. Adjust settings as needed
3. Click "Save Settings"
4. Reload pages to apply changes

### Disabling Specific Types

If you get too many false positives:

1. Open Options page
2. Uncheck the credential type causing issues
3. Save settings
4. Reload pages

## 🔧 Troubleshooting

### Extension Not Working?

**Check these:**

1. **Is it enabled?**
   - Click extension icon
   - Make sure "Enable Blurring" toggle is ON (blue)

2. **Reload the page**
   - After enabling, reload the webpage (F5 or Ctrl+R)
   - The extension scans pages when they load

3. **Check browser console**
   - Press F12 to open Developer Tools
   - Look for errors in the Console tab
   - Report any errors you see

4. **Verify installation**
   - Go to `chrome://extensions/`
   - Make sure "Credential Blurrer" shows as "Enabled"
   - Check for any error messages

### Icons Not Showing?

- Extension works fine without icons
- Chrome shows default placeholder icon
- To add icons: See Step 1 above

### Too Many False Positives?

- Go to Options → Uncheck problematic detection types
- Adjust blur intensity
- The extension learns common patterns but may flag non-credentials

### Performance Issues?

- The extension is lightweight and shouldn't slow pages
- Large pages may take a moment to scan
- If pages feel slow, disable email detection (most common false positives)

## 🗑️ Uninstalling

1. Go to `chrome://extensions/`
2. Find "Credential Blurrer"
3. Click the "Remove" button
4. Confirm removal

## 🔄 Updating the Extension

When you make changes to the code:

1. Go to `chrome://extensions/`
2. Find "Credential Blurrer"
3. Click the refresh/reload icon (🔄) on the extension card
4. Or use the "Refresh Page" button in the popup

## 📱 Browser Compatibility

- ✅ **Chrome** (recommended)
- ✅ **Microsoft Edge** (Chromium-based)
- ✅ **Brave Browser**
- ✅ **Opera** (Chromium-based)
- ✅ **Other Chromium-based browsers**

**Not compatible with:**
- ❌ Firefox (uses different extension format)
- ❌ Safari (uses different extension format)

## 🆘 Getting Help

### Common Issues

**"Extension could not be loaded"**
- Make sure you selected the `credential-blurrer` folder, not a parent folder
- Check that `manifest.json` exists in the folder

**"Icons missing"**
- Not critical - extension works without icons
- See Step 1 to create icons

**"Nothing is being blurred"**
- Make sure extension is enabled in popup
- Reload the page after enabling
- Check that detection types are enabled in Options

**"Extension keeps disabling"**
- Check Chrome's extension error page: `chrome://extensions/`
- Look for error messages
- Try reloading the extension

### Need More Help?

- Check `README.md` for detailed documentation
- Review `content.js` for detection patterns
- Check browser console (F12) for error messages

## ✅ Installation Checklist

- [ ] Created `icons/` folder (optional)
- [ ] Created icon files (optional)
- [ ] Opened `chrome://extensions/`
- [ ] Enabled Developer mode
- [ ] Clicked "Load unpacked"
- [ ] Selected `credential-blurrer` folder
- [ ] Verified extension appears in list
- [ ] Tested on a website with login forms
- [ ] Verified blurring works
- [ ] Tested hover-to-reveal
- [ ] Opened Options page
- [ ] Customized settings (optional)

## 🎉 You're All Set!

The extension is now installed and ready to protect your privacy. It will automatically blur credentials on all websites you visit.

**Pro Tip**: Keep the extension enabled when screen sharing or recording to protect sensitive information!

---

**Quick Reference:**
- **Extension Page**: `chrome://extensions/`
- **Options Page**: Right-click extension icon → Options
- **Popup**: Click extension icon in toolbar
- **Reload Extension**: Click refresh icon on extension card

