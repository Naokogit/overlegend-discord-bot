const { Events, Interaction } = require("discord.js");
const suggestion = require('../../schemas/suggestionSchema');
const formatResults = require("../../utils/formatResults");
const { suggestionsChannelId } = require('../../configs/config.json');

module.exports = {
    name: Events.InteractionCreate,

    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        try {
            if (!interaction.isButton() || !interaction.customId) return;
    
            const [type, suggestionId, action] = interaction.customId.split('.');
            if (!type || !suggestionId || !action || type !== 'suggestion') return;
    
            await interaction.deferReply({ ephemeral: true });
    
            const targetSuggestion = await suggestion.findOne({ autoIncrement: suggestionId });
            if(!targetSuggestion) return;

            const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
            const targetMessageEmbed = targetMessage.embeds[0];
    
            switch (action) {
                case 'approve':
                case 'reject': {
                    if (!interaction.memberPermissions.has('Administrator')) {
                        await interaction.editReply('Non hai il permesso');
                        return;
                    }
                    const status = action === 'approve' ? 'approved' : 'rejected';
                    const color = action === 'approve' ? 0x84e660 : 0xff6161;
                    const statusEmoji = action === 'approve' ? '💚 Approved' : '❌ Rejected';
                    
                    targetSuggestion.status = status;
                    targetMessageEmbed.data.color = color;
                    targetMessageEmbed.fields[2].value = statusEmoji;
    
                    await targetSuggestion.save();
                    interaction.editReply(`Suggestion ${status}!`);

                    targetMessage.edit({
                        embeds: [targetMessageEmbed],
                        components: [targetMessage.components[0]],
                    });
                    const suggestion_channel = interaction.client.channels.cache.get(suggestionsChannelId);
                    const thread = suggestion_channel.threads.cache.find(x => x.id === targetSuggestion.threadId);
                    await thread.setLocked(true);

                    break;
                }
                case 'upvote':
                case 'downvote': {
                    const voteType = action === 'upvote' ? 'upvotes' : 'downvotes';
                    const hasVoted = targetSuggestion[`${voteType}`].includes(interaction.user.id);
    
                    if (hasVoted) {
                        await interaction.editReply('You have already casted your vote for this suggestion.');
                        return;
                    }
    
                    targetSuggestion[voteType].push(interaction.user.id);
                    await targetSuggestion.save();
    
                    interaction.editReply(`${action === 'upvote' ? 'Up' : 'Down'}voted suggestion!`);
    
                    targetMessageEmbed.fields[3].value = formatResults(
                        targetSuggestion.upvotes,
                        targetSuggestion.downvotes,
                    );

                    targetMessage.edit({
                        embeds: [targetMessageEmbed],
                    });
                    break;
                }
                default:
                    await interaction.editReply('Invalid action.');
                    break;
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while processing your request.');
        }
    }
    
    // async execute(interaction) {
    //     if(!interaction.isButton() || !interaction.customId) return;

    //     try{

    //         const [type, suggestionId, action] = interaction.customId.split('.');

    //         if(!type || !suggestionId || !action) return;
    //         if(type !== 'suggestion') return;

    //         await interaction.deferReply({ephemeral: true});

    //         const targetSuggestion = await suggestion.findOne({autoIncrement: suggestionId});
    //         const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
    //         const targetMessageEmbed = targetMessage.embeds[0];

    //         if(action === 'approve'){
    //             if(!interaction.memberPermissions.has('Administrator')) {
    //                 await interaction.editReply('Non hai il permesso');
    //                 return;
    //             }

    //             targetSuggestion.status = 'approved';
    //             targetMessageEmbed.data.color = 0x84e660;
    //             targetMessageEmbed.fields[2].value = '💚 Approved';

    //             await targetSuggestion.save();
    //             interaction.editReply('Suggestion approved!');

    //             targetMessage.edit({
    //                 embeds: [targetMessageEmbed],
    //                 components: [targetMessage.components[0]],
    //             });

    //             return;
    //         }

    //         if(action === 'reject'){
    //             if(!interaction.memberPermissions.has('Administrator')) {
    //                 await interaction.editReply('Non hai il permesso');
    //                 return;
    //             }
    //             targetSuggestion.status = 'rejected';
    //             targetMessageEmbed.data.color = 0xff6161;
    //             targetMessageEmbed.fields[2].value = '❌ Rejected';

    //             await targetSuggestion.save();

    //             interaction.editReply('Suggestion rejected!');

    //             targetMessage.edit({
    //                 embeds: [targetMessageEmbed],
    //                 components: [targetMessage.components[0]],
    //             });

    //             return;
    //         }

    //         if(action === 'upvote'){
    //             const hasVotes = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

    //             if(hasVotes){
    //                 await interaction.editReply('You have already casted your vote for this suggestion.');
    //                 return;
    //             }

    //             targetSuggestion.upvotes.push(interaction.user.id);

    //             await targetSuggestion.save();

    //             interaction.editReply('Upvoted suggestion!');

    //             targetMessageEmbed.fields[3].value = formatResults(
    //                 targetSuggestion.upvotes,
    //                 targetSuggestion.downvotes,
    //             );

    //             targetMessage.edit({
    //                 embeds: [targetMessageEmbed],
    //             });

    //             return;
    //         }
    //         if(action === 'downvote'){
    //             const hasVotes = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);

    //             if(hasVotes){
    //                 await interaction.editReply('You have already casted your vote for this suggestion.');
    //                 return;
    //             }

    //             targetSuggestion.downvotes.push(interaction.user.id);

    //             await targetSuggestion.save();

    //             interaction.editReply('Downvoted suggestion!');

    //             targetMessageEmbed.fields[3].value = formatResults(
    //                 targetSuggestion.upvotes,
    //                 targetSuggestion.downvotes,
    //             );

    //             targetMessage.edit({
    //                 embeds: [targetMessageEmbed],
    //             });

    //             return;
    //         }

    //     } catch(err) {
    //         console.log(err);
    //     }
    // }
}