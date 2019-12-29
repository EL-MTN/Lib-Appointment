/**
 * @fileoverview Express Application code
 * @author Eric Li
 */

'use strict';

const chalk = require('chalk');
const express = require('express');
const parser = require('body-parser');
const router = require('./router');

// Creating the express application and giving it settings
const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(parser.urlencoded({ extended: true }));
app.use('/', router);

/**
 *
 * @param {Number} port
 * @param {String} url
 *
 * @example start(8080, 'localhost');
 */
function start(port, url) {
	app.listen(port, url, () => {
		console.log(chalk`{bold App running on {greenBright ${url}:${port}}}`);
	});
}

start(1025, 'localhost');
