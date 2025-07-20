const db = require('../db/sqlite')

async function getContactsByUserId(user_id) {
  return new Promise(resolve => {
    try {
      db.all(`SELECT * FROM contacts WHERE user_id = ? AND status = 'active'`, [user_id], (err, rows) => {
        if (err) resolve([]);
        resolve(rows);
      })
    } catch (err) {
      console.log(err)
      resolve([]);
    }
  })
}

async function getContactById(id) {
  return new Promise(resolve => {
    try {
      db.all(`SELECT * FROM contacts WHERE id = ? LIMIT 1`, [id], (err, rows) => {
        if (err) resolve(null);
        resolve(rows[0]);
      })
    } catch (err) {
      resolve(null);
    }
  })
}

async function createContactByUserId({ name, email, number }, user_id) {
  return new Promise((resolve, reject) => {
    try {
      db.all(`INSERT INTO contacts(user_id, name, email, number, status) VALUES(?, ?, ?, ?, ?)`,
        [user_id, name, email, number, 'active'],
        (err) => {
          if (err) {
            console.log(err)
            reject(err);
          }
          resolve({ user_id, name, email, number, status: 'active' })
        }
      )
    } catch (err) {
      console.log(err);
      reject(err);
    }
  })
}

async function deleteContactByUserId(user_id, id) {
  return new Promise((resolve, reject) => {
    db.all(`DELETE FROM contacts WHERE id = ? AND user_id = ?`, [id, user_id], (err) => {
      if (err) reject(err);
      resolve(null);
    })
  })
}

module.exports = { getContactsByUserId, getContactById, createContactByUserId, deleteContactByUserId }