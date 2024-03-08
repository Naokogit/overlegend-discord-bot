const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events, } = require('discord.js');

const ticket = require('../../schemas/ticketSchema');
const { primaryColor, ticketIMG, ticketsRole, logoIMG } = require('../../configs/config.json');
const getTicketCacheInformation = require('../../utils/getTicketCacheInformation');

module.exports = {
    name: Events.InteractionCreate,


    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'btnClaimTicket') {

            if (!interaction.member.roles.cache.has(ticketsRole)) {
                await interaction.reply({ content: `❌ Non puoi effettuare questa azione`, ephemeral: true });
                return;
            }
                
            var channel = interaction.client.channels.cache.get(interaction.channelId);
            
            channel.messages.fetch({ limit: 100 })
                .then(async messages => {
                    const firstMessage = messages.last();
                
                    if (firstMessage) {
                        channel.messages.fetch(firstMessage.id).then(async message => {
                            const row = new ActionRowBuilder();
                            console.log(message);
                            message.components[0].components.forEach(button => {
                                const newButton = new ButtonBuilder()
                                newButton.data = button.data;
                                if (newButton.data.custom_id === interaction.customId) {
                                    newButton.setDisabled(true);
                                }
                                row.addComponents(newButton);
                            });

                            const embed = new EmbedBuilder()
                                .setTitle(`Gestione del ticket`)
                                .setDescription(`Il ticket verrà gestito da <@${interaction.member.id}>`)
                                .setTimestamp()
                                .setColor(Number(primaryColor))
                                .setFooter({ text: "OverLegend", iconURL: logoIMG });

                            const ticketInformation = getTicketCacheInformation(interaction);
                            const query = {userId: ticketInformation.userId, category: ticketInformation.category, status: "open"}
                
                            await ticket.updateOne(query, { $set: { assignedTo: interaction.member.id } });
                            
                            await interaction.update({ components: [row] });
                            await channel.send({ embeds: [embed]});
                        });
                    }
            });
        }
    }
}