// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
  
  'use strict';
console.log('hi');
const fs = require('fs');
const BACKUP_INTERVAL = 60 * 60 * 1000;

var Storage = {
	
		'databases' : {},
		'backupInterval' : setInterval(() => this.exportDatabases(), BACKUP_INTERVAL),

	/**
	 * @param {string} roomid
	 * @returns {AnyObject}
	 */
	'getDatabase' :  function(roomid) {
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		// sync database properties
		if (roomid === 'global' && !this.databases[roomid].mail) this.databases[roomid].mail = {};
		return this.databases[roomid];
	},

	/**
	 * @param {string} roomid
	 */
	'importDatabase' : function(roomid) {
		let file = '{}';
		try {
			file = fs.readFileSync('./databases/' + roomid + '.json').toString();
		} catch (e) {}
		this.databases[roomid] = JSON.parse(file);
	},

	/**
	 * @param {string} roomid
	 */
	'exportDatabase' : function(roomid) {
		if (!(roomid in this.databases)) return;
		fs.writeFileSync('./databases/' + roomid + '.json', JSON.stringify(this.databases[roomid]));
	},

	'importDatabases' : function() {
		let databases = fs.readdirSync('./databases');
		for (let i = 0, len = databases.length; i < len; i++) {
			let file = databases[i];
			if (!file.endsWith('.json')) continue;
			this.importDatabase(file.substr(0, file.indexOf('.json')));
		}
	},

	'exportDatabases' : function() {
		for (let roomid in this.databases) {
			this.exportDatabase(roomid);
		}
	}
}
  Storage.exportDatabase('test');
});
