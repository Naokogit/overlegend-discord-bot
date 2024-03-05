/**
 * 
 * @param {CommandInteraction} interaction 
 * @returns 
 */

const { CommandInteraction } = require("discord.js");

function getTicketCacheInformation(interaction){
    const channelId = interaction.channelId;
    const channel = interaction.client.channels.cache.get(channelId);
    const userId = channel.topic.split('/').slice(-1)[0];
    const subcategory = channel.topic.split('/').slice(-2)[0];
    const category = channel.topic.split('/').slice(-3)[0];
    // const userName = channel.topic.split('/').slice(-4)[0];

    const user = { userId: userId, category: category, subcategory: subcategory };
    // const user = { userId: userId, category: category, subcategory: subcategory, userName: userName };

    return user;
}

module.exports = getTicketCacheInformation;