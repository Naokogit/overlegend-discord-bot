const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, CommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChatInputCommandInteraction, StringSelectMenuBuilder, } = require('discord.js');

const { ticketCategories } = require('../../configs/tickets_category.json');
const { primaryColor, ticketIMG } = require('../../configs/config.json');

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
                    .setColor(primaryColor)
                    .setTitle('SISTEMA DI SUPPORTO <:ol:1194007647582699590>')
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
        }
    }
}