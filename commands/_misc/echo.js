const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMaxLength(2_000))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into')
			.addChannelTypes(ChannelType.GuildText))
	.addBooleanOption(option =>
		option.setName('embed')
			.setDescription('Whether or not the echo should be embedded')),
    async execute(interaction) {

        const input = interaction.options.getString('input');
        const embed = interaction.options.getBoolean('embed');
        // const channelName = interaction.options.getChannel('channel');
        // Verifica se è stata fornita un'opzione "input"
        if (!input) {
            await interaction.reply('You must provide an input to echo!');
            return;
        }
        if(embed){
            const exampleEmbed = new EmbedBuilder()
	            .setColor(0x0099FF)
	            .setTitle('Echo')
	            .setDescription(`${input}`)

            interaction.reply({ embeds: [exampleEmbed] });
            return;
        }

        await interaction.reply(`Echo: ${input}`);
	},
}