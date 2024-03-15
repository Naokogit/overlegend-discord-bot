const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

const { ticketsRole, debug, primaryColor, logoIMG } = require('../../configs/config.json');

const { ticketCategories } = require('../../configs/tickets_category');
const { nicknameInput, deviceInput, issueInput, topicInput } = require("../../modules/modalInputModule");

module.exports = {
    
    name: Events.InteractionCreate,
    async execute(interaction, client) {

        if(interaction.customId === 'ticketCreateSelect'){
            
            const categorySelected = interaction.values[0];

            if (!ticketCategories[categorySelected])
                return;

            // const modal = new ModalBuilder()
            //     .setCustomId(`modalTicket_${categorySelected}`)
            //     .setTitle(`${categorySelected}`);

            const embed = new EmbedBuilder().setTitle('Seleziona una sotto categoria').setTimestamp().setColor(Number(primaryColor)).setFooter({text:"OverLegend",iconURL: logoIMG});

            switch(categorySelected){
                // case 'gamemode':

                //     if(debug){
                //         nicknameInput.setValue("Naoko__");
                //         deviceInput.setValue("Java");
                //         topicInput.setValue("Lorem Ipsum");
                //         issueInput.setValue("Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt");
                //     }

                //     modal.addComponents(
                //         new ActionRowBuilder().addComponents(nicknameInput), 
                //         new ActionRowBuilder().addComponents(deviceInput),
                //         new ActionRowBuilder().addComponents(topicInput),
                //         new ActionRowBuilder().addComponents(issueInput),
                //         );
                //     await interaction.showModal(modal);
                        
                //     break;
                case 'gamemode':
                case 'application':
                case 'commercial':
                case 'account':

                    const row = new ActionRowBuilder();
                    var desc = "";

                    ticketCategories[categorySelected].subcategory.forEach((subcategory) =>{
                        const subcategoryBtn = new ButtonBuilder()
                            .setEmoji(subcategory.emoji)
                            .setLabel(subcategory.label)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId(`btnSubCategory_${subcategory.id}`);
                        desc += `**${subcategory.emoji} ${subcategory.label}** - ${subcategory.text}\n`;

                        row.addComponents(subcategoryBtn);
                    });
                    embed.setDescription(desc);
                    
                    await interaction.reply({embeds: [embed], components: [row], ephemeral: true});
                    break;
            } 
        }

        // if(interaction.isButton() && interaction.customId === 'btn_ping_staff'){

        //     const staffID = [
        //         ticketsRole,
        //     ];
    
        //     const roleMention = staffID.map(id => `<@${id}>`).join(' ');
        //     const messageContent = `${roleMention}`;
    
        //     const embed = new EmbedBuilder()
        //         .setTitle(`Staff Pinged`)
        //         .setDescription(`Lo staff è stato pingato, aspetta 2-4 ore`)
        //         .setTimestamp()
        //         .setFooter({text: `Staff pingato alle:`});
    
        //     await interaction.channel.send({
        //         content: messageContent,
        //         embeds: [embed]
        //     })
        //     await interaction.reply({
        //         content: 'Hai pingato lo staff',
        //         ephemeral: true
        //     })
        // }
    }

}