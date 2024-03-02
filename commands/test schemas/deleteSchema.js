const { SlashCommandBuilder } = require('discord.js');
const testSchema = require('../../schemas/test');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delete-schema')
    .setDescription('Deletes a schema'),
    
    async execute (interaction) {

        const data = await testSchema.find();
        //.findOne({name: 'pippo'});

        await data.forEach(async d => {
            await testSchema.deleteOne({name: d.name});
        });

        await interaction.reply({ content: `Valori eliminati`});

    }
}