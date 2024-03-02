require('dotenv').config();
const { Client, GatewayIntentBits,} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
    ],
});

require('./handlers/commandHandler')(client)
require('./handlers/eventHandler')(client)

client.login(process.env.TOKEN);