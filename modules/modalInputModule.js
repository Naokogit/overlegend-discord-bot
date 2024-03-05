const { ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

const nicknameInput = createModalInput("nickname", "Inserisci il tuo nickname sul gioco", TextInputStyle.Short, "Nickname sul server", 3, 16, true);

const issueInput = createModalInput("issue", "Descrivi nel dettaglio la tua richiesta", TextInputStyle.Paragraph, "Descrizione della richiesta", 10, 1024, true);

const premiumInput = createModalInput("premium", "Hai acquistato Minecraft? (Java Premium)", TextInputStyle.Short, "Si/No", 2, 2, true)

const deviceInput = createModalInput("device", "Su che piattaforma sei? (Java o Bedrock)", TextInputStyle.Short, "Java/Bedrock", 4, 7, true);

const topicInput = createModalInput("topic", "Topic principale del ticket", TextInputStyle.Short, "Segnalazione giocatore, bug", 3, 100, true);		

function createModalInput(customId, label, style, placeholder, minLength, maxLength, required) {
    return new TextInputBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style)
        .setPlaceholder(placeholder)
        .setMinLength(minLength)
        .setMaxLength(maxLength)
        .setRequired(required);
}

module.exports = { nicknameInput, issueInput, premiumInput, deviceInput, topicInput };