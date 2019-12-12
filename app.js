/**
 * @fileoverview Express Application code
 * @author Eric Li
 */


'use strict';

const express = require('express');
const app = express();
const parser = require('body-parser');
const router = require('./router');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(parser.urlencoded({ extended: true }));
app.use('/', router);

/**
 *
 * @param {number} port
 * @param {string} url
 *
 * @example start(8080, 'localhost');
 */
function start(port, url) {
	app.listen(port, url, () => {
		console.log(`App running on ${url}:${port}`);
	});
}

start(1025, 'localhost');
