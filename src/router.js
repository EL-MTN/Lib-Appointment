/**
 * @fileoverview Express Application code
 * @author Eric Li
 */


'use strict';

const express = require('express');
const router = express.Router();
const dbFunc = require('./db');

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

router.get('/error', (req, res) => {
	res.send(req.err);
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

		// If there's no errors present, then return to main page
		if (!err) {
			dbFunc.addAppointment(
				`${body.firstname} ${body.lastname}`,
				body.email,
				body.date,
				body.time_start,
				body.time_end
			);

			res.status(200);
			res.redirect('/');
		}
	});
});

module.exports = router;
