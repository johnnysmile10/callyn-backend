const axios = require('axios');
const { OpenAI } = require('openai');

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

async function getCampaignName(business_context, target_audience) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // Or 'gpt-4o', etc.
            messages: [
                {
                    role: 'user', content: `Generate a creative and compelling campaign name based on the following details:
Business Context: ${business_context}
Target Audience: ${target_audience}
(e.g. Dental Practice Outreach, B2B Software Demo Campaign, Real Estate Investment)
Only return campaign name without any unnecessary words or beginning statement.`
                },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return null;
    }
}

module.exports = { getCampaignName, getVapiCampaign, createVapiCampaign };