const { SlashCommandBuilder, PermissionsBitField, ChannelType, StringSelectMenuInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const { primaryColor, logoIMG } = require('../../configs/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('verify')
        .addSubcommand(command => command.setName('setup').setDescription('Setup roles')
            .addChannelOption(option =>
                option.setName('channel')
                    .setRequired(true)
                    .setDescription('Specifica canale')
                    .addChannelTypes(ChannelType.GuildText))),
    /**
     * 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    
    async execute(interaction) {
        try {
            const sub = interaction.options.getSubcommand();
            switch (sub) {
                case 'setup':

                    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        await interaction.reply({ content: '❌ Non puoi effettuare questa azione', ephemeral: true });
                        return;
                    }

                    const embed = new EmbedBuilder()
                        .setTitle("VERIFICATI PER INIZIARE")
                        .setDescription(`
                    Benvenuto nel Discord ufficiale di **OVERLEGEND**\n
                    Per continuare ad utilizzare il Server e poter visualizzare i canali testuali e vocali dedicati ti invitiamo a leggere ed accettare il regolamento.\n
                    📌 *E' vietata la pubblicazione di link non inerenti al Network*
                    📌 *Tieni rispetto per l'utenza del server, tenendo un linguaggio scurrile e moderato.*
                    📌 *Utilizza i canali e le categorie corrette per i principali argomenti del Server.*
                    📌 *Utilizza i Ticket in modo appropriato, per qualsiasi evenienza lo staff è sempre a disposizione.*
                    📌 *E' vietata la condivisione di media o argomenti che violano gli standard della community (18+).*\n
                    🔆 Buona permanenza.
                    - Lo staff di OVERLEGEND`)
                        .setColor(Number(primaryColor))
                        .setImage("https://images-ext-2.discordapp.net/external/k1YZbJ2tXttDdABQNhzLTv4nkShFxMu-hcF2TkpCeS4/https/imgur.com/uT4ki5Z.png?format=webp&quality=lossless&width=960&height=88")
                        .setFooter({ text: "OverLegend", iconURL: logoIMG });
                
                    const verifyButton = new ButtonBuilder()
                        .setCustomId("btnVerify")
                        .setEmoji('✅')
                        .setLabel("Verificati")
                        .setStyle(ButtonStyle.Primary);
                
                
                    const actionRow = new ActionRowBuilder().addComponents(verifyButton);
      
                    var channel = interaction.options.getChannel('channel');
                    const channel_interaction = interaction.client.channels.cache.get(channel.id);
                    channel_interaction.send({ embeds: [embed], components: [actionRow] });
                
                    await interaction.reply({ content: 'Setup verification effettuato', ephemeral: true });
            }
        } catch (err) { console.log(err); }
    }
}