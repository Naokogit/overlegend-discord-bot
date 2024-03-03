const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, Client, Embed} = require("discord.js");

const { ticketsCategory, ticketsRole } = require('../../configs/config.json');
const ticket = require('../../schemas/ticketSchema');

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {
        if(interaction.isModalSubmit() && interaction.customId === 'modalTicket_gamemode') {
            
            var category = 'gamemode';

            const nickname = interaction.fields.getTextInputValue('nickname');
            const device = interaction.fields.getTextInputValue('device');
            const topic = interaction.fields.getTextInputValue('topic');
            const issue = interaction.fields.getTextInputValue('issue');
            const userId = interaction.user.id;


            const embedEphemeral = new EmbedBuilder()   
                .setColor(0x503519)
                .setTimestamp()
                .setFooter({text: "OverLegend", iconURL: "https://i.imgur.com/IWbnKLl.png"})

            const data = await ticket.findOne({category: category, userId: userId, status: 'open'});
            if(data){
                if(data.category === category){
                    embedEphemeral
                        .setDescription(`<@${interaction.user.id}> hai già un ticket della stessa categoria in <#${data.channelId}>`)
                        .setTitle("Errore nell'apertura del ticket ❌")
                    await interaction.reply({embeds: [embedEphemeral], ephemeral: true });
                    return;
                }
            }
            
            const channel = await interaction.guild.channels.create({
                name: `${interaction.user.username}-ticket`,
                type: ChannelType.GuildText,
                parent: ticketsCategory,
                topic: `Utente che ha aperto il ticket: ${interaction.user.username}/${category}/${interaction.user.id}`,
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
            
            console.log(`Creating a new ticket...`)
            await ticket.create({
                userId: userId,
                channelId: channel.id,
                category: category,
                topic: topic,
                nickname: nickname,
                device: device,
                issue: issue,
            });

            const embed = new EmbedBuilder()
                .setTitle('TICKET | [Supporto Modalità]')
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

            embedEphemeral
                .setTitle('TICKET APERTO | Supporto Modalità')
                .setDescription('Hai aperto un ticket')
            //.setDescription(`<@${interaction.user.id}> consulta il ticket aperto in ${channel}`)
                .addFields({name: "Ticket aperto :white_check_mark: ", value: `<@${interaction.user.id}> consulta il ticket aperto in ${channel}`})
            await interaction.reply({embeds: [embedEphemeral], ephemeral: true});
        }
    }
}