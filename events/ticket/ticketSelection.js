const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

const { ticketsRole, debug } = require('../../configs/config.json');

const { ticketCategories } = require('../../configs/tickets_category.json');
const ticketSchema = require("../../schemas/ticketSchema");


function handlerGamemode(category, interaction){
    console.log("gamemode");
}
function handlerAccount(category, interaction) {

}

function handlerCommercial(category, interaction){

}

function handlerApplication(category, interaction){

}

module.exports = {
    
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        if(interaction.customId === 'ticketCreateSelect'){
            
            const categorySelected = interaction.values[0];
            const categoryHandlers = {};        

            for(const category of Object.keys(ticketCategories)){
                categoryHandlers[category] = eval("handler" + category.charAt(0).toUpperCase() + category.slice(1));
            }

            if(categoryHandlers[categorySelected])
                categoryHandlers[categorySelected](category, interaction);

            switch(categorySelected){
                case 'gamemode':
                    const modal = new ModalBuilder()
                    .setCustomId('modalTicket_gamemode')
                    .setTitle('createTicket_gamemode');
                    
                    const nicknameInput = new TextInputBuilder()
                    .setCustomId('nickname')
                    .setLabel('Inserisci il tuo nickname sul gioco')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Nickname sul server")
                    .setMinLength(3)
                    .setMaxLength(16)
                    .setRequired(true);	
                    
                    const deviceInput = new TextInputBuilder()
                    .setCustomId('device')
                    .setLabel('Su che piattaforma sei? (Java o Bedrock)')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Java/Bedrock")
                    .setMinLength(4)
                    .setMaxLength(7)
                    .setRequired(true);		
                    
                    const topicInput = new TextInputBuilder()
                    .setCustomId('topic')
                    .setLabel('Topic principale del ticket')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Segnalazione giocatore, bug")
                    .setMinLength(3)
                    .setMaxLength(100)
                    .setRequired(true);		
                    
                    const issueInput = new TextInputBuilder()
                    .setCustomId('issue')
                    .setLabel('Descrizione del problema')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Descrizione sintetica del problema, ogni dettaglio è importante")
                    .setMinLength(10)
                    .setMaxLength(500)
                    .setRequired(true);
                    
                    if(debug){
                        nicknameInput.setValue("Naoko__");
                        deviceInput.setValue("Java");
                        topicInput.setValue("Lorem Ipsum");
                        issueInput.setValue("Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt");
                    }
                    
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nicknameInput), 
                        new ActionRowBuilder().addComponents(deviceInput),
                        new ActionRowBuilder().addComponents(topicInput),
                        new ActionRowBuilder().addComponents(issueInput),
                        );
                        await interaction.showModal(modal);
                        
                        break;
                    }
                }
        
        if(interaction.isButton() && interaction.customId === 'btn_ping_staff'){

            const staffID = [
                ticketsRole,
            ];
    
            const roleMention = staffID.map(id => `<@${id}>`).join(' ');
            const messageContent = `${roleMention}`;
    
            const embed = new EmbedBuilder()
                .setTitle(`Staff Pinged`)
                .setDescription(`Lo staff è stato pingato, aspetta 2-4 ore`)
                .setTimestamp()
                .setFooter({text: `Staff pingato alle:`});
    
            await interaction.channel.send({
                content: messageContent,
                embeds: [embed]
            })
            await interaction.reply({
                content: 'Hai pingato lo staff',
                ephemeral: true
            })
        }
    }

}