const axios = require("axios");

const VAPI_API_KEY = process.env.VAPI_API_KEY;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioToken = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

async function getVapiPhone(phone_id) {
    try {
        const phone = await axios.get(`https://api.vapi.ai/phone-number/${phone_id}`, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`,
                "Content-Type": "application/json",
            }
        }).then(res => res.data);
        return phone;
    } catch (_) {
        return null;
    }
}

async function getAvailableNumbers(country = "US") {
    try {
        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/${country}/Local.json`,
            {
                headers: {
                    Authorization: `Basic ${twilioToken}`,
                },
            }
        );

        const data = await response.json();
        return data.available_phone_numbers || [];
    } catch (error) {
        console.error("Failed to refresh available numbers:", error);
        return [];
    }
}

async function getIncomingNumbers() {
    try {
        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
            {
                headers: {
                    Authorization: `Basic ${twilioToken}`,
                },
            }
        );

        const data = await response.json();
        return data.incoming_phone_numbers || [];
    } catch (error) {
        console.error("Failed to refresh available numbers:", error);
        return [];
    }
}

async function createVapiPhone(phoneNumber, assistantId) {
    try {
        const phone = await axios.post(`https://api.vapi.ai/phone-number`, {
            provider: 'twilio',
            number: phoneNumber,
            twilioAccountSid: accountSid,
            twilioAuthToken: authToken,
            assistantId
        }, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`,
                "Content-Type": "application/json",
            },
        }).then(res => res.data);
        return phone;
    } catch (_) {
        console.log(_);
        return null;
    }
}

async function provisionNumber(phoneNumber) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${twilioToken}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        PhoneNumber: phoneNumber,
                    }),
                }
            );

            const data = await response.json();
            resolve(data);
        } catch (err) {
            reject(err);
        }
    })
}

module.exports = { getVapiPhone, getAvailableNumbers, getIncomingNumbers, createVapiPhone, provisionNumber }