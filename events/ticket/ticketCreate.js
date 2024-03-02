const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, Client} = require("discord.js");

const { ticketsCategory, ticketsRole } = require('../../configs/config.json');


module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isModalSubmit() && interaction.customId === 'modalTicket_gamemode') {
            
            const nickname = interaction.fields.getTextInputValue('nickname');
            const device = interaction.fields.getTextInputValue('device');
            const topic = interaction.fields.getTextInputValue('topic');
            const issue = interaction.fields.getTextInputValue('issue');

            const channel = await interaction.guild.channels.create({
                name: `${interaction.user.username}-ticket`,
                type: ChannelType.GuildText,
                parent: ticketsCategory,
                topic: `Utente che ha aperto il ticket: ${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // @everyone
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        id: ticketsRole,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },

                ],
            });
        
            const embed = new EmbedBuilder()
                .setTitle('TICKET | [Supporto Modalità] aperto.')
                .setDescription(`Grazie per aver contattato l'assistenza.
                Descrivi il tuo problema e attendi una risposta dallo staff.
                Ticket aperto da: <@${interaction.user.id}>`)
                // .setThumbnail('https://i.imgur.com/IWbnKLl.png')
                .setTimestamp()
                .setColor(0x503519)
                .setFooter({text:"Data di creazione",iconURL: "https://i.imgur.com/IWbnKLl.png"})
                .addFields(
                    //{ name: '🗣 Utente Discord', value: `\`\`\`<@${interaction.user.id}>\`\`\`` },
                    { name: '👤 Nickname di Minecraft', value: `\`\`\`${nickname}\`\`\`` },
                    { name: '🖥 Piattaforma', value: `\`\`\`${device}\`\`\`` },
                    { name: '✨ Topic principale', value: `\`\`\`${topic}\`\`\`` },
                    { name: '🔧 Descrizione del problema', value: `\`\`\`${issue}\`\`\`` }
                )
                
            const closeBtn = new ButtonBuilder()
                .setEmoji('🔒')
                .setLabel('Chiudi')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('btnCloseTicket');
                
            const closeReasonBtn = new ButtonBuilder()
                .setEmoji('🔒')
                .setLabel('Chiudi con motivo')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('btnCloseReasonTicket');
                
            const pingBtn = new ButtonBuilder()
                .setEmoji('🎇')
                .setLabel('Staff Ping')
                .setStyle(ButtonStyle.Success)
                .setCustomId('btnPingStaff');
                
            const row = new ActionRowBuilder().addComponents(closeBtn, closeReasonBtn, pingBtn);
                
            await channel.send({embeds: [embed], components: [row]});
            var msg = await channel.send({content: `<@&${ticketsRole}>`});
            msg.delete().catch(err =>{});
            await interaction.reply({
                content: `<@${interaction.user.id}> consulta il ticket aperto in ${channel}`,
                ephemeral: true
            });
        }
    }
}