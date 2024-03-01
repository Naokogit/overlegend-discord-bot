require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, IntentsBitField, Collection, GatewayIntentBits, Routes, REST } = require("discord.js");
const { clientId, guildId } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // IntentsBitField.Flags.Guilds,
        // IntentsBitField.Flags.GuildMembers,
        // IntentsBitField.Flags.GuildMessages,
        // IntentsBitField.Flags.MessageContent,
    ],
});
console.log(clientId, guildId);
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
// (async () => {
// 	try {
// 		console.log(`Started refreshing ${client.commands.length} application (/) commands.`);

// 		// The put method is used to fully refresh all commands in the guild with the current set
// 		const data = await rest.put(
// 			Routes.applicationGuildCommands(clientId, guildId),
// 			{ body: client.commands.body },
// 		);

// 		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
// 	} catch (error) {
// 		// And of course, make sure you catch and log any errors!
// 		console.error(error);
// 	}
// })();

// client.on('ready', function(c){
//     console.log(`👌 ${c.user.tag} is online,`);
// });

client.login(process.env.TOKEN);