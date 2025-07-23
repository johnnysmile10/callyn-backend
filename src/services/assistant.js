const db = require('../db/sqlite')

function getFirstAgentByUserId(user_id) {
  return new Promise((resolve) => {
    db.all(
      "SELECT * FROM assistants WHERE user_id = ?",
      [user_id],
      (err, rows) => {
        if (err || !rows.length) resolve(null);
        resolve(rows[0]);
      }
    );
  });
}

function updateAssistantByUserId(user_id, payload) {
  const { name, business_name, custom_script,
    enthusiasm, formality,
    tone,
    instructions,
    handle_objections,
    industry,
    main_goal,
    model,
    scriptMethod,
    speaking_speed,
    target_audience,
    use_small_talk,
    voice,
    websiteUrl,
    uploadedFile } = payload;
  return new Promise((resolve, reject) => [
    db.all(`UPDATE assistants 
        SET name = ?,
        business_name = ?,
        voice = ?,
        model = ?,
        instructions = ?,
        industry = ?,
        target_audience = ?,
        main_goal = ?,
        custom_script = ?,
        speaking_speed = ?,
        enthusiasm = ?,
        use_small_talk = ?,
        handle_objections = ?,
        tone = ?,
        formality = ?,
        scriptMethod = ?,
        websiteUrl = ?,
        uploadedFile = ?
        WHERE user_id = ?`, [name, business_name, voice, model, instructions, industry, target_audience, main_goal, custom_script, speaking_speed,
      enthusiasm, use_small_talk, handle_objections, tone, formality, scriptMethod, websiteUrl, uploadedFile, user_id
    ], (err) => {
      if (err) reject(err);
      resolve();
    })
  ])
}

module.exports = { getFirstAgentByUserId, updateAssistantByUserId }