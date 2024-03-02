const { Client, Events, ActivityType } = require('discord.js');


const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL;

module.exports = {
	name: Events.ClientReady,
	once: true,

	/**
	 * 
	 * @param {Client} client 
	 */
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
		
		client.user.setActivity({
			name: '🗺 Streaming Status!',
			type: ActivityType.Streaming,
			url: 'https://www.twitch.tv/discord'
		})
		// client.user.setPresence({ activities: [{ name: 'mc.overlegend.it' }], status: 'online' });

		if(!mongoURL) return;

		await mongoose.connect(mongoURL || '');
		
		if (mongoose.connect) {
			console.log(`Connesso al database MONGODB`)
		}
		else{
			console.log(`Qualcosa è andato storto nella connessione al database MONGODB`)
		}
	},
};