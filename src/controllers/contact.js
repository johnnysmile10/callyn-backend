const { getContactsByUserId, createContactByUserId, deleteContactByUserId, getContactById } = require('../services/contact')

async function getContacts(req, res) {
  const { user_id } = req.user;

  const contacts = await getContactsByUserId(user_id);
  return res.status(200).send(contacts);
}

async function importContacts(req, res) {
  const { user_id } = req.user;
  const contacts = req.body;
  if (!contacts || !contacts.length) {
    return res.status(400).send('No available contacts.');
  }

  const importedOnes = await Promise.all(contacts.map(contact => createContactByUserId(contact, user_id)))

  return res.status(200).send(importedOnes);
}

async function deleteContact(req, res) {
  const { user_id } = req.user;
  const { id } = req.params;

  try {
    const contact = await getContactById(id);
    await deleteContactByUserId(user_id, id);
    return res.status(200).send(`${contact.name} lead deleted.`)
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
}

module.exports = { getContacts, importContacts, deleteContact }