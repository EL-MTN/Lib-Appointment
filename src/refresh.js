/**
 * @fileoverview Manually remove extraneous data
 * @author Eric Li
 */

const db = require('./db');
db.refreshDate(res => {
	console.log(res);
});
