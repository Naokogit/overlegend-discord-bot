const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, CommandInteraction, ActionRowBuilder, ComponentType, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('setup-ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => 
            option.setName('channel')
                .setRequired(true)
                .setDescription('Specifica canale')
                .addChannelTypes(ChannelType.GuildText),
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const channel_interaction = interaction.client.channels.cache.get(channel.id);
    
        const ticket_embed = new EmbedBuilder()
            .setColor(0xF9BE2A)
            .setTitle('RICHIEDI SUPPORTO')
            .setDescription(`
            Cliccando il pulsante, potrai aprire un ticket privato con lo staff.

Si prega di includere quanto segue:
:white_small_square: Il proprio username (di minecraft)
:white_small_square: Il problema dettagliato che si sta riscontrando.

:warning: I ticket che non rispettano questo formato verranno chiusi
:warning: Non abusare di questa funzione!`)

            .setImage('https://images-ext-1.discordapp.net/external/xDmWfZQnKepl4YtOXjKymdzkbO6mecZuO54ji85CjJ4/https/imgur.com/u5w5CQr.png?format=webp&quality=lossless&width=1216&height=111')  
        const btn_open_ticket = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('btn_open_ticket');
        
        const row = new ActionRowBuilder()
            .addComponents(btn_open_ticket);
        
        const reply = await channel_interaction.send({embeds: [ticket_embed], components: [row]});
        
        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
        });

        collector.on('collect', (interaction) => {
            if (interaction.customId === 'btn_open_ticket') {
                interaction.reply({ content: "Hai cliccato bnt apri ticket", ephemeral: true });
                return;
            }
        })

    }
}