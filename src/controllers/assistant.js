const { createAssistant } = require("../utils/assistant");
const { getFirstAgentByUserId } = require("../services/assistant");

const db = require('../db/sqlite');

async function createFirstAssistant(req, res) {
  const { user_id } = req.user;
  const {
    name,
    voice,
    model,
    industry,
    target_audience,
    main_goal,
    custom_script,
    speaking_speed,
    enthusiasm,
    use_small_talk,
    handle_objections,
    tone,
    formality,
    scriptMethod,
    websiteUrl,
    uploadedFile
  } = req.body;

  try {
    const instructions = `
      Assistant Name: ${name || "My AI Agent"}
      Industry: ${industry || "General"}
      Target Audience: ${target_audience || "General audience"}
      Main Goal: ${main_goal || "Provide assistance and support"}
      Script: ${custom_script || "Default sales or support script"}

      Speaking Speed: ${speaking_speed || 1.0}x (Slower = 0.5x, Faster = 2.0x)
      Enthusiasm Level: ${enthusiasm || 5} (1 = Calm, 10 = Energetic)

      Small Talk Enabled: ${use_small_talk ? "Yes" : "No"}
      Handle Objections: ${handle_objections ? "Yes" : "No"}

      Tone: ${tone || "neutral"}
      Formality: ${formality || "balanced"}
    `.trim();

    const assistant = await createAssistant(`First agent with ${name}`, { voice, instructions });
    const payload = {
      user_id,
      assistant_id: assistant.id,
      name,
      voice: assistant.voice?.voiceId || voice,
      model: assistant.model?.model || model,
      instructions,
      industry,
      target_audience,
      main_goal,
      custom_script,
      speaking_speed,
      enthusiasm,
      use_small_talk,
      handle_objections,
      tone,
      formality,
      scriptMethod,
      websiteUrl,
      uploadedFile,
    }

    // Save assistant to local DB
    db.all(
      `INSERT INTO assistants (
        user_id,
        assistant_id,
        name,
        voice,
        model,
        instructions,
        industry,
        target_audience,
        main_goal,
        custom_script,
        speaking_speed,
        enthusiasm,
        use_small_talk,
        handle_objections,
        tone,
        formality,
        scriptMethod,
        websiteUrl,
        uploadedFile
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(payload),
      function (err) {
        if (err) {
          console.error("DB insert error:", err);
          return res
            .status(500)
            .json({ error: "Failed to save assistant to database" });
        }

        res.json({ status: 200, assistant: payload });
      }
    );
  } catch (err) {
    console.error(
      "Vapi assistant creation failed:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to create Vapi assistant" });
  }
}

async function getAssistant(req, res) {
  const { user_id } = req.user

  try {
    const firstAgent = await getFirstAgentByUserId(user_id);
    if (!firstAgent) return res.status(400).send('No available assistants.');
    return res.status(200).json({ assistant: firstAgent });
  } catch (err) {
    console.error("DB error:", err.message);
    return res.status(500).send('Server error!');
  }
}

module.exports = { createFirstAssistant, getAssistant }