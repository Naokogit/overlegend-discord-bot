const { Client, Events } = require('discord.js');

const { memberCountChannelId } = require('../../configs/config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,

    /**
     * 
     * @param {Client} client 
     */
    async execute(client) {
        try {
            const channel = await client.channels.cache.get(memberCountChannelId);

            setInterval(() => {
                const memberCount = channel.guild.memberCount;
                channel.setName(`Membri Discord: ${memberCount}`);
            }, 300000);
        } catch (err) { console.log(err); }
    }
}