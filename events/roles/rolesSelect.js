const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events, } = require('discord.js');
const { roles } = require('../../configs/roles_channel.json');
const { primaryColor, logoIMG } = require('../../configs/config.json');



module.exports = {
    name: Events.InteractionCreate,

    /**
     * 
     * @param {import('discord.js').Interaction} interaction 
     */
    async execute(interaction) {
        if (interaction.customId === 'selectRoles') {
            
            if (interaction.values.length == 0) { await interaction.reply({content: "Non hai selezionato nulla", ephemeral: true}); return; }
            const member = await interaction.guild.members.cache.get(interaction.user.id);

            var desc = "**Hai aggiornato i tuoi ruoli:**\n\n";
            const embed = new EmbedBuilder()
                .setTitle("RUOLI AGGIORNATI")
                .setColor(Number(primaryColor))
                .setTimestamp()
                .setFooter({ text: "OverLegend", iconURL: logoIMG });

            for (const role of Object.keys(roles)) { 
                if (interaction.values.includes(role.toString())) {
                    if (member.roles.resolve(roles[role].id)) {
                        member.roles.remove(roles[role].id);
                        desc += `- Rimosso <@&${roles[role].id}> ❎\n`;
                    }
                    else {
                        member.roles.add(roles[role].id);
                        desc += `- Aggiunto <@&${roles[role].id}> ☑️\n`;
                    }
                }
            }

            embed.setDescription(desc);

            await interaction.reply({ embeds: [embed], ephemeral: true });

        }
    }
}