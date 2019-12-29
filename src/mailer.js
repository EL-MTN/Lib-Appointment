/**
 * @fileoverview SMTP service code
 * @author Eric Li
 */

'use strict';

const mail = require('nodemailer');

/**
 * @param {String} host
 * @param {Number} port
 * @param {String} user
 * @param {String} pass
 * @param {String} client
 * @param {String} time
 * @param {Function} cb
 *
 * @description This function sends an email with a selected template to a client
 */
function sendMail(host, port, user, pass, client, time, cb) {
	const transport = mail.createTransport({
		host: host,
		port: port,
		auth: {
			user: user,
			pass: pass
		}
	});
	transport.sendMail(
		{
			from: 'BIHZ',
			to: client,
			subject: 'New Library Appointment',
			text: `You've made a new appointment in the BIHZ library at ${time}. Please arrive on time.`
		},
		(err, info) => {
			if (err) throw err;
			cb(info);
		}
	);
}

module.exports = { sendMail };
