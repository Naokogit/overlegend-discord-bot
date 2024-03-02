const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, CommandInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, } = require('discord.js');

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
            .setLabel('Apri un ticket')
            .setEmoji('🎉')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('btn_open_ticket');
        
        const row = new ActionRowBuilder()
            .addComponents(btn_open_ticket);
        
        await channel_interaction.send({embeds: [ticket_embed], components: [row]});
        // const reply = await channel_interaction.send({embeds: [ticket_embed], components: [row]});
        
        // const collector = reply.createMessageComponentCollector({
        //     componentType: ComponentType.Button,
        // });

        // collector.on('collect', async (collect_interaction) => {
        //     if (collect_interaction.customId === 'btn_open_ticket') {
        //         // collect_interaction.reply({ content: "Hai cliccato bnt apri ticket", ephemeral: true });

        //         const modal = new ModalBuilder({
        //             customId: `myModal-${collect_interaction.user.id}`,
        //             title: "My Modal",
        //         })
        //         const favoriteColorInput = new TextInputBuilder({
        //             customId: 'favoriteColorInput',
        //             label: "What's your favorite color?",
        //             style: TextInputStyle.Short,
        //         })
        
        //         const hobbiesInput = new TextInputBuilder({
        //             customId: 'hobbiesInput',
        //             label: "What's some of your favorite hobbies?",
        //             style: TextInputStyle.Paragraph,
        //         });
        
        //         const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        //         const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        //         modal.addComponents(firstActionRow, secondActionRow);
        
        //         await collect_interaction.showModal(modal);
        //         const filter = (collect_interaction) => collect_interaction.customId === `myModal-${collect_interaction.user.id}`;
        //         collect_interaction
        //             .awaitModalSubmit({filter, time: 30_000})
        //             .then((modalInteraction) => {
        //                 const favoriteColorValue = modalInteraction.fields.getTextInputValue('favoriteColorInput');
        //                 const hobbiesValue = modalInteraction.fields.getTextInputValue('hobbiesInput');
        
        //                 modalInteraction.reply(`Your favorite color ${favoriteColorValue}\nYour hobbies: ${hobbiesValue}`);
        //             })
        //             .catch((err) =>{
        //                 console.log("Error", err);
        //             })


        //         return;
        //     }
        // })

    }
}