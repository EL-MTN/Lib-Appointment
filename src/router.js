/**
 * @fileoverview Express router
 * @author Eric Li
 */

'use strict';

const chalk = require('chalk');
const dbFunc = require('./db');
const express = require('express');
const fs = require('fs');
const mailer = require('./mailer');

// Creating the express router
const router = express.Router();

/**
 * @description The 'fs' module will read your configuration data and pass it into the parameters
 */
const mailConfig = JSON.parse(fs.readFileSync(`${__dirname}/../config/maildata.json`, 'utf-8'));
const host = mailConfig.host;
const port = mailConfig.port;
const user = mailConfig.user;
const pass = mailConfig.pass;

/**
 * @description Handling GET requests to pages.
 */
router.get('/', (req, res) => {
	dbFunc.getAll((err, rows) => {
		if (err) throw err;
		res.render('index', { data: rows });
	});
});

router.get('/newAppointment', (req, res) => {
	res.render('newAppointment');
});

router.get('/cancel', (req, res) => {
	res.render('cancel.pug');
});

/* -------------------------------------------- */

/**
 * @description Form validation. Examines input dates to check for repeats.
 */
router.post('/form-submit', (req, res) => {
	let err;
	const body = req.body;
	const errObj = {
		firstname: body.firstname,
		lastname: body.lastname,
		email: body.email,
		date: body.date
	};

	/**
	 * @description Handles time order and time interference
	 */

	// Checks if starting time already passed
	if (new Date(`${body.date} ${body.time_start}`).toLocaleString() < new Date().toLocaleString()) {
		errObj['error'] = 'Your starting time has already passed. Try a new time.';
		errObj['date'] = '';
		res.render('newAppointment', errObj);
		return;
	}

	// Checks if starting time is earlier than ending time
	const req_time_min = Date.parse(body.date.replace('-', '/') + ' ' + body.time_start);
	const req_time_max = Date.parse(body.date.replace('-', '/') + ' ' + body.time_end);
	if (req_time_max <= req_time_min) {
		err = 'Your starting time seems to be earlier than the ending time. Try switching the orders.';
		errObj['error'] = err;
		res.render('newAppointment', errObj);
		return;
	}

	// Checking if other entries in the database have the same time
	dbFunc.getAll((err, rows) => {
		if (err) throw err;
		for (let i = 0; i < rows.length; i++) {
			const object = rows[i];
			if (object.date == body.date) {
				const time_min = Date.parse(object.date.replace('-', '/') + ' ' + object.time_start);
				const time_max = Date.parse(object.date.replace('-', '/') + ' ' + object.time_end);

				if (!(req_time_max <= time_min || req_time_min >= time_max)) {
					err = 'Your time chosen interfered with others. Try choosing a new time.';
					errObj['error'] = err;
					res.render('newAppointment', errObj);
					return;
				}
			}
		}

		// If there's no errors present, then return to main page and sends email
		if (!err) {
			dbFunc.addAppointment(
				`${body.firstname} ${body.lastname}`,
				body.email,
				body.date,
				body.time_start,
				body.time_end
			);

			mailer.sendMail(host, port, user, pass, body.email, `${body.date} ${body.time_start}`, info => {
				console.log(
					chalk`{bold [{greenBright ✓}] Successful appointment at {bold.greenBright ${body.date} ${body.time_start}}. Email successfully sent to {bold.greenBright ${body.email}}}`
				);
			});

			res.status(200);
			res.redirect('/');
		}
	});
});

router.post('/cancel-appointment', (req, res) => {

});

module.exports = router;
