const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, CommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChatInputCommandInteraction, StringSelectMenuBuilder, } = require('discord.js');


const tickets_category = require('../../configs/tickets_category.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(command => command.setName('setup').setDescription('Setup ticket').addChannelOption(option => 
            option.setName('channel')
                .setRequired(true)
                .setDescription('Specifica canale')
                .addChannelTypes(ChannelType.GuildText),)

    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        switch(sub){
            case 'setup':
                const channel = interaction.options.getChannel('channel');
                const channel_interaction = interaction.client.channels.cache.get(channel.id);

                var desc = "";
                tickets_category.forEach(cat =>{
                    desc += "**" + cat.emoji + " "+ cat.label + "**" + "\n";
                    desc += "\`\`\`" + cat.long_description + "\`\`\`" + "\n";
                });
            
                const ticket_embed = new EmbedBuilder()
                    .setColor(0x503519)
                    .setTitle('SISTEMA DI SUPPORTO <:ol:1194007647582699590>')
                    .setDescription(`
                    Selezionando una delle opzioni qua sotto potrai
                    parlare con lo staff in un canale privato.
                    
                    ${desc}
                    **⚠️ Non abusare del sistema dei ticket aprendone a vuoto. Può comportare una sospensione o un warn.**
                    `)
                    .setImage('https://images-ext-1.discordapp.net/external/xDmWfZQnKepl4YtOXjKymdzkbO6mecZuO54ji85CjJ4/https/imgur.com/u5w5CQr.png?format=webp&quality=lossless&width=1216&height=111')  
                
                // const btn_open_ticket = new ButtonBuilder()
                //     .setCustomId('confirm')
                //     .setLabel('Apri un ticket')
                //     .setEmoji('🎉')
                //     .setStyle(ButtonStyle.Secondary)
                //     .setCustomId('btn_open_ticket');
                
                // const row = new ActionRowBuilder()
                //     .addComponents(btn_open_ticket);

                const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('ticketCreateSelect')
                    .setPlaceholder('🌍 Seleziona una categoria')
                    .setMinValues(1)
                    .addOptions(tickets_category)
                )
                
                await channel_interaction.send({embeds: [ticket_embed], components: [select]});
                // await channel_interaction.send({embeds: [ticket_embed], components: [row]});
                await interaction.reply({content: 'Setup ticket effettuato', ephemeral: true});
        }
    }
}