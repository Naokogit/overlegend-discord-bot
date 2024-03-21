const { SlashCommandBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChatInputCommandInteraction, StringSelectMenuBuilder, Embed, } = require('discord.js');

const { ticketCategories } = require('../../configs/tickets_category.json');
const { primaryColor, ticketIMG, ticketsRole, logoIMG } = require('../../configs/config.json');
const emojis = require('../../configs/emojis.json');
const ticket = require('../../schemas/ticketSchema');
const getTicketCacheInformation = require('../../utils/getTicketCacheInformation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('ticket')
        .addSubcommand(command => command.setName('setup').setDescription('Setup ticket channel')
            .addChannelOption(option => 
                option.setName('channel')
                    .setRequired(true)
                    .setDescription('Specifica canale')
                    .addChannelTypes(ChannelType.GuildText),
            ))
        .addSubcommand(command => command.setName('addmember').setDescription('Aggiungi un membro al ticket').addUserOption(option => 
            option.setName('user')
                .setRequired(true)
                .setDescription("Specifica l'utente ")
            ))
        .addSubcommand(command => command.setName('removemember').setDescription('Rimovi un membro al ticket').addUserOption(option => 
            option.setName('user')
                .setRequired(true)
                .setDescription("Specifica l'utente ")
            )
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        switch(sub){
            case 'setup':

                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                    await interaction.reply({content: '❌ Non puoi effettuare questa azione', ephemeral: true});
                    return;
                }

                var channel = interaction.options.getChannel('channel');
                const channel_interaction = interaction.client.channels.cache.get(channel.id);

                const select = new StringSelectMenuBuilder()
                .setCustomId('ticketCreateSelect')
                .setPlaceholder('🌍 Seleziona una categoria')
                .setMinValues(1)

                var desc = "";
                
                for(const category of Object.keys(ticketCategories)){
                    desc += "**" + ticketCategories[category].emoji + " "+ ticketCategories[category].label + "**" + "\n";
                    desc += "\`\`\`" + ticketCategories[category].long_description + "\`\`\`" + "\n";
                    console.log(category);
                    ticketCategories[category].value = category;
                    select.addOptions(ticketCategories[category]);
                }

                const row = new ActionRowBuilder().addComponents(select)
                
                const ticket_embed = new EmbedBuilder()
                    .setColor(Number(primaryColor))
                    .setTitle(`${emojis.ol} SISTEMA DI SUPPORTO`)
                    .setDescription(`
                    Selezionando una delle opzioni qua sotto potrai
                    parlare con lo staff in un canale privato.
                    
                    ${desc}
                    **⚠️ Non abusare del sistema dei ticket aprendone a vuoto. Può comportare una sospensione o un warn.**
                    `)
                    .setImage(ticketIMG);
                    // .setFooter({text: "OverLegend • Sistema di supporto ticketing", iconURL: "https://i.imgur.com/IWbnKLl.png"})
                
                await channel_interaction.send({embeds: [ticket_embed], components: [row]});
                await interaction.reply({content: 'Setup ticket effettuato', ephemeral: true});
            break;
            case "addmember":
                if (!interaction.member.roles.cache.has(ticketsRole)) {
                    await interaction.reply({ content: `❌ Non puoi effettuare questa azione`, ephemeral: true });
                    return;
                }

                var user = interaction.options.getUser('user');
                var channel = interaction.client.channels.cache.get(interaction.channelId);
                
                var embed = new EmbedBuilder()
                    .setTimestamp()
                    .setColor(Number(primaryColor))
                    .setFooter({ text: "OverLegend", iconURL: logoIMG });
                if (!channel.permissionsFor(user).has(PermissionsBitField.Flags.ViewChannel)) {
                    
                    embed.setTitle(`➕ Aggiunto nuovo membro al ticket`)
                        .setDescription(`<@${user.id}> è stato aggiunto al ticket <#${channel.id}>`)
                    const ticketInformation = getTicketCacheInformation(interaction);
                    
                    const query = {userId: ticketInformation.userId, category: ticketInformation.category, status: "open"}
                    
                    var addedUsers = [];
                    const data = await ticket.findOne(query);
                    
                    addedUsers = data?.addedUsers;
                    addedUsers.push(user.id);
                    
                    await ticket.updateOne(query, { $set: { addedUsers: addedUsers } }).then(async function () {
                        await channel.permissionOverwrites.edit(user, {
                            ViewChannel: true,
                            ReadMessageHistory: true,
                        });
                        await interaction.reply({ embeds: [embed] });
                    });
                    
                    return;
                }
                embed.setTitle("❌ Questo membro è già presente")
                .setDescription(`<@${user.id}> è già presente all'interno del ticket <#${channel.id}>`)
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            case "removemember":
                if (!interaction.member.roles.cache.has(ticketsRole)) {
                    await interaction.reply({ content: `❌ Non puoi effettuare questa azione`, ephemeral: true });
                    return;
                }
                var user = interaction.options.getUser('user');
                var channel = interaction.client.channels.cache.get(interaction.channelId);

                var embed = new EmbedBuilder()
                .setTimestamp()
                .setColor(Number(primaryColor))
                .setFooter({ text: "OverLegend", iconURL: logoIMG });

                if (channel.permissionsFor(user).has(PermissionsBitField.Flags.ViewChannel)) {
                    embed.setTitle(`➖ Rimosso membro dal ticket`)
                        .setDescription(`<@${user.id}> è stato rimosso dal ticket <#${channel.id}>`)
                    
                    const ticketInformation = getTicketCacheInformation(interaction);
                
                    const query = {userId: ticketInformation.userId, category: ticketInformation.category, status: "open"}
                    
                    var addedUsers = []
                    const data = await ticket.findOne(query);
                    addedUsers = data?.addedUsers;

                    addedUsers.splice(addedUsers.indexOf(user.id), 1)

                    await ticket.updateOne(query, { $set: { addedUsers: addedUsers } }).then(async function () {
                        await channel.permissionOverwrites.edit(user, { ViewChannel: false });
                        await interaction.reply({ embeds: [embed] });
                    });
                    return;
                }
                embed.setTitle("❌ Questo membro non è presente")
                .setDescription(`<@${user.id}> non è presente all'interno del ticket <#${channel.id}>`)
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}