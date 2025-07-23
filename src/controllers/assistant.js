const { createVapiAssistant, createInstructions, updateVapiAssistant } = require("../utils/assistant");
const { getFirstAgentByUserId, updateAssistantByUserId } = require("../services/assistant");

const db = require('../db/sqlite');

async function createFirstAssistant(req, res) {
  const { user_id } = req.user;
  const {
    voice,
    model,
    business_name,
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
    const agentName = `First agent for ${business_name}`
    const instructions = createInstructions({ ...req.body, name: agentName });

    const assistant = await createVapiAssistant(agentName, { voice, instructions });
    const payload = {
      user_id,
      assistant_id: assistant.id,
      name: agentName,
      voice: assistant.voice?.voiceId || voice,
      model: assistant.model?.model || model,
      instructions,
      industry,
      business_name,
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
        business_name,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

async function updateAssistant(req, res) {
  const { user_id } = req.user;

  try {
    const assistant = await getFirstAgentByUserId(user_id);
    const newAssistant = { ...assistant, ...req.body }
    const instructions = createInstructions(newAssistant)
    await updateAssistantByUserId(user_id, { ...newAssistant, instructions })
    await updateVapiAssistant(assistant.assistant_id, { voice: newAssistant.voice, instructions });
    return res.status(200).json({ data: newAssistant });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error!');
  }
}

module.exports = { createFirstAssistant, getAssistant, updateAssistant }