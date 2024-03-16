const { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, SlashCommandBuilder, PermissionFlagsBits, CommandInteraction } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('modal')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const modal = new ModalBuilder({
            customId: `myModal-${interaction.user.id}`,
            title: "My Modal",
        })
        const favoriteColorInput = new TextInputBuilder({
            customId: 'favoriteColorInput',
            label: "What's your favorite color?",
            style: TextInputStyle.Short,
        })

        const hobbiesInput = new TextInputBuilder({
            customId: 'hobbiesInput',
            label: "What's some of your favorite hobbies?",
            style: TextInputStyle.Paragraph,
        });

        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
        const filter = (interaction) => interaction.customId === `myModal-${interaction.user.id}`;
        interaction
            .awaitModalSubmit({filter, time: 30_000})
            .then((modalInteraction) => {
                const favoriteColorValue = modalInteraction.fields.getTextInputValue('favoriteColorInput');
                const hobbiesValue = modalInteraction.fields.getTextInputValue('hobbiesInput');

                modalInteraction.reply(`Your favorite color ${favoriteColorValue}\nYour hobbies: ${hobbiesValue}`);
            })
            .catch((err) =>{
                console.log("Error", err);
            })
    }
}