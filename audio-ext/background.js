// Background service worker for OpenAI API calls

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'processAndGenerateAudio') {
    handleProcessAndGenerateAudio(request.text, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function handleProcessAndGenerateAudio(text, sendResponse) {
  try {
    // Get API key and model from storage
    const result = await chrome.storage.local.get(['openaiApiKey', 'gptModel']);
    const apiKey = result.openaiApiKey;
    const model = result.gptModel || 'gpt-3.5-turbo'; // Default model

    if (!apiKey) {
      sendResponse({ 
        success: false, 
        error: 'OpenAI API key not found. Please set it in the extension popup.' 
      });
      return;
    }

    // Step 1: Process text with GPT
    const processedText = await processTextWithGPT(text, apiKey, model);
    
    // Step 2: Generate audio with TTS
    const audioBlob = await generateAudioWithTTS(processedText, apiKey);
    
    // Step 3: Convert blob to data URL (works in service workers)
    const audioDataUrl = await blobToDataURL(audioBlob);
    
    sendResponse({ 
      success: true, 
      audioUrl: audioDataUrl,
      processedText: processedText
    });
  } catch (error) {
    console.error('Error processing and generating audio:', error);
    sendResponse({ 
      success: false, 
      error: error.message || 'Failed to process and generate audio' 
    });
  }
}

async function processTextWithGPT(text, apiKey, model = 'gpt-3.5-turbo') {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that improves text for natural speech reading. Format the text to be clear and easy to read aloud while maintaining the original meaning.'
        },
        {
          role: 'user',
          content: `Improve and format this text for natural speech reading, maintaining meaning:\n\n${text}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `GPT API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function generateAudioWithTTS(text, apiKey) {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: 'alloy',
      response_format: 'mp3'
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `TTS API error: ${response.status}`);
  }

  return await response.blob();
}

// Convert blob to data URL (works in service workers)
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

