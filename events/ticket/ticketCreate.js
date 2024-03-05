const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, Client, Embed, shouldUseGlobalFetchAndWebSocket} = require("discord.js");

const { ticketsCategory, ticketsRole, adminRole } = require('../../configs/config.json');
const ticket = require('../../schemas/ticketSchema');

const { ticketCategories } = require('../../configs/tickets_category.json');
const { ticketPermissionAdmin, ticketPermissionDefault } = require('../../modules/permissionModule');

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        if(interaction.isModalSubmit() && interaction.customId.includes('modalTicket_')) {

            // category_sub-category
            const category = interaction.customId.split('_')[1].split('-')[0];
            const subcategory = interaction.customId.split('-')[1];

            console.log(category, subcategory);

            const userId = interaction.user.id;

            const embedEphemeral = new EmbedBuilder()   
            .setColor(0x503519)
            .setTimestamp()
            .setFooter({text: "OverLegend", iconURL: "https://i.imgur.com/IWbnKLl.png"});
            
            const data = await ticket.findOne({category: category, subcategory: subcategory, userId: userId, status: 'open'});
            
            if(data){
                embedEphemeral
                .setDescription(`<@${interaction.user.id}> hai già un ticket della stessa categoria o della stessa sottocategoria in <#${data.channelId}>`)
                .setTitle("Errore nell'apertura del ticket ❌")
                if(data.category === category){
                    await interaction.reply({embeds: [embedEphemeral], ephemeral: true });
                    return;
                }
            }
            
            var ticketName;
            var ticketTitle;
            var ticketPermissionOverwrites;
            var ticketProperties = {};
            
            const fields = ['nickname', 'device', 'topic', 'issue', 'premium', 'newaccount', 'secondaccount', 'date', 'devrole'];

            fields.forEach(field => { try {
                    ticketProperties[field] = interaction.fields.getTextInputValue(field);
                } catch(err) {}
            });
            
            const subcategory_label = ticketCategories[category]?.subcategory?.find(sc => sc.id === subcategory)?.label;

            ticketTitle = `${ticketCategories[category].label + " " + ticketCategories[category].emoji + (subcategory_label ? (" - " + subcategory_label) : "")}`;
            
            switch (category) {
                case 'gamemode':    
                    ticketName = `${interaction.user.username}-ticket`
                    ticketPermissionOverwrites = ticketPermissionDefault(interaction);
                    break;
                case 'account':
                    ticketName = `${interaction.user.username}-account`
                    ticketPermissionOverwrites = ticketPermissionAdmin(interaction);
                    break;
                case 'application':
                    ticketName = `${interaction.user.username}-candidatura`
                    ticketPermissionOverwrites = ticketPermissionDefault(interaction);
                    break;
            }
                
            console.log(`[DB] Creating a new ticket...`)
            const channel = await interaction.guild.channels.create({
                name: ticketName,
                type: ChannelType.GuildText,
                parent: ticketsCategory,
                topic: `Utente che ha aperto il ticket: ${interaction.user.username}/${category}${subcategory ? "/" + subcategory : "/none"}/${interaction.user.id}`,
                permissionOverwrites: ticketPermissionOverwrites,
            });
            
            await ticket.create({
                userId: userId,
                channelId: channel.id,
                category: category,
                subcategory: subcategory,
                topic: ticketProperties?.topic,
                issue: ticketProperties?.issue,
                nickname: ticketProperties?.nickname,
                device: ticketProperties?.device,
                premium: ticketProperties?.premium,
            });

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`TICKET | ${ticketTitle}`)
                .setDescription(`Grazie per aver contattato l'assistenza.
                Descrivi il tuo problema e attendi una risposta dallo staff.
                Ticket aperto da: <@${interaction.user.id}>`)
                // .setThumbnail('https://i.imgur.com/IWbnKLl.png')
                .setTimestamp()
                .setColor(0x503519)
                .setFooter({text:"Data di creazione",iconURL: "https://i.imgur.com/IWbnKLl.png"})
            
            if(ticketProperties.nickname) ticketEmbed.addFields({ name: '👤 Nickname di Minecraft', value: `\`\`\`${ticketProperties.nickname}\`\`\`` });
            if(ticketProperties.device) ticketEmbed.addFields({ name: '🖥 Piattaforma', value: `\`\`\`${ticketProperties.device}\`\`\`` });
            if(ticketProperties.premium) ticketEmbed.addFields({ name: '🧊 Minecraft Premium', value: `\`\`\`${ticketProperties.premium}\`\`\`` });
            if(ticketProperties.topic) ticketEmbed.addFields({ name: '✨ Topic principale', value: `\`\`\`${ticketProperties.topic}\`\`\`` });
            if(ticketProperties.issue) ticketEmbed.addFields({ name: '🔧 Descrizione del problema', value: `\`\`\`${ticketProperties.issue}\`\`\`` });
                
            const closeBtn = new ButtonBuilder()
                .setEmoji('🔒')
                .setLabel('Chiudi')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('btnCloseTicket');
                
            const closeReasonBtn = new ButtonBuilder()
                .setEmoji('🎫')
                .setLabel('Chiudi con motivo')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('btnCloseReasonTicket');

            const row = new ActionRowBuilder().addComponents(closeBtn, closeReasonBtn);
            
            await channel.send({embeds: [ticketEmbed], components: [row]});
            const msg = await channel.send({ content: `<@&${ticketsRole}>` });
            msg.delete().catch(err =>{});

            embedEphemeral
                .setTitle(`TICKET APERTO | ${ticketTitle}`)
                .setDescription('Hai aperto un ticket')
                .addFields({name: "Ticket aperto :white_check_mark: ", value: `<@${interaction.user.id}> consulta il ticket aperto in ${channel}`})
            await interaction.reply({embeds: [embedEphemeral], ephemeral: true});
        }
    }
}