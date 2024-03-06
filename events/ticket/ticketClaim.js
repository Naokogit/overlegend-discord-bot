const { SlashCommandBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChatInputCommandInteraction, StringSelectMenuBuilder, Embed, CommandInteraction, Events, } = require('discord.js');

const { ticketCategories } = require('../../configs/tickets_category.json');
const { primaryColor, ticketIMG, ticketsRole, logoIMG } = require('../../configs/config.json');

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'btnClaimTicket') {

            if (interaction.member.roles.cache.some(r => r.id === ticketsRole)) {
                
                var channel = interaction.client.channels.cache.get(interaction.channelId);
            
                channel.messages.fetch({ limit: 1 })
                    .then(messages => {
                        const firstMessage = messages.first();
                    
                        if (firstMessage) {
                            // Fetch the message by its ID
                            channel.messages.fetch(firstMessage.id)
                                .then(message => {
                                    // Check if the message contains an embed
                                    console.log(message);
                                    const embed = message.embed;
                                    const actionRow = message.components[0];


                                    if (actionRow) {
                                            

                                        
                                        actionRow.components.splice(2, 1);
                                        console.log("sono dentro", actionRow.components);
                                        
                                        // Remove the first button from the embed
                                        // actionRow.components.splice(2, 1);
                                
                                        // Update the message with the modified embed
                                        console.log(message.id);
                                    }
                                });
                        }
                });
            }
        }
    }
}