const {
    SlashCommandBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    PermissionsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");


const suggestion = require("../../schemas/suggestionSchema");
const formatResults = require('../../utils/formatResults');
const suggestionSchema = require("../../schemas/suggestionSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggestion")
        .setDescription("suggestion"),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            const modal = new ModalBuilder()
                .setTitle("Feedback")
                .setCustomId(`suggestion-${interaction.user.id}`);

            const titleInput = new TextInputBuilder()
                .setCustomId("suggestion-title")
                .setLabel("Titolo del feedback")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Scrivi il titolo")
                .setMinLength(5)
                .setMaxLength(100)
                .setRequired(true);
            const suggestionInput = new TextInputBuilder()
                .setCustomId("suggestion-input")
                .setLabel("Descrivi la proposta")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Descrivi la proposta")
                .setMinLength(50)
                .setMaxLength(4000)
                .setRequired(true);
            modal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(suggestionInput)
            );

            await interaction.showModal(modal);

            const modalInteraction = await interaction
                .awaitModalSubmit({
                    time: 1000 * 60 * 30
                })
                .catch((err) => console.log(err));

            await modalInteraction.deferReply({ ephemeral: true });

            let suggestionMessage;

            try {
                suggestionMessage = await interaction.channel.send(
                    "Creating suggestion, wait..."
                );
            } catch (error) {
                modalInteraction.editReply("Failed to create suggestion message");
                return;
            }

            const suggestionText = modalInteraction.fields.getTextInputValue("suggestion-input");
            const suggestionTitle = modalInteraction.fields.getTextInputValue("suggestion-title");



            const newSuggestion = suggestion({
                autoIncrement: 0,
                userId: interaction.user.id,
                messageId: suggestionMessage.id,
                title: suggestionTitle,
                content: suggestionText,
            });

            await await newSuggestion.save();

            modalInteraction.editReply('Suggestion created!');

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ size: 256 })
                })
                .addFields([
                    {name: 'Title', value: suggestionTitle},
                    {name: 'Suggestion', value: suggestionText},
                    {name: 'Status', value: "Pending"},
                    {name: 'Votes', value: formatResults()}
                ])
                .setColor('Yellow');

            const upvoteButton = new ButtonBuilder()
                .setEmoji('👍')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`suggestion.${newSuggestion.autoIncrement}.upvote`)
            const downvoteButton = new ButtonBuilder()
                .setEmoji('👎')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`suggestion.${newSuggestion.autoIncrement}.downvote`)
            
            const approveButton = new ButtonBuilder()
                .setEmoji('👌')
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`suggestion.${newSuggestion.autoIncrement}.approve`)

            const rejectButton = new ButtonBuilder()
                .setEmoji('🗑')
                .setLabel('Reject')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`suggestion.${newSuggestion.autoIncrement}.reject`)


            const firstRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
            const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

            suggestionMessage.edit({
                content: `${interaction.user} Suggestion created!`,
                embeds: [embed],
                components: [firstRow, secondRow]
            });
        } catch(err) { console.log(err)}
    },
};
