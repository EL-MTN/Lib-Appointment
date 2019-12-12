const express = require('express');
const router = express.Router();
const dbFunc = require('./db');

/**
 * @summary Handling GET requests
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
 * @summary Form validation. Examines input dates to check for repeats.
 */
router.post('/form-submit', (req, res) => {
	const req_time_min = Date.parse(
		req.body.date.replace('-', '/') + ' ' + req.body.time_start
	);
	const req_time_max = Date.parse(
		req.body.date.replace('-', '/') + ' ' + req.body.time_end
	);
	if (req_time_max <= req_time_min) {
		req.err = 'Error: Wrong time order.';
		res.render('newAppointment', { error: err });
		return;
	}

	let isError = false;

	dbFunc.getAll((err, rows) => {
		if (err) throw err;
		for (let i = 0; i < rows.length; i++) {
			const object = rows[i];
			if (object.date == req.body.date) {
				const time_min = Date.parse(
					object.date.replace('-', '/') + ' ' + object.time_start
				);
				const time_max = Date.parse(
					object.date.replace('-', '/') + ' ' + object.time_end
				);

				if (!(req_time_max <= time_min || req_time_min >= time_max)) {
					err = 'Error: Date crossed.';
					res.render('newAppointment', { error: err });
					isError = true;
					return;
				}
			}
		}

		if (!isError) {
			dbFunc.addAppointment(
				`${req.body.firstname} ${req.body.lastname}`,
				req.body.email,
				req.body.date,
				req.body.time_start,
				req.body.time_end
			);

			res.status(200);
			res.redirect('/');
		}
	});
});

module.exports = router;
