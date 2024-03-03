const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../../schemas/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('read-schema')
    .setDescription('Reads schemas'),
    
    async execute (interaction) {

        const data = await testSchema.find();

        var values = [];
        await data.forEach(async d => {
            values.push(d.name);
        });

        if(!values.length)
            await interaction.reply({content: 'Non ci sono dati'});
        else
            await interaction.reply({ content: `Dati:\n${values.join('\n')}`});

    }
}