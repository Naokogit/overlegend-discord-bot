const { PermissionsBitField} = require("discord.js");
const { ticketsRole, adminRole } = require('../configs/config.json');


function ticketPermissionDefault(interaction) {
    return [
        {
            id: interaction.guild.id, // DENY EVERYONE
            deny: [
                PermissionsBitField.Flags.ViewChannel
            ],
        },
        {
            id: interaction.user.id,
            id: ticketsRole, allow: [
                PermissionsBitField.Flags.ViewChannel
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
            id: interaction.user.id,
            id: adminRole, allow: [
                PermissionsBitField.Flags.ViewChannel
            ],
        },
    ]
}

module.exports = { ticketPermissionAdmin, ticketPermissionDefault };