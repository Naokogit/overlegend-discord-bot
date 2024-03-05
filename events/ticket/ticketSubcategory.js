const {
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require("discord.js");

const { ticketCategories } = require("../../configs/tickets_category.json");

const { nicknameInput, issueInput, deviceInput, premiumInput, newAccountInput, secondAccountInput, devroleInput, dateInput } = require("../../modules/modalInputModule");

const {subcategories, isSubcategory} = require('../../utils/getAllSubcategories');

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
                .setTitle(`${subcategory.label}`);
                
            switch (subcategory.id) {
                case "builder":
                case "helper":
                case "reset_password":
                case "login_problems":
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput),
                        new ActionRowBuilder().addComponents(issueInput),
                        new ActionRowBuilder().addComponents(deviceInput),
                        new ActionRowBuilder().addComponents(premiumInput)
                    );
                    break;
                case "transfer_account":
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput),
                        new ActionRowBuilder().addComponents(issueInput),
                        new ActionRowBuilder().addComponents(premiumInput),
                        new ActionRowBuilder().addComponents(newAccountInput),
                    );
                    break;
                case "secondary_account":
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput),
                        new ActionRowBuilder().addComponents(issueInput),
                        new ActionRowBuilder().addComponents(premiumInput),
                        new ActionRowBuilder().addComponents(secondAccountInput),
                        new ActionRowBuilder().addComponents(dateInput),
                        
                    );
                    break;
                case "developer":
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput),
                        new ActionRowBuilder().addComponents(issueInput),
                        new ActionRowBuilder().addComponents(deviceInput),
                        new ActionRowBuilder().addComponents(premiumInput),
                        new ActionRowBuilder().addComponents(devroleInput)
                    );
                    break;
            }
            await interaction.showModal(modal);
        }
    },
};


