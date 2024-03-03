const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, Client} = require("discord.js");
const { createTranscript } = require('discord-html-transcripts');
const { ticketsCategory, ticketsRole, ticketsDeposit } = require('../../configs/config.json');

const ticket = require('../../schemas/ticketSchema');
const getTicketCacheInformation = require('../../utils/getTicketCacheInformation');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if((interaction.isButton() && interaction.customId === 'btnCloseTicket') ||
        (interaction.isModalSubmit() && interaction.customId === 'modalTicket_closeReason')){

            const embedConfirmDelete = new EmbedBuilder()
            .setTitle('Conferma chiusura Ticket')
            .setDescription('Clicca su conferma per chiudere il ticket')
            .setColor(0x503519);

            if(interaction.isModalSubmit() && interaction.customId === 'modalTicket_closeReason'){
                const reason = interaction.fields.getTextInputValue('reason');
                embedConfirmDelete.addFields({name: "Motivo", value: `*${reason}*`});

                const user = getTicketCacheInformation(interaction);

                const result = await ticket.updateOne({userId: user.userId, status: "open", category: user.category}, {$set: {closingReason: reason}});
                console.log("Updating closingReason...", result);
            }

            const confirmCloseBtn = new ButtonBuilder()
            .setEmoji('‼')
            .setLabel('Conferma')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('btnConfirmClose');
            
            const row = new ActionRowBuilder().addComponents(confirmCloseBtn);
                
            await interaction.reply({embeds: [embedConfirmDelete], components: [row], fetchReply: true});
        }
        if(interaction.isButton() && interaction.customId === 'btnConfirmClose'){
            
            // console.log(interaction);

            const ticketInformation = getTicketCacheInformation(interaction);

            const query = {userId: ticketInformation.userId, category: ticketInformation.category, status: "open"}

            const data = await ticket.findOne(query);
            var reason = data?.closingReason;

            await ticket.updateOne(query, {$set: {status: "closed"}});
            // await ticket.deleteOne({userId: userId});
            const file = await createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                filename: `${interaction.channel}-transcript.html`
            });
            
            depositChannel = interaction.client.channels.cache.get(ticketsDeposit);
            var msg = await interaction.channel.send({content: `Transcript cache:`, files: [file]});
            
            const transcriptURL = `https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`
            //console.log(msg.attachments.first()?.url);
            await interaction.channel.delete().catch(err => {});
            // delete tickets[interaction.user.id];
            
            
            const dmEmbed = new EmbedBuilder()
            .setTitle('Ticket chiuso')
            .setDescription(`Il tuo ticket è stato chiuso`)
            .setColor(0x503519)
            .setTimestamp()
            .addFields({name: "Motivo:", value: `${reason ? reason : "*Nessun motivo specificato*"}`},)

            const dmButton = new ButtonBuilder()
            .setLabel('Canale Ticket')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/channels/846773259852840960/1213161189870403684')
            
            const dmTranscript = new ButtonBuilder()
            .setLabel('Transcript')
            .setStyle(ButtonStyle.Link)
            .setURL(transcriptURL)
            
            const dmRow = new ActionRowBuilder().addComponents(dmButton, dmTranscript);
            
            
            // console.log(reason, interaction.isModalSubmit(), interaction.customId === 'modalTicket_closeReason');

            const dmDeposit = new EmbedBuilder()
            .setTitle('Ticket chiuso')
            .addFields(
                {name: "Aperto da:", value: `<@${interaction.user.id}>`},
                {name: "Chiuso da:", value: `<@${interaction.user.id}>`},
                {name: "Motivo:", value: `${reason ? reason : "*Nessun motivo specificato*"}`},
                {name: "Link Transcript:", value: `[Link](${transcriptURL})`})
                .setColor(0x503519)
                .setTimestamp()
                
                await depositChannel.send({embeds: [dmDeposit]}).catch((err) => {});
                await depositChannel.send({content: 'Transcript cache:', files: [file]});
                await interaction.user.send({ embeds: [dmEmbed], components: [dmRow]}).catch((err) => {});
        }
        if(interaction.isButton() && interaction.customId === 'btnCloseReasonTicket'){
            if(interaction.member.roles.cache.some(r => r.id === ticketsRole)){
                const modal = new ModalBuilder()
                .setCustomId('modalTicket_closeReason')
                .setTitle('Motivo di chiusura ticket');
                
                const topicInput = new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Motivo della chiusura')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Motivo")
                .setMinLength(3)
                .setMaxLength(250)
                .setRequired(true);		

                modal.addComponents(new ActionRowBuilder().addComponents(topicInput));
                await interaction.showModal(modal);
            }else{
                interaction.reply({content: "Non disponi di abbastanza privilegi.", ephemeral: true});
            }
        }
    }
}