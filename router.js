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
	const body = req.body;
	const req_time_min = Date.parse(
		body.date.replace('-', '/') + ' ' + body.time_start
	);
	const req_time_max = Date.parse(
		body.date.replace('-', '/') + ' ' + body.time_end
	);
	if (req_time_max <= req_time_min) {
		req.err = 'Your starting time seems to be earlier than the ending time. Try switching the orders.';
		res.render('newAppointment', { error: err, firstname: body.firstname, lastname: body.lastname, email: body.email, date: body.date });
		return;
	}

	let isError = false;

	dbFunc.getAll((err, rows) => {
		if (err) throw err;
		for (let i = 0; i < rows.length; i++) {
			const object = rows[i];
			if (object.date == body.date) {
				const time_min = Date.parse(
					object.date.replace('-', '/') + ' ' + object.time_start
				);
				const time_max = Date.parse(
					object.date.replace('-', '/') + ' ' + object.time_end
				);

				if (!(req_time_max <= time_min || req_time_min >= time_max)) {
					err = 'Your time chosen interfered with others. Try choosing a new time.';
					res.render('newAppointment', { error: err, firstname: body.firstname, lastname: body.lastname, email: body.email, date: body.date });
					isError = true;
					return;
				}
			}
		}

		if (!isError) {
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