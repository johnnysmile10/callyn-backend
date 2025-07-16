const { getVapiPhone } = require('../utils/phone');

const db = require('../db/sqlite');

function getPhoneNumbersByUserId(user_id) {
	return new Promise(async (resolve) => {
		try {
			db.all(
				"SELECT * FROM phones WHERE user_id = ?", [user_id], async (err, rows) => {
					if (err) resolve([]);

					const phones = await Promise.all(rows.map(row => {
						return new Promise(async resolve => {
							const phone = await getVapiPhone(row.phone_id);
							resolve(phone);
						})
					}))

					resolve(phones.filter(p => !!p));
				}
			);
		} catch (err) {
			console.log(err);
			resolve([]);
		}
	})
}

function createPhoneNumberByUserId(user_id, phone) {
	return new Promise((resolve, reject) => {
		try {
			const insertQuery = `
      INSERT INTO phones (user_id, phone_id, created_at)
      VALUES (?, ?, datetime('now'))
    `;

			db.run(
				insertQuery,
				[
					user_id,
					phone.id,
				],
				(err) => {
					if (err) {
						console.error("DB insert error:", err);
						reject(err);
					}
					resolve(phone)
				}
			);
		} catch (err) {
			reject(err);
		}
	})
}

module.exports = { getPhoneNumbersByUserId, createPhoneNumberByUserId };