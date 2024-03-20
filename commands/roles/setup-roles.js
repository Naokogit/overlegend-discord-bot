const { SlashCommandBuilder, PermissionsBitField, ChannelType, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder} = require('discord.js');

const { roles } = require('../../configs/roles_channel.json');
const { primaryColor, logoIMG } = require('../../configs/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('roles')
        .addSubcommand(command => command.setName('setup').setDescription('Setup roles')
            .addChannelOption(option =>
                option.setName('channel')
                    .setRequired(true)
                    .setDescription('Specifica canale')
                    .addChannelTypes(ChannelType.GuildText))),
    /**
     * 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    
    async execute(interaction) {
        try {

            const sub = interaction.options.getSubcommand();

            switch (sub) {
                case 'setup':

                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        await interaction.reply({ content: '❌ Non puoi effettuare questa azione', ephemeral: true });
                        return;
                    }
                
                    const embed = new EmbedBuilder()
                        .setTitle("Ricevi gli ultimi aggiornamenti")
                        .setDescription("Assicurati di ricevere gli aggiornamenti di OverLegend abilitando le notifiche sui canali che preferisci.\n")
                        .setColor(Number(primaryColor))
                        .setTimestamp()
                        .setFooter({ text: "OverLegend", iconURL: logoIMG });
                    const roleMenu = new StringSelectMenuBuilder()
                        .setCustomId('selectRoles')
                        .setPlaceholder("Seleziona un ruolo")
                        .setMinValues(0)
                        .setMaxValues(Object.keys(roles).length);
                
                    var value = "";
                
                    for (const role of Object.keys(roles)) {
                        roleMenu.addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(roles[role].label)
                                .setDescription(roles[role].description)
                                .setValue(role)
                                .setEmoji(roles[role].emoji)
                        );
                        value += `- Segui il canale <#${roles[role].id_channel}>\n`;
                    }

                    embed.addFields({ name: "Ruoli disponibili", value })
                    const actionRow = new ActionRowBuilder().addComponents(roleMenu);

                    var channel = interaction.options.getChannel('channel');
                    const channel_interaction = interaction.client.channels.cache.get(channel.id);
                    channel_interaction.send({ embeds: [embed], components: [actionRow] });

                    await interaction.reply({ content: 'Setup ruoli effettuato', ephemeral: true });
            }
        } catch (err) { console.log(err); }
    }
}
