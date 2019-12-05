'use strict';

const express = require('express');
const app = express();
const parser = require('body-parser');
const dbFunc = require('./db');

const port = 1025;
const url = 'localhost';

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(parser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	dbFunc.getAll((err, rows) => {
		if (err) throw err;
		res.render('index', { data: rows });
	});
});

app.get('/newAppointment', (req, res) => {
	res.render('newAppointment');
});

app.post('/form-submit', (req, res) => {
	dbFunc.addAppointment(
		`${req.body.firstname} ${req.body.lastname}`,
		req.body.email,
		req.body.date,
		req.body.time_start,
		req.body.time_end
	);
	res.redirect('/');
});

app.listen(port, url, () => {
	console.log(`App running on ${url}:${port}`);
});
