'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('./db/library.sqlite');

db.run(
	'CREATE TABLE IF NOT EXISTS appointments (name TEXT, email TEXT, date TEXT, time_start TEXT UNIQUE, time_end TEXT UNIQUE)'
);

/**
 * @summary Gets all appointments in the 'appointments' table
 * @returns A callback, which contains two params: @param {Error} err, @param {Array} rows
 */
function getAll(cb) {
	db.all('SELECT * FROM appointments', (err, rows) => {
		cb(err, rows);
	});
}

/**
 *
 * @param {string} name
 * @param {string} email
 * @param {Date} time_start
 * @param {Date} time_end
 *
 * @summary Inserts an appointment into the 'appointments' table
 */
function addAppointment(name, email, date, time_start, time_end) {
	db.run(
		'INSERT INTO appointments VALUES(?, ?, ?, ?, ?)',
		[name, email, date, time_start, time_end],
		err => {
			if (err) throw err;
		}
	);
}

/**
 *
 * @param {Date} time_start
 *
 * @summary Given a time 'time_start', removes the appointment with that time
 */
function cancelAppointment(time_start) {
	db.run(
		`DELETE FROM appointments WHERE time_start = "${formatDate(time_start)}"`
	);
}

module.exports = { getAll, addAppointment, cancelAppointment };
