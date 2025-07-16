const { getCampaignsByUserId } = require("../services/campaign");
const { getCallsByCampaigns } = require("../utils/call");

async function getCall(req, res) {
  const { user_id } = req.user;
  const campaigns = await getCampaignsByUserId(user_id);
  console.log(campaigns);
  const calls = await getCallsByCampaigns(campaigns);

  return res.status(200).send(calls);
}

module.exports = { getCall }