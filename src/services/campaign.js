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

module.exports = {
    getCampaignsByUserId,
    createCampaignByUserId
}