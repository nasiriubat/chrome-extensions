# chrome-extension
# Installing the Chrome Extensions Locally

Follow these steps to download and load the extensions into Chrome.

## 1. Download the Extension Folder

1. Go to the GitHub repository page of the extension.
2. Click the green **Code** button.
3. Choose **Download ZIP**.
4. After the download finishes, **unzip** the archive somewhere on your machine  
   (for example: `Desktop/credential-blurrer` or `Desktop/pagepod`).

> You will load this unzipped folder into Chrome.

## 2. Open Chrome Extensions Page

1. Open **Google Chrome** (or any Chromium-based browser that supports extensions).
2. In the address bar, go to: Open Chrome and navigate to `chrome://extensions/`
3. In the top-right corner, enable **Developer mode**  
(toggle the switch so it turns on).

## 3. Load the Unpacked Extension

1. Click the **Load unpacked** button in the top-left area.
2. In the file dialog, navigate to the **unzipped folder** of the extension  
(the folder that contains `manifest.json`).
3. Select the folder and click **Select Folder** / **Open**.
4. The extension should now appear in the list with its name and icon.

If you update the code, click the **Reload** button on the extension card in `chrome://extensions` to apply changes.

## 4. Pin and Use the Extension

1. Click the **puzzle piece** icon (Extensions) in the Chrome toolbar.
2. Find your extension in the list and click the **pin** icon to pin it.
3. Now you can:
- Click the extension icon to open its popup (if it has one), or
- Just visit any webpage where the extension activates automatically
  (e.g., blurring credentials or adding a “Read this page” button, depending on the extension).

## 5. Removing the Extension

If you ever want to remove it:

1. Go to `chrome://extensions`.
2. Find the extension.
3. Click **Remove** and confirm.

That’s it — you’re running the extension locally without publishing it to the Chrome Web Store.

