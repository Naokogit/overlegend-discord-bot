const {SlashCommandBuilder, ChannelType, EmbedBuilder, CommandInteraction} = require('discord.js');

const { primaryColor, logoIMG } = require('../../configs/config.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription("Scrivi l'IP del server"),
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle("IP DEL SERVER")
                // .setDescription(
                //     `**IP**: \`mc.overlegend.it\`
                //      **VERSIONE**: \`1.20.4\``)
                .setThumbnail("https://imgur.com/PccK9u2.png")
                .setFields({ name: 'IP: mc.overlegend.it', value: '**Versione 1.20.4**', inline: true })
                // .addFields({name: 'IP', value: `\`\`\`mc.overlegend.it\`\`\``})
                // .addFields({name: 'Versione', value: `\`\`\`1.20.1\`\`\``})
                .setColor(Number(primaryColor))
                // .setImage("https://imgur.com/3poSYeF.png")
                .setTimestamp()
                .setFooter({ text: "OverLegend", iconURL: logoIMG });

            interaction.reply({ embeds: [embed] });
        } catch (err) { console.log(err); }
    },
}