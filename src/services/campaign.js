const { OpenAI } = require('openai');

const { getVapiCampaign } = require("../utils/campaign");
const { getVapiAssistant } = require("../utils/assistant");

const db = require('../db/sqlite');

async function getCampaignsByUserId(user_id) {
    return new Promise(async resolve => {
        try {
            db.all('SELECT * FROM campaigns WHERE user_id = ?', [user_id], async (err, rows) => {
                if (err) resolve([]);
                const campaigns = await Promise.all(rows.map(row => {
                    return new Promise(async resolve => {
                        const campaign = await getVapiCampaign(row.campaign_id);
                        const assistant = await getVapiAssistant(row.assistant_id);
                        resolve({
                            id: campaign.id,
                            name: campaign.name,
                            customers: campaign.customers,
                            status: campaign.status,
                            endedReason: campaign.endedReason,
                            calls: campaign.calls,
                            callsCounterEnded: campaign.callsCounterEnded,
                            callsCounterScheduled: campaign.callsCounterScheduled,
                            callsCounterQueued: campaign.callsCounterQueued,
                            callsCounterInProgress: campaign.callsCounterInProgress,
                            callsCounterEndedVoicemail: campaign.callsCounterEndedVoicemail,
                            assistant,
                            updatedAt: campaign.updatedAt
                        })
                    })
                }))

                resolve(campaigns.filter(r => !!r));
            })
        } catch (err) {
            resolve([]);
        }
    })
}

async function createCampaignByUserId(user_id, campaign) {
    try {
        db.run(`INSERT INTO campaigns (user_id, assistant_id, campaign_id)
            VALUES (?, ?, ?)`, [user_id, campaign.assistantId, campaign.id]);
        return
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function getCampaignName(business_context, target_audience) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Or 'gpt-4o', etc.
            messages: [
                {
                    role: 'user', content: `Generate a creative and compelling campaign name based on the following details:
Business Context: ${business_context}
Target Audience: ${target_audience}
(e.g. Dental Practice Outreach, B2B Software Demo Campaign, Real Estate Investment)`
                },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return null;
    }
}

module.exports = {
    getCampaignsByUserId,
    createCampaignByUserId,
    getCampaignName
}