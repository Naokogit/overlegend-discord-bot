const {SlashCommandBuilder, ChannelType, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Invia embed di test')
        .addChannelOption(option =>
            option.setName('channel')
            .setRequired(true)
            .setDescription('Specify channel')
            .addChannelTypes(ChannelType.GuildText)),
    async execute(interaction){
        const channel = interaction.options.getChannel('channel');

        const channel_interaction = interaction.client.channels.cache.get(channel.id);

        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Embed sparato su ${channel.name}`)
        .setDescription(`diobubu`)
        
        channel_interaction.send({embeds: [exampleEmbed]});
    },

}