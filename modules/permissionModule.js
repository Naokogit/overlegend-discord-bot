const { PermissionsBitField } = require("discord.js");
const { ticketsRole, adminRole, ticketsRoleAccount, ticketsRoleBuilder, ticketsRoleCommercial, ticketsRoleDeveloper, ticketsRoleGamemode, ticketsRoleHelper } = require('../configs/config.json');

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
];

function buildPermissionObject(id, allow, deny = []) {
    return {
        id: id,
        allow: allow,
        deny: deny
    };
}

function ticketPermission(interaction, roleID) {
    const defaultPermissions = [
        buildPermissionObject(interaction.guild.id, [], [PermissionsBitField.Flags.ViewChannel]),
        buildPermissionObject(interaction.user.id, ticketViewPermissions, []),
        buildPermissionObject(roleID, ticketViewPermissions, []),
    ];

    return defaultPermissions;
}

function ticketPermissionDefault(interaction) {
    return ticketPermission(interaction, ticketsRole);
}

function ticketPermissionAdmin(interaction) {
    return ticketPermission(interaction, adminRole);
}

function ticketPermissionGamemode(interaction) {
    return ticketPermission(interaction, ticketsRoleGamemode);
}

function ticketPermissionAccount(interaction) {
    return ticketPermission(interaction, ticketsRoleAccount);
}

function ticketPermissionCommercial(interaction) {
    return ticketPermission(interaction, ticketsRoleCommercial);
}

function ticketPermissionApplicationBuilder(interaction) {
    return ticketPermission(interaction, ticketsRoleBuilder);
}

function ticketPermissionApplicationDeveloper(interaction) {
    return ticketPermission(interaction, ticketsRoleDeveloper);
}

function ticketPermissionApplicationHelper(interaction) {
    return ticketPermission(interaction, ticketsRoleHelper);    
}
// const ticketViewPermissions = [
//     PermissionsBitField.Flags.ViewChannel,
//     PermissionsBitField.Flags.SendMessages,
//     PermissionsBitField.Flags.EmbedLinks,
//     PermissionsBitField.Flags.ReadMessageHistory,
// ]

// function ticketPermissionDefault(interaction) {
//     return [
//         {
//             id: interaction.guild.id, // DENY EVERYONE
//             deny: [
//                 PermissionsBitField.Flags.ViewChannel
//             ],
//         },
//         {
//             id: interaction.user.id, allow: ticketViewPermissions,
//         },
//         {
//             id: ticketsRole, allow: [
//                 PermissionsBitField.Flags.ViewChannel,
//             ],
//         },
//     ]
// }

// function ticketPermissionAdmin(interaction) {
//     return [
//         {
//             id: interaction.guild.id,
//             deny: [
//                 PermissionsBitField.Flags.ViewChannel
//             ],
//         },
//         {
//             id: interaction.user.id, allow: ticketViewPermissions
//         },
//         {
//             id: adminRole, allow: [
//                 PermissionsBitField.Flags.ViewChannel
//             ],
//         },
//     ]
// }

function ticketPermissionGamemode(interaction) {
}

module.exports = { ticketPermissionAdmin, ticketPermissionDefault, ticketViewPermissions, ticketPermissionGamemode, ticketPermissionAccount, ticketPermissionCommercial, ticketPermissionApplicationBuilder, ticketPermissionApplicationDeveloper, ticketPermissionApplicationHelper};