const db = require('../db/sqlite')

function getFirstAgentByUserId(user_id) {
  return new Promise((resolve) => {
    db.all(
      "SELECT * FROM assistants WHERE user_id = ?",
      [user_id],
      (err, rows) => {
        if (err || !rows.length) resolve(null);
        resolve(rows[0]);
      }
    );
  });
}

module.exports = { getFirstAgentByUserId }