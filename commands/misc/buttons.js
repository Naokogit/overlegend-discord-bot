const { SlashCommandBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, Collector, ComponentType, CommandInteraction } = require('discord.js');

module.exports = {
    data:new SlashCommandBuilder()
    .setName('buttons')
    .setDescription('Invia mex con buttons'),
        /**
         * 
         * @param {CommandInteraction} interaction 
         */
    async execute(interaction) {
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('btn-ban');

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('btn-cancel');
        
        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);
        
        const reply = await interaction.reply({
            content: `Niggers`,
            components: [row],
        });

        // const filter = (i) => i.user.id === message.author.id;
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            // filter,
            // time: 10_000,
        });
        
        collector.on('collect', (interaction) => {
            if (interaction.customId === 'btn-ban') {
                interaction.reply({ content: "Hai cliccato bnt ban", ephemeral: true });
                return;
            }
            if (interaction.customId === 'btn-cancel') {
                interaction.reply({ content: "Hai cliccato cancella", ephemeral: true });
                return;
            }
        })
    }
}