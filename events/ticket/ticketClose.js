const {
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    Client,
} = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const {
    ticketsCategory,
    ticketsRole,
    ticketsDeposit,
    primaryColor,
    logoIMG,
    ticketChannel,
} = require("../../configs/config.json");

const ticket = require("../../schemas/ticketSchema");
const getTicketCacheInformation = require("../../utils/getTicketCacheInformation");

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        if (
            (interaction.isButton() &&
                interaction.customId === "btnCloseTicket") ||
            (interaction.isModalSubmit() &&
                interaction.customId === "modalTicketCloseReason")
        ) {
            const embedConfirmDelete = new EmbedBuilder()
                .setTitle("Conferma chiusura Ticket")
                .setDescription(
                    "Cliccare su conferma per chiudere questo ticket"
                )
                .setColor(Number(primaryColor))
                .setTimestamp()
                .setFooter({ text: "OverLegend", iconURL: logoIMG });

            if (
                interaction.isModalSubmit() &&
                interaction.customId === "modalTicketCloseReason"
            ) {
                const reason = interaction.fields.getTextInputValue("reason");
                embedConfirmDelete.addFields({
                    name: "📃 Motivo:",
                    value: `\`\`\`${reason}\`\`\``,
                });

                const user = getTicketCacheInformation(interaction);

                console.log(user);
                const result = await ticket.updateOne(
                    {
                        userId: user.userId,
                        status: "open",
                        category: user.category,
                    },
                    { $set: { closingReason: reason } }
                );
                console.log("Updating closingReason...", result);
            }

            const confirmCloseBtn = new ButtonBuilder()
                .setEmoji("‼")
                .setLabel("Conferma")
                .setStyle(ButtonStyle.Danger)
                .setCustomId("btnConfirmClose");

            const row = new ActionRowBuilder().addComponents(confirmCloseBtn);

            await interaction.reply({
                embeds: [embedConfirmDelete],
                components: [row],
                fetchReply: true,
            });
        }
        if (
            interaction.isButton() &&
            interaction.customId === "btnConfirmClose"
        ) {
            const ticketInformation = getTicketCacheInformation(interaction);

            const query = {
                userId: ticketInformation.userId,
                category: ticketInformation.category,
                status: "open",
            };

            const data = await ticket.findOne(query);

            if (!data) {
                interaction.reply({
                    content:
                        "Il ticket è già impostato su 'closed', probabilmente c'è stato qualche problema...",
                    ephemeral: true,
                });
                return;
            }

            var reason = data?.closingReason;
            var date = data?.createdAt;
            var claimedBy = data?.assignedTo;
            var ticketID = data?.autoIncrement;
            var ticketMongoID = data?._id?.toString(); // Usa l'_id di MongoDB per privacy
            date = Math.floor(new Date(date).getTime() / 1000);

            const file = await createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                saveImages: true, // Converti le immagini in base64 per mantenerle accessibili anche dopo l'eliminazione del canale
                // filename: `${interaction.channel}-transcript.html`
            });

            await ticket.updateOne(query, {
                $set: {
                    status: "closed",
                    transcriptHTML: file.attachment.toString(),
                },
            });

            depositChannel =
                interaction.client.channels.cache.get(ticketsDeposit);
            // var msg = await interaction.channel.send({content: `Transcript cache:`, files: [file]});

            // const transcriptURL = `https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`

            await interaction.channel.delete().catch((err) => {});

            const dmEmbed = new EmbedBuilder()
                .setTitle("Ticket Chiuso")
                .setDescription(
                    `Il ticket che hai aperto in precedenza è stato chiuso.\nGrazie per averci contattato.`
                )
                .setColor(Number(primaryColor))
                .setThumbnail(logoIMG)
                .setTimestamp()
                .setFooter({ text: "OverLegend", iconURL: logoIMG })
                .addFields(
                    {
                        name: "📃 Motivo di chiusura:",
                        value: `${
                            reason
                                ? `\`\`\`${reason}\`\`\``
                                : "```Nessun motivo specificato```"
                        }`,
                    },
                    {
                        name: "⌚ Aperto il:",
                        value: `<t:${date}>`,
                        inline: true,
                    },
                    {
                        name: "🔒 Chiuso da:",
                        value: `<@${interaction.user.id}>`,
                        inline: true,
                    }
                );

            const dmButton = new ButtonBuilder()
                .setLabel("Canale Ticket")
                .setStyle(ButtonStyle.Link)
                .setURL(ticketChannel);

            const dmTranscript = new ButtonBuilder()
                .setLabel("Transcript")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    `http://overlegend.it/tickets/${ticketMongoID || ticketID}`
                );

            const dmRow = new ActionRowBuilder().addComponents(dmButton);
            const depositRow = new ActionRowBuilder().addComponents(
                dmTranscript
            );

            const dmDeposit = new EmbedBuilder()
                .setTitle("Ticket Chiuso")
                .addFields(
                    { name: "🆔 Ticket ID:", value: `${ticketID}` },
                    {
                        name: "📕 Categoria:",
                        value: `\`${ticketInformation.category}\``,
                        inline: true,
                    },
                    {
                        name: "📚 Sotto categoria:",
                        value: `\`${ticketInformation.subcategory}\``,
                        inline: true,
                    },
                    {
                        name: "🚪 Aperto da:",
                        value: `<@${ticketInformation.userId}>`,
                        inline: true,
                    },
                    {
                        name: "⌚ Aperto il:",
                        value: `<t:${date}>`,
                        inline: true,
                    },
                    {
                        name: "🔒 Chiuso da:",
                        value: `<@${interaction.user.id}>`,
                        inline: true,
                    },
                    {
                        name: "👤 Assegnato a:",
                        value: `${
                            claimedBy === "unassigned"
                                ? "Nessuno"
                                : `<@${claimedBy}>`
                        }`,
                        inline: true,
                    },
                    {
                        name: "📃 Motivo di chiusura:",
                        value: `\`\`\`${
                            reason ? reason : "Nessun motivo specificato"
                        }\`\`\``,
                        inline: true,
                    }
                )
                // { name: "🔗 Link Transcript:      ", value: `[Link](${transcriptURL})`, inline: true })
                .setColor(Number(primaryColor))
                .setFooter({ text: "OverLegend", iconURL: logoIMG })
                .setThumbnail(logoIMG)
                .setTimestamp();

            await depositChannel
                .send({ embeds: [dmDeposit], components: [depositRow] })
                .catch((err) => {});
            // await depositChannel.send({ content: 'Transcript cache:', files: [file] });

            await interaction.guild.client.users
                .fetch(ticketInformation.userId)
                .then((u) => {
                    u.send({ embeds: [dmEmbed], components: [dmRow] }).catch(
                        (err) => {}
                    );
                });

            // await interaction.user.send({ embeds: [dmEmbed], components: [dmRow]}).catch((err) => {});
        }
        if (
            interaction.isButton() &&
            interaction.customId === "btnCloseReasonTicket"
        ) {
            if (
                interaction.member.roles.cache.some((r) => r.id === ticketsRole)
            ) {
                const modal = new ModalBuilder()
                    .setCustomId("modalTicketCloseReason")
                    .setTitle("Motivo di chiusura ticket");

                const topicInput = new TextInputBuilder()
                    .setCustomId("reason")
                    .setLabel("Motivo della chiusura")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Motivo")
                    .setMinLength(3)
                    .setMaxLength(250)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(topicInput)
                );
                await interaction.showModal(modal);
            } else {
                await interaction.reply({
                    content: "Non disponi di abbastanza privilegi.",
                    ephemeral: true,
                });
            }
        }
    },
};
