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
		console.log(`\x1b[1m\x1b[3m\x1b[36mApp running on \x1b[32m${url}:${port}`);
	});
}

start(1025, 'localhost');
