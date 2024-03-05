const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../../schemas/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test-schema')
    .setDescription('Testing a schema')
    .addStringOption(option => option.setName('schema-input').setDescription('The text to save').setRequired(true)),
    async execute (interaction) {
        const { options } = interaction;
        const string = options.getString('schema-input');

        await testSchema.create({
            name: string
        });

        await interaction.reply('I saved the data');
    }
}