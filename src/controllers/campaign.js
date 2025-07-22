const { getPhoneNumbersByUserId } = require('../services/phone');
const { getCampaignsByUserId, createCampaignByUserId } = require("../services/campaign");
const { createAssistant } = require("../utils/assistant");
const { getCampaignName, createVapiCampaign } = require("../utils/campaign");
const { createCallByUserId } = require('../services/call');

async function createCampaign(req, res) {
  const { user_id } = req.user;
  const { agent, script, target_audience, customers, voice_settings } = req.body;

  const phones = await getPhoneNumbersByUserId(user_id);
  if (!phones || !phones.length) {
    return res.status(400).send('No active phone numbers!');
  }

  const instructions = `
          Script: ${script}
          Business: ${agent.businessContext}.
          Target Audience: ${target_audience}.
          Speaking Speed: ${voice_settings.speakingSpeed
    } (Slower: 0.5x, Normal: 1.0x, Faster: 2.0x).
          Enthusiasm: ${voice_settings.enthusiasm
    } (1 = Calm & Professional, 10 = Energetic & Enthusiastic).
          Tone: ${voice_settings.languageConfig.tone}.
          Formality: ${voice_settings.languageConfig.formality}.
        `.trim();

  try {
    const campaign_name = await getCampaignName(agent.businessContext, target_audience);
    // const campaign_name = 'New campaign'

    const assistant = await createAssistant(`${agent.name} agent`, { voice: voice_settings.languageConfig.voiceId, instructions });
    const campaign = await createVapiCampaign(campaign_name, phones[0].id, assistant.id, customers);

    await createCampaignByUserId(user_id, campaign);
    for (const call_id in campaign.calls) {
      await createCallByUserId(user_id, { assistant_id: assistant.id, call_id });
    }

    return res.status(200).json({ message: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error!');
  }
}

async function getCampaigns(req, res) {
  const { user_id } = req.user;

  const campaigns = await getCampaignsByUserId(user_id);

  return res.status(200).send(campaigns);
}

module.exports = { createCampaign, getCampaigns }