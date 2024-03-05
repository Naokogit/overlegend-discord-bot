const { ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

const nicknameInput = createModalInput("nickname", "Inserisci il tuo nickname sul gioco", TextInputStyle.Short, "Nickname sul server", 3, 16, true);

const issueInput = createModalInput("issue", "Descrivi nel dettaglio la tua richiesta", TextInputStyle.Paragraph, "Descrizione della richiesta", 10, 1024, true);

const premiumInput = createModalInput("premium", "Hai acquistato Minecraft? (Java Premium)", TextInputStyle.Short, "Si/No", 2, 2, true)

const deviceInput = createModalInput("device", "Su che piattaforma sei? (Java o Bedrock)", TextInputStyle.Short, "Java/Bedrock", 4, 7, true);

const topicInput = createModalInput("topic", "Topic principale del ticket", TextInputStyle.Short, "Segnalazione giocatore, bug", 3, 100, true);

const newAccountInput = createModalInput("newaccount", "Nickname del nuovo account", TextInputStyle.Short, "Inserisci il nickname del nuovo Account", 3, 16, true);

const secondAccountInput = createModalInput("secondaccount", "Nickname del secondo account", TextInputStyle.Short, "Inserisci il nickname del secondo account", 3, 16, true);

const dateInput = createModalInput("date", "Indica la disponibilità di orario", TextInputStyle.Short, "Fascia oraria: (es. Merc. 18:00 - 20:00)", 5, 100, true);


// Partnership

const mediaLinkInput = createModalInput("medialink", "Link al canale (YouTube/Twitch/Tiktok)", TextInputStyle.Short, "https://...", 1, 1024, true);

const mediaAverageViewersInput = createModalInput("average", "Media spettatori live o views per video", TextInputStyle.Short, "Inserisci un numero", 5, 100, true);

// numero di live/video a settimana

// descrizione canale/contenuti

// Candidatura 
const devroleInput = createModalInput("devrole", "Per quale ruolo ti stai candidando", TextInputStyle.Short, "Dev o Pluginner", 3, 9, true);

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

module.exports = { nicknameInput, issueInput, premiumInput, deviceInput, topicInput, newAccountInput, mediaLinkInput, dateInput, mediaAverageViewersInput, devroleInput, secondAccountInput };