const { getPhoneNumbersByUserId, createPhoneNumberByUserId } = require("../services/phone");
const { getFirstAgentByUserId } = require("../services/assistant");
const { getAvailableNumbers, getIncomingNumbers, createVapiPhone, provisionNumber } = require("../utils/phone");

async function createPhoneNumber(req, res) {
  const { user_id } = req.user;
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send('Phone number is required to provision.');
  }

  const firstAgent = await getFirstAgentByUserId(user_id);
  if (!firstAgent) {
    return res.status(400).send('No available assistants.');
  }

  try {
    const incomingNumbers = await getIncomingNumbers();
    if (!incomingNumbers.find(item => item.phone_number === phoneNumber || item.friendly_name === phoneNumber)) {
      //   // provision the number if phone doesn't exist in incoming numbers
      console.log('provisioning...', phoneNumber);
      await provisionNumber(phoneNumber);
    }

    const vapiPhone = await createVapiPhone(phoneNumber, firstAgent.assistant_id);
    await createPhoneNumberByUserId(user_id, vapiPhone);
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    console.error("Provisioning error:", err);
    return res.status(500).send('Server error!');
  }
}

async function getPhoneNumbers(req, res) {
  const { user_id } = req.user;
  const { country = 'US' } = req.query;

  const purchased_numbers = await getPhoneNumbersByUserId(user_id);
  const available_numbers = await getAvailableNumbers(country);

  return res.status(200).json({ purchased_numbers, available_numbers });
}

module.exports = { createPhoneNumber, getPhoneNumbers };