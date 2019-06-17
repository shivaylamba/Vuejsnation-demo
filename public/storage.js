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
    console.log('done');
   
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

function write(){
  Storage.databses['test'] = {id:1};
  Storage.exportDatabase('test');
}