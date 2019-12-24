/**
 * @fileoverview Express Application code
 * @author Eric Li
 */

'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('./db/library.sqlite');

db.run('CREATE TABLE IF NOT EXISTS appointments (name TEXT, email TEXT, date TEXT, time_start TEXT, time_end TEXT)');

/**
 * @description Gets all appointments in the 'appointments' table
 * @param {Function} cb
 * @returns A callback, which contains two params: @param {Error} err, @param {Object[]} rows
 */
function getAll(cb) {
	refreshDate(res => {});
	db.all('SELECT * FROM appointments ORDER BY date ASC, time_start ASC', (err, rows) => {
		cb(err, rows);
	});
}

/**
 *
 * @param {String} name
 * @param {String} email
 * @param {Date} time_start
 * @param {Date} time_end
 *
 * @description Inserts an appointment into the 'appointments' table
 * @example addAppointment('Eric Li', '71341@qq.com', '2019-12-31', '07:00', '07:15');
 */
function addAppointment(name, email, date, time_start, time_end) {
	db.run('INSERT INTO appointments VALUES(?, ?, ?, ?, ?)', [name, email, date, time_start, time_end], err => {
		if (err) throw err;
	});
}

/**
 *
 * @param {Date} time_start
 *
 * @description Given a time 'time_start', removes the appointment with that time
 */
function cancelAppointment(time_start) {
	db.run(`DELETE FROM appointments WHERE time_start = "${formatDate(time_start)}"`, err => {
		if (err) throw err;
	});
}

/**
 * @description Helps remove outdated entries in the 'appointments' table
 */
function refreshDate(cb) {
	db.run('DELETE FROM appointments WHERE date <= date("now") AND time_start < time("now", "localtime")', err => {
		if (err) throw err;
		cb('\x1b[1m[\x1b[32m✓\x1b[37m] Operation Successful');
	});
}

module.exports = { getAll, addAppointment, cancelAppointment, refreshDate };
