# Installation Guide

## Step 1: Install the Extension

1. **Open Chrome Extensions Page**
   - Open Google Chrome browser
   - Navigate to `chrome://extensions/`
   - Or go to: Menu (three dots) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner of the extensions page

3. **Load the Extension**
   - Click the "Load unpacked" button
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Pin the Extension (Optional)**
   - Click the puzzle piece icon (Extensions) in the Chrome toolbar
   - Find "Audio Extension" and click the pin icon to keep it visible

## Step 2: Configure OpenAI API Key

### Getting Your OpenAI API Key

1. **Create an OpenAI Account** (if you don't have one)
   - Go to [https://platform.openai.com](https://platform.openai.com)
   - Sign up or log in

2. **Generate an API Key**
   - Navigate to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Give it a name (e.g., "Chrome Extension")
   - Copy the key immediately (it starts with `sk-` and won't be shown again)

### Entering the API Key in the Extension

1. **Open Extension Popup**
   - Click the extension icon in your Chrome toolbar
   - The settings popup will open

2. **Enter Your API Key**
   - In the "OpenAI API Key" field, paste your API key (starts with `sk-`)
   - The key is stored locally on your computer and never shared

3. **Select GPT Model**
   - Choose your preferred GPT model from the dropdown:
     - **GPT-3.5 Turbo** (Recommended) - Fast and cost-effective
     - **GPT-4** - More accurate, slower and more expensive
     - **GPT-4 Turbo** - Enhanced version of GPT-4
     - **GPT-4o** - Latest optimized model
   - The model selection affects how the text is processed before audio generation

4. **Save Settings**
   - Click "Save Settings" button
   - You should see a success message
   - The extension will automatically attempt to generate audio on the current page

## Step 3: Using the Extension

### Generate Audio from a Web Page

1. **Navigate to any webpage** with text content (articles, blog posts, etc.)

2. **Click the Extension Icon** or use the "Generate Audio" button in the popup

3. **Wait for Processing**
   - The extension will extract main content from the page
   - Process it with your selected GPT model
   - Generate audio using OpenAI's Text-to-Speech API
   - A movable audio player widget will appear

### Audio Player Controls

- **Play/Pause Button** (▶/⏸) - Control audio playback
- **Regenerate Button** (🔄) - Create new audio from current page content
- **Download Button** (⬇) - Save the audio file as MP3
- **Close Button** (×) - Hide the audio player widget

### Moving the Widget

- Click and drag the header (purple bar) to move the audio player anywhere on the screen
- The position is saved and will be remembered for next time

## Troubleshooting

### API Key Issues

- **"Invalid API key format"**: Make sure your key starts with `sk-`
- **"API key not found"**: Go to extension popup and save your API key again
- **API Errors**: Check that your OpenAI account has credits and the API key has proper permissions

### Model Selection

- **GPT-3.5 Turbo**: Best for most use cases, fastest and cheapest
- **GPT-4**: Use for more complex content that needs better understanding
- If you get model errors, try switching to GPT-3.5 Turbo

### Audio Generation Issues

- **No content extracted**: The page might not have recognizable main content. Try a different webpage.
- **Audio generation fails**: Check your OpenAI account balance and API key permissions
- **Widget doesn't appear**: Refresh the page and try again

## Requirements

- **Chrome Browser**: Version 88 or higher
- **OpenAI API Key**: With access to:
  - GPT models (GPT-3.5-turbo, GPT-4, etc.)
  - Text-to-Speech API (tts-1)
- **Internet Connection**: Required for API calls

## Security Notes

- Your API key is stored locally in Chrome's storage
- It is never transmitted to any server except OpenAI's API
- Never share your API key with anyone
- You can revoke your API key anytime from OpenAI's dashboard

## Support

If you encounter issues:
1. Check that your API key is valid and has credits
2. Verify the selected model is available in your OpenAI account
3. Check Chrome's console for error messages (F12 → Console)
4. Make sure you're on a webpage with text content



