const axios = require('axios');

const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getCallsByCampaigns(campaigns) {
  return new Promise(async resolve => {
    try {
      const calls = await Promise.all(campaigns.map(campaign => {
        return new Promise(async resolve => {
          const call = await axios.get('https://api.vapi.ai/call', {
            params: {
              assistantId: campaign.assistant.id
            },
            headers: {
              Authorization: `Bearer ${VAPI_API_KEY}`
            }
          }).then(res => res.data);
          resolve(call.map(c => ({ ...c, campaign: campaign.name, assistant: campaign.assistant.name })))
        })
      }));
      resolve(calls.flat());
    } catch (err) {
      console.log(err);
      resolve([]);
    }
  })
}

async function getVapiCall(call_id) {
  return new Promise(async resolve => {
    try {
      const call = await axios.get(`https://api.vapi.ai/call/${call_id}`, {
        headers: {
          Authorization: `Bearer ${VAPI_API_KEY}`
        }
      }).then(res => res.data);
      resolve(call);
    } catch (err) {
      resolve(null);
    }
  });
}

async function createVapiCall(assistantId, phoneNumberId, customer) {
  return new Promise(async resolve => {
    try {
      const call = await axios.post('https://api.vapi.ai/call', {
        assistantId, phoneNumberId, customer
      }, {
        headers: {
          Authorization: `Bearer ${VAPI_API_KEY}`
        }
      }).then(res => res.data);
      resolve(call);
    } catch (err) {
      console.log(err);
      resolve(null);
    }
  })
}

function getCallWithDuration(call) {
  return {
    ...call,
    duration: call.messages.reduce((tot, m) => tot + m.duration || 0, 0) / 1000
  }
}

module.exports = { getCallsByCampaigns, getCallWithDuration, getVapiCall, createVapiCall }