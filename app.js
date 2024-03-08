require('dotenv').config();
const { Client, IntentsBitField, Collection, GatewayIntentBits,} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
    ],
});

require('./handlers/commandHandler')(client)
require('./handlers/eventHandler')(client)

client.login(process.env.TOKEN);