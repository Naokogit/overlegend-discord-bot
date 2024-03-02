const path = require('path');
getAllFiles = require('../utils/getAllFiles')

module.exports = (client) =>{

	const eventsPath = path.join(__dirname, '../events');
	const files = getAllFiles(eventsPath);
	for(const file of files){
		console.log(file);
		const event = require(file);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}
