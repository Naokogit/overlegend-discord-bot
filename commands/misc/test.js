const {SlashCommandBuilder} = require('discord.js');
const { guildId } = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription('Replies with Pong!'),
    async execute(interaction){
        // console.log(interaction.client.channels.cache);

        const guild = interaction.client.guilds.cache.get(guildId);

        guild.channels.cache.forEach((channel) => {
            console.log(`${channel.name} (${channel.type}) - ${channel.id}`);
            if(channel.name === 'boh')
                interaction.client.channels.cache.get(channel.id).send('content');

        });

        const id = guild.channels.cache.filter((channel) => channel.name === 'boh').first().id;
        interaction.client.channels.cache.get(id).send('contentzz');

        // const channel = interaction.client.channels.cache.get('');
        // channel.send('content');
        await interaction.reply({content: 'Mandando un messaggio in questo canale', ephemeral: true});
    },
};