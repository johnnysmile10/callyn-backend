const axios = require('axios');

const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function createVapiCampaign(name, phone_id, assistant_id, customers) {
    return new Promise(async (resolve, reject) => {
        try {
            const campaign = await axios.post('https://api.vapi.ai/campaign', {
                name,
                phoneNumberId: phone_id,
                assistantId: assistant_id,
                customers
            }, {
                headers: {
                    Authorization: `Bearer ${VAPI_API_KEY}`,
                    "Content-Type": "application/json",
                }
            }).then(res => res.data)
            resolve(campaign);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

async function getVapiCampaign(campaign_id) {
    try {
        const campaign = await axios.get(`https://api.vapi.ai/campaign/${campaign_id}`,
            {
                headers: {
                    Authorization: `Bearer ${VAPI_API_KEY}`
                }
            }
        ).then(res => res.data);
        return campaign
    } catch (err) {
        return null;
    }
}

module.exports = { getVapiCampaign, createVapiCampaign };