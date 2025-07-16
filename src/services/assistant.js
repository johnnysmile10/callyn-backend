const db = require('../db/sqlite')

function getAssistantsByUserId(user_id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM assistants WHERE user_id = ?",
      [user_id],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

module.exports = { getAssistantsByUserId }