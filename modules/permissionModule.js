const { PermissionsBitField } = require("discord.js");
const { ticketsRole, adminRole } = require('../configs/config.json');

// https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags

/*
CreateInstantInvite
KickMembers
BanMembers
Administrator
ManageChannels
ManageGuild
AddReactions
ViewAuditLog
PrioritySpeaker
Stream
ViewChannel
SendMessages
SendTTSMessages
ManageMessages
EmbedLinks
AttachFiles
ReadMessageHistory
MentionEveryone
UseExternalEmojis
ViewGuildInsights
Connect
Speak
MuteMembers
DeafenMembers
MoveMembers
UseVAD
ChangeNickname
ManageNicknames
ManageRoles
ManageWebhooks
ManageEmojisAndStickers
ManageGuildExpressions
UseApplicationCommands
RequestToSpeak
ManageEvents
ManageThreads
CreatePublicThreads
CreatePrivateThreads
UseExternalStickers
SendMessagesInThreads
UseEmbeddedActivities
ModerateMembers
ViewCreatorMonetizationAnalytics
UseSoundboard
UseExternalSounds
SendVoiceMessages

*/

const ticketViewPermissions = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.ReadMessageHistory,
]

function ticketPermissionDefault(interaction) {
    return [
        {
            id: interaction.guild.id, // DENY EVERYONE
            deny: [
                PermissionsBitField.Flags.ViewChannel
            ],
        },
        {
            id: interaction.user.id, allow: ticketViewPermissions,
        },
        {
            id: ticketsRole, allow: [
                PermissionsBitField.Flags.ViewChannel,
            ],
        },
    ]
}

function ticketPermissionAdmin(interaction) {
    return [
        {
            id: interaction.guild.id,
            deny: [
                PermissionsBitField.Flags.ViewChannel
            ],
        },
        {
            id: interaction.user.id, allow: ticketViewPermissions
        },
        {
            id: adminRole, allow: [
                PermissionsBitField.Flags.ViewChannel
            ],
        },
    ]
}

module.exports = { ticketPermissionAdmin, ticketPermissionDefault, ticketViewPermissions };