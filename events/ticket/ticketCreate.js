const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, Client, Embed, shouldUseGlobalFetchAndWebSocket} = require("discord.js");

const { ticketsCategory, ticketsRole, adminRole, primaryColor, logoIMG, ticketsRoleAccount, ticketsRoleDeveloper, ticketsRoleGamemode, ticketsRoleHelper, ticketsRoleBuilder, ticketsRoleCommercial, ticketsRoleReclami, ticketsRoleStaff } = require('../../configs/config.json');
const ticket = require('../../schemas/ticketSchema');

const { ticketCategories } = require('../../configs/tickets_category.json');
const { ticketPermissionAdmin, ticketPermissionDefault, ticketPermissionGamemode, ticketPermissionAccount, ticketPermissionCommercial, ticketPermissionApplicationBuilder, ticketPermissionApplicationDeveloper, ticketPermissionApplicationHelper, ticketPermissionReclami, ticketPermissionStaff } = require('../../modules/permissionModule');

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
                .setColor(Number(primaryColor))
                .setTimestamp()
                .setFooter({text: "OverLegend", iconURL: logoIMG});
            
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
            var ticketPing;
            
            const fields = ['nickname', 'device', 'topic', 'issue', 'premium', 'newaccount', 'secondaccount', 'date', 'devrole', 'userreport', 'medialink', 'media_average', 'weekly_videos', 'channel_description', 'sanzioneId', 'staffSegnalato'];

            fields.forEach(field => { try {
                    ticketProperties[field] = interaction.fields.getTextInputValue(field);
                } catch(err) {}
            });
            
            const subcategory_label = ticketCategories[category]?.subcategory?.find(sc => sc.id === subcategory)?.label;

            ticketTitle = `${ticketCategories[category].label + " " + ticketCategories[category].emoji + (subcategory_label ? (" - " + subcategory_label) : "")}`;
            
            console.log(interaction.user.id);

            switch (category) {
                case 'gamemode':    
                    ticketName = `${interaction.user.username}-ticket`
                    ticketPermissionOverwrites = ticketPermissionGamemode(interaction);
                    ticketPing = ticketsRoleGamemode;
                    break;
                case 'account':
                    ticketName = `${interaction.user.username}-account`
                    ticketPermissionOverwrites = ticketPermissionAccount(interaction);
                    ticketPing = ticketsRoleAccount;
                    break;
                case 'application':
                    ticketName = `${interaction.user.username}-candidatura`
                    break;
                case 'commercial':
                    ticketName = `${interaction.user.username}-commerciale`
                    ticketPermissionOverwrites = ticketPermissionCommercial(interaction);
                    ticketPing = ticketsRoleCommercial;
                    break;
                case 'support':
                    ticketName = `${interaction.user.username}-support`
                    break;
            }

            switch(subcategory) {
                    // case "info":
                // case "bug_report":
                // case "user_report":
                // case "other":
                //     ticketPing = ticketsRoleGamemode;
                //     break;
                case "developer":
                    ticketPing = ticketsRoleDeveloper;
                    ticketPermissionOverwrites = ticketPermissionApplicationDeveloper(interaction);
                    break;
                case "builder":
                    ticketPing = ticketsRoleBuilder;
                    ticketPermissionOverwrites = ticketPermissionApplicationBuilder(interaction);
                    break;
                case "helper":
                    ticketPing = ticketsRoleHelper;
                    ticketPermissionOverwrites = ticketPermissionApplicationHelper(interaction);
                    break;
                case "reclamo_sanzione":
                    ticketPing = ticketsRoleReclami;
                    ticketPermissionOverwrites = ticketPermissionReclami(interaction);
                    break;
                case "segnala_staff":
                    ticketPing = ticketsRoleStaff;
                    ticketPermissionOverwrites = ticketPermissionStaff(interaction);
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
                autoIncrement: 0, // Se è il primo ticket in esistenza
                userId: userId,
                channelId: channel.id,
                category: category,
                subcategory: subcategory,
                topic: ticketProperties?.topic,
                issue: ticketProperties?.issue,
                nickname: ticketProperties?.nickname,
                device: ticketProperties?.device,
                premium: ticketProperties?.premium,
                newaccount: ticketProperties?.newaccount,
                secondaccount: ticketProperties?.secondaccount,
                date: ticketProperties?.date,
                devrole: ticketProperties?.devrole,
                userreport: ticketProperties?.userreport,
                sanzioneId: ticketProperties?.sanzioneId,
                staffSegnalato: ticketProperties?.staffSegnalato,
            });

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`TICKET | ${ticketTitle}`)
                .setDescription(`Grazie per aver contattato l'assistenza.
                Descrivi il tuo problema e attendi una risposta dallo staff.
                Ticket aperto da: <@${interaction.user.id}>`)
                // .setThumbnail('https://i.imgur.com/IWbnKLl.png')
                .setTimestamp()
                .setColor(Number(primaryColor))
                .setFooter({ text: "Data di creazione", iconURL: logoIMG });
            
            if (ticketProperties.nickname) ticketEmbed.addFields({ name: '👤 Nickname di Minecraft', value: `\`\`\`${ticketProperties.nickname}\`\`\`` });
            if (ticketProperties.device) ticketEmbed.addFields({ name: '🖥 Piattaforma', value: `\`\`\`${ticketProperties.device}\`\`\`` });
            if (ticketProperties.premium) ticketEmbed.addFields({ name: '🧊 Minecraft Premium', value: `\`\`\`${ticketProperties.premium}\`\`\`` });
            if (ticketProperties.date) ticketEmbed.addFields({ name: '📆 Disponibilità orario', value: `\`\`\`${ticketProperties.date}\`\`\`` });
            if (ticketProperties.devrole) ticketEmbed.addFields({ name: '⚒️ Ruolo desiderato', value: `\`\`\`${ticketProperties.devrole}\`\`\`` });
            if (ticketProperties.newaccount) ticketEmbed.addFields({ name: '👤 Nuovo account', value: `\`\`\`${ticketProperties.newaccount}\`\`\`` });
            if (ticketProperties.secondaccount) ticketEmbed.addFields({ name: '👤 Account secondario', value: `\`\`\`${ticketProperties.secondaccount}\`\`\`` });
            if (ticketProperties.userreport) ticketEmbed.addFields({ name: '👤 Utenti segnalati', value: `\`\`\`${ticketProperties.userreport}\`\`\`` });
            if (ticketProperties.topic) ticketEmbed.addFields({ name: '✨ Topic principale', value: `\`\`\`${ticketProperties.topic}\`\`\`` });
            if (ticketProperties.issue) ticketEmbed.addFields({ name: '🔧 Descrizione del problema', value: `\`\`\`${ticketProperties.issue}\`\`\`` });
            if (ticketProperties.medialink) ticketEmbed.addFields({ name: '📽️ Link al canale', value: `\`\`\`${ticketProperties.medialink}\`\`\`` });
            if (ticketProperties.media_average) ticketEmbed.addFields({ name: '⚖️ Media spettatori/views', value: `\`\`\`${ticketProperties.media_average}\`\`\`` });
            if (ticketProperties.weekly_videos) ticketEmbed.addFields({ name: '🔢 Numero di Live/Video settimanali', value: `\`\`\`${ticketProperties.weekly_videos}\`\`\`` });
            if (ticketProperties.channel_description) ticketEmbed.addFields({ name: '📜 Descrizione del canale e dei contenuti', value: `\`\`\`${ticketProperties.channel_description}\`\`\`` });
            if (ticketProperties.sanzioneId) ticketEmbed.addFields({ name: '🆔 Id Sanzione', value: `\`\`\`${ticketProperties.sanzioneId}\`\`\`` });
            if (ticketProperties.staffSegnalato) ticketEmbed.addFields({ name: '👮 Staff segnalato', value: `\`\`\`${ticketProperties.staffSegnalato}\`\`\`` });


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
                
            const claimTicketBtn = new ButtonBuilder()
                .setEmoji('👋')
                .setLabel('Rivendica')
                .setStyle(ButtonStyle.Success)
                .setCustomId('btnClaimTicket');
            const row = new ActionRowBuilder().addComponents(closeBtn, closeReasonBtn, claimTicketBtn);
            
            await channel.send({embeds: [ticketEmbed], components: [row]});
            const msg = await channel.send({ content: `<@&${ticketPing}>` });
            msg.delete().catch(err =>{});

            embedEphemeral
                .setTitle(`TICKET APERTO | ${ticketTitle}`)
                .setDescription('Hai aperto un ticket')
                .addFields({ name: "Ticket aperto :white_check_mark: ", value: `<@${interaction.user.id}> consulta il ticket aperto in ${channel}` });
            await interaction.reply({embeds: [embedEphemeral], ephemeral: true});
        }
    }
}