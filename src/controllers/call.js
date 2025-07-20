const { getFirstAgentByUserId } = require("../services/assistant");
const { createCallByUserId, getCallsByUserId } = require("../services/call");
const { getCampaignsByUserId } = require("../services/campaign");
const { getContactById } = require("../services/contact");
const { getPhoneNumbersByUserId } = require("../services/phone");
const { getCallsByCampaigns, createVapiCall } = require("../utils/call");

async function getCall(req, res) {
  const { user_id } = req.user;
  // const campaigns = await getCampaignsByUserId(user_id);
  // const calls = await getCallsByCampaigns(campaigns);

  const calls = await getCallsByUserId(user_id);

  return res.status(200).send(calls);
}

async function createCall(req, res) {
  const { user_id } = req.user;
  const { contact_id } = req.params;

  const contact = await getContactById(contact_id);
  if (!contact || contact.user_id !== user_id) {
    return res.status(400).send('Invalid contact.');
  }

  const firstAgent = await getFirstAgentByUserId(user_id);
  if (!firstAgent) {
    return res.status(400).send('No available assistants.');
  }

  const phones = await getPhoneNumbersByUserId(user_id);
  if (!phones.length) {
    return res.status(400).send('No available phone numbers.');
  }

  const vapiCall = await createVapiCall(firstAgent.assistant_id, phones[0].id, {
    name: contact.name,
    email: contact.email,
    number: contact.number
  });
  if (!vapiCall) {
    return res.status(400).send('Call failed.');
  }

  try {
    await createCallByUserId(user_id, { assistant_id: firstAgent.assistant_id, call_id: vapiCall.id });
    return res.status(200).send('Call started.');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error.');
  }
}

module.exports = { getCall, createCall }