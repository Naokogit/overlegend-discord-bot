const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

const { ticketsCategory, ticketsRole } = require('../../configs/config.json');

var tickets = []

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        if(interaction.customId === 'ticketCreateSelect'){
            switch(interaction.values[0]){
                case 'createTicket_gamemode':

                    const modal = new ModalBuilder()
                        .setCustomId('modalTicket_gamemode')
                        .setTitle('createTicket_gamemode');

                    const nicknameInput = new TextInputBuilder()
                        .setCustomId('nickname')
                        .setLabel('Inserisci il tuo nickname sul gioco')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Nickname sul server")
                        .setMinLength(3)
                        .setMaxLength(16)
                        .setRequired(true);	

                    const deviceInput = new TextInputBuilder()
                        .setCustomId('device')
                        .setLabel('Su che piattaforma sei? (Java o Bedrock)')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Java/Bedrock")
                        .setMinLength(4)
                        .setMaxLength(7)
                        .setRequired(true);		

                    const topicInput = new TextInputBuilder()
                        .setCustomId('topic')
                        .setLabel('Topic principale del ticket')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Segnalazione giocatore, bug")
                        .setMinLength(3)
                        .setMaxLength(100)
                        .setRequired(true);		

                    const issueInput = new TextInputBuilder()
                        .setCustomId('issue')
                        .setLabel('Descrizione del problema')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("Descrizione sintetica del problema, ogni dettaglio è importante")
                        .setMinLength(10)
                        .setMaxLength(500)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput), 
                        new ActionRowBuilder().addComponents(deviceInput),
                        new ActionRowBuilder().addComponents(topicInput),
                        new ActionRowBuilder().addComponents(issueInput),
                    );
                    await interaction.showModal(modal);

                    break;
            }
        }


        // if(interaction.isButton() && interaction.customId == 'btn_open_ticket'){
        //     const modal = new ModalBuilder()
        //         .setCustomId('ticketModal')
        //         .setTitle('Support Ticket');
            
        //     const topicInput = new TextInputBuilder()
        //         .setCustomId('topic')
        //         .setLabel('Topic')
        //         .setStyle(TextInputStyle.Short)
        //         .setPlaceholder("Topic del problema")
        //         .setMinLength(3)
        //         .setMaxLength(25)
        //         .setRequired(true);		
    
        //     const issueInput = new TextInputBuilder()
        //         .setCustomId('issue')
        //         .setLabel('Issue')
        //         .setStyle(TextInputStyle.Paragraph)
        //         .setPlaceholder("Spiegazione problema")
        //         .setMinLength(3)
        //         .setMaxLength(250)
        //         .setRequired(true);
                
        //     const firstActionRow = new ActionRowBuilder().addComponents(topicInput);
        //     const secondActionRow = new ActionRowBuilder().addComponents(issueInput);
            
    
        //     modal.addComponents(firstActionRow, secondActionRow);
        //     await interaction.showModal(modal);
    
        // } else if(interaction.isModalSubmit() && interaction.customId === 'ticketModal') {
        //     const topic = interaction.fields.getTextInputValue('topic');
        //     const issue = interaction.fields.getTextInputValue('issue');
    
        //     const channel = await interaction.guild.channels.create({
        //         name: `${interaction.user.username}-ticket`,
        //         type: ChannelType.GuildText,
        //         parent: ticketsCategory,
        //         permissionOverwrites: [
        //             {
        //                 id: interaction.guild.id,
        //                 deny: [PermissionsBitField.Flags.ViewChannel],
        //             },
        //             {
        //                 id: interaction.user.id,
        //                 id: ticketsRole,
        //                 allow: [PermissionsBitField.Flags.ViewChannel],
        //             },
                    
        //         ],
        //     });
    
        //     const embed = new EmbedBuilder()
        //         .setTitle('Ticket opened')
        //         .setDescription('Ticked created')
        //         .setTimestamp()
        //         .setFooter({text: 'Ticket created at'})
        //         .addFields(
        //             { name: 'User', value: `\`\`\`${interaction.user.username}\`\`\`` },
        //             { name: 'Topic', value: `\`\`\`${topic}\`\`\`` },
        //             { name: 'Issue', value: `\`\`\`${issue}\`\`\`` }
        //         )
    
        //     const closeBtn = new ButtonBuilder()
        //         .setEmoji('🔒')
        //         .setLabel('Close Ticket')
        //         .setStyle(ButtonStyle.Danger)
        //         .setCustomId('btn_close_ticket');
            
        //     const closeReasonBtn = new ButtonBuilder()
        //         .setEmoji('🔒')
        //         .setLabel('Chiudi con motivo')
        //         .setStyle(ButtonStyle.Danger)
        //         .setCustomId('btn_close_reason_ticket');
    
        //     const pingBtn = new ButtonBuilder()
        //         .setEmoji('🔒')
        //         .setLabel('Close Ticket')
        //         .setStyle(ButtonStyle.Secondary)
        //         .setCustomId('btn_ping_staff');
    
        //     const row = new ActionRowBuilder().addComponents(closeBtn, closeReasonBtn, pingBtn);
    
        //     await channel.send({embeds: [embed], components: [row]});
    
        //     await interaction.reply({
        //         content: `${interaction.user.tag} il tuo ticket è stato aperto e lo puoi visualizzare in ${channel}`,
        //         ephemeral: true
        //     });
    
        
        // }
        
        if(interaction.isButton() && interaction.customId === 'btn_ping_staff'){

            const staffID = [
                ticketsRole,
            ];
    
            const roleMention = staffID.map(id => `<@${id}>`).join(' ');
            const messageContent = `${roleMention}`;
    
            const embed = new EmbedBuilder()
                .setTitle(`Staff Pinged`)
                .setDescription(`Lo staff è stato pingato, aspetta 2-4 ore`)
                .setTimestamp()
                .setFooter({text: `Staff pingato alle:`});
    
            await interaction.channel.send({
                content: messageContent,
                embeds: [embed]
            })
            await interaction.reply({
                content: 'Hai pingato lo staff',
                ephemeral: true
            })
        }
    }

}