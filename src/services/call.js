const { getVapiCall, getCallWithDuration } = require('../utils/call');

const db = require('../db/sqlite');

async function getCallsByUserId(user_id) {
  return new Promise(resolve => {
    try {
      db.all(`SELECT * FROM calls WHERE user_id = ?`, [user_id], async (err, rows) => {
        if (err) resolve([]);
        const calls = await Promise.all(rows.map(r => getVapiCall(r.call_id)));
        resolve(calls.filter(c => !!c).map(getCallWithDuration));
      })
    } catch (err) {
      resolve([]);
    }
  });
}

async function createCallByUserId(user_id, { assistant_id, call_id }) {
  return new Promise((resolve, reject) => {
    try {
      db.all(`INSERT INTO calls(user_id, assistant_id, call_id) VALUES(?, ?, ?)`,
        [user_id, assistant_id, call_id],
        (err) => {
          if (err) reject(err);
          resolve(null);
        }
      )
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = { getCallsByUserId, createCallByUserId };