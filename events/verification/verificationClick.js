const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events, } = require('discord.js');
const { roles } = require('../../configs/roles.json');
const { primaryColor, logoIMG, verifiedRole } = require('../../configs/config.json');



module.exports = {
    name: Events.InteractionCreate,

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        if (interaction.customId === 'btnVerify') {
            
            const member = await interaction.guild.members.cache.get(interaction.user.id);

            var desc = "**Hai già effettuato la verifica**\n\n"
            const embed = new EmbedBuilder()
            .setTitle("VERIFICA COMPLETATA")
            .setColor(Number(primaryColor))
            .setTimestamp()
            .setFooter({ text: "OverLegend", iconURL: logoIMG });
            
            
            if (!member.roles.resolve(verifiedRole)) {
                member.roles.add(verifiedRole);
                desc = "**Hai effettuato la verifica, buona permanenza**\n\n";
            }
            embed.setDescription(desc);

            await interaction.reply({ embeds: [embed], ephemeral: true });

        }
    }
}