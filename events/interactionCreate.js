const { Events } = require('discord.js');
const wait = require('timers/promises').setTimeout;



module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		
		try {
			await command.execute(interaction);
			// if (interaction.commandName === 'ping') {
			// 	await interaction.deferReply('Pong!');
			// 	await interaction.followUp('Pong again!');
			// 	await wait(4_000);
			// 	await interaction.editReply('Pong again!!!!');
			// }
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	},
};