const axios = require('axios');

const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function createAssistant(name, { voice, instructions }) {
  const response = await axios.post(
    "https://api.vapi.ai/assistant",
    {
      model: {
        messages: [
          {
            content: instructions,
            role: "assistant",
          },
        ],
        model: "chatgpt-4o-latest",
        provider: "openai",
        temperature: 0.5,
        maxTokens: 250,
        emotionRecognitionEnabled: true,
      },
      voice: {
        cachingEnabled: true,
        provider: "11labs",
        voiceId: voice || "IKne3meq5aSn9XLyUdCD",
        chunkPlan: {
          enabled: true,
          minCharacters: 30,
          punctuationBoundaries: ["。"],
        },
      },

      name: name,
      stopSpeakingPlan: {
        numWords: 0,
        voiceSeconds: 0.2,
        backoffSeconds: 1,
        acknowledgementPhrases: [
          "i understand",
          "i see",
          "i got it",
          "i hear you",
          "im listening",
          "im with you",
          "right",
          "okay",
          "ok",
          "sure",
          "alright",
          "got it",
          "understood",
          "yeah",
          "yes",
          "uh-huh",
          "mm-hmm",
          "gotcha",
          "mhmm",
          "ah",
          "yeah okay",
          "yeah sure",
        ],
        interruptionPhrases: [
          "stop",
          "shut",
          "up",
          "enough",
          "quiet",
          "silence",
          "but",
          "dont",
          "not",
          "no",
          "hold",
          "wait",
          "cut",
          "pause",
          "nope",
          "nah",
          "nevermind",
          "never",
          "bad",
          "actually",
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function getVapiAssistant(assistant_id) {
  try {
    const assistant = await axios.get(`https://api.vapi.ai/assistant/${assistant_id}`, {
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY}`,
        "Content-Type": "application/json",
      }
    }).then(res => res.data);
    return assistant;
  } catch (_) {
    return null;
  }
}

module.exports = { createAssistant, getVapiAssistant }