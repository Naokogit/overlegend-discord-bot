const {
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    Client,
} = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");

const ticket = require("../../schemas/ticketSchema");
const getTicketCacheInformation = require("../../utils/getTicketCacheInformation");

const { ticketCategories } = require("../../configs/tickets_category.json");

var subcategories = []
for (const category of Object.keys(ticketCategories)) {
    if(ticketCategories[category].subcategory){
        subcategories[category] = [];
        ticketCategories[category].subcategory.forEach(cat => {
            subcategories[category].push("btnSubCategory_" + cat.id);
        });
    }
}


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId.includes("btnSubCategory")) {
            const category = isSubcategory(interaction.customId).category;
            console.log("CATEGORY", category, interaction.customId);
            var subcategory = interaction.customId.replace("btnSubCategory_", "");

            ticketCategories[category].subcategory.forEach((element) => {
                if (element.id == subcategory) subcategory = element;
            });

            const modal = new ModalBuilder()
                .setCustomId(`modalTicket_${category}-${subcategory.id}`)
                // .setTitle(`${subcategory.label}`);
                .setTitle(`modalTicket_${category}-${subcategory.id}`);
                
            switch (subcategory.id) {
                case "reset_password":
                    const nicknameInput = new TextInputBuilder()
                        .setCustomId("nickname")
                        .setLabel("Inserisci il tuo nickname sul gioco")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Nickname sul server")
                        .setMinLength(3)
                        .setMaxLength(16)
                        .setRequired(true);
                    const issueInput = new TextInputBuilder()
                        .setCustomId("issue")
                        .setLabel("Descrivi nel dettaglio la tua richiesta")
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("Descrizione della richiesta")
                        .setMinLength(10)
                        .setMaxLength(1024)
                        .setRequired(true);
                    const deviceInput = new TextInputBuilder()
                        .setCustomId("device")
                        .setLabel("Su che piattaforma sei? (Java o Bedrock)")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Java/Bedrock")
                        .setMinLength(4)
                        .setMaxLength(7)
                        .setRequired(true);
                    const premiumInput = new TextInputBuilder()
                        .setCustomId("premium")
                        .setLabel("Hai acquistato Minecraft? (Java Premium)")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Si/No")
                        .setMinLength(2)
                        .setMaxLength(2)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput),
                        new ActionRowBuilder().addComponents(issueInput),
                        new ActionRowBuilder().addComponents(deviceInput),
                        new ActionRowBuilder().addComponents(premiumInput)
                    );

                    await interaction.showModal(modal);
                    break;
            }
        }
    },
};

function isSubcategory(id) {
    for (const category of Object.keys(subcategories)) {
        if (subcategories[category].includes(id)) {
            return { found: true, category: category };
        }
    }
    return { found: false, category: null };
}
