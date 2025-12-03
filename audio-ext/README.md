# Chrome Extension: Text-to-Audio with OpenAI

A Chrome extension that extracts main content from web pages, processes it with OpenAI GPT, and generates audio using OpenAI's Text-to-Speech API.

## Features

- **Content Extraction**: Automatically extracts main content from web pages
- **AI Processing**: Uses OpenAI GPT to improve text for natural speech reading
- **Audio Generation**: Converts processed text to speech using OpenAI TTS
- **Movable Widget**: Draggable audio player overlay
- **Audio Controls**: Play/pause, regenerate, and download functionality

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory

## Setup

1. Click the extension icon in your Chrome toolbar
2. Enter your OpenAI API key (starts with `sk-`)
3. Click "Save API Key"
4. Click "Generate Audio" or navigate to any webpage and click the extension icon again

## Usage

1. Navigate to any webpage with text content
2. Click the extension icon or use the "Generate Audio" button in the popup
3. The extension will:
   - Extract main content from the page
   - Process it with OpenAI GPT
   - Generate audio using OpenAI TTS
   - Display a movable audio player widget
4. Use the controls:
   - **Play/Pause**: Control audio playback
   - **Regenerate**: Create new audio from current page content
   - **Download**: Save the audio file as MP3
   - **Close**: Hide the audio player

## Requirements

- OpenAI API key with access to:
  - GPT-3.5-turbo (or GPT-4)
  - Text-to-Speech API (tts-1)

## Files Structure

- `manifest.json` - Extension configuration
- `content.js` - Content script for text extraction
- `background.js` - Service worker for API calls
- `overlay.html/css/js` - Audio player UI
- `popup.html/js` - Settings popup
- `icons/` - Extension icons

## Notes

- API key is stored locally in Chrome storage
- Audio is limited to ~4000 characters for optimal performance
- The widget position is saved and restored between sessions



