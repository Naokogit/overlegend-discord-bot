require('dotenv').config();
const { Client, IntentsBitField, Collection, GatewayIntentBits, CommandInteraction, ActivityTypes, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { clientId, guildId, ticketsCategory, ticketsRole } = require('./config.json');
const interactionCreate = require('./events/interactionCreate');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildPresences,
    ],
});

require('./commandHandler')(client)
require('./eventHandler')(client)

client.login(process.env.TOKEN);



// Ticketing System

var tickets = [];

client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isButton() && interaction.customId == 'btn_open_ticket'){
		const modal = new ModalBuilder()
			.setCustomId('ticketModal')
			.setTitle('Support Ticket');
		
		const topicInput = new TextInputBuilder()
			.setCustomId('topic')
			.setLabel('Topic')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder("Topic del problema")
			.setMinLength(3)
			.setMaxLength(25)
			.setRequired(true);		

		const issueInput = new TextInputBuilder()
			.setCustomId('issue')
			.setLabel('Issue')
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder("Spiegazione problema")
			.setMinLength(3)
			.setMaxLength(250)
			.setRequired(true);
			
		const firstActionRow = new ActionRowBuilder().addComponents(topicInput);
		const secondActionRow = new ActionRowBuilder().addComponents(issueInput);
		

		modal.addComponents(firstActionRow, secondActionRow);
		await interaction.showModal(modal);

	} else if(interaction.isModalSubmit() && interaction.customId === 'ticketModal') {
		const topic = interaction.fields.getTextInputValue('topic');
		const issue = interaction.fields.getTextInputValue('issue');

		const channel = await interaction.guild.channels.create({
			name: `${interaction.user.username}-ticket`,
			type: ChannelType.GuildText,
			parent: ticketsCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: interaction.user.id,
					id: ticketsRole,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				
			],
		});

		const embed = new EmbedBuilder()
			.setTitle('Ticket opened')
			.setDescription('Ticked created')
			.setTimestamp()
			.setFooter({text: 'Ticket created at'})
			.addFields(
				{ name: 'User', value: `${interaction.user.username}` },
				{ name: 'Topic', value: `${topic}` },
				{ name: 'Issue', value: `${issue}` }
			)

		const closeBtn = new ButtonBuilder()
			.setEmoji('🔒')
			.setLabel('Close Ticket')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('btn_close_ticket');
		
		const closeReasonBtn = new ButtonBuilder()
			.setEmoji('🔒')
			.setLabel('Chiudi con motivo')
			.setStyle(ButtonStyle.Danger)
			.setCustomId('btn_close_reason_ticket');

		const pingBtn = new ButtonBuilder()
			.setEmoji('🔒')
			.setLabel('Close Ticket')
			.setStyle(ButtonStyle.Secondary)
			.setCustomId('btn_ping_staff');

		const row = new ActionRowBuilder().addComponents(closeBtn, closeReasonBtn, pingBtn);

		await channel.send({embeds: [embed], components: [row]});

		await interaction.reply({
			content: `${interaction.user.tag} il tuo ticket è stato aperto e lo puoi visualizzare in ${channel}`,
			ephemeral: true
		});

	
	}
});

// Close Ticket

client.on(Events.InteractionCreate, async interaction =>{
	if(interaction.isButton() && interaction.customId === 'btn_close_ticket'){
		delete tickets[interaction.user.id];
		interaction.channel.delete();

		const dmEmbed = new EmbedBuilder()
			.setTitle('Ticket closed')
			.setDescription('Il tuo ticket è stato chiuso')
			.setColor('Blue')
			.setTimestamp()
			.setFooter({text: `Sent from ${interaction.guild.name}`});

		const dmButton = new ButtonBuilder()
			.setLabel('Return')
			.setStyle(ButtonStyle.Link)
			.setURL('https://discord.com/channels/846773259852840960/1213161189870403684')

		const dmRow = new ActionRowBuilder()
			.addComponents(dmButton)
		interaction.user.send({ embeds: [dmEmbed], components: [dmRow]});
		return;
	}
});

/**
 * @param {CommandInteraction} interaction 
 */
client.on(Events.InteractionCreate, async interaction => {
	if(interaction.isButton() && interaction.customId === 'btn_close_reason_ticket'){
		if(interaction.member.roles.cache.some(r => r.id === ticketsRole)){
			const modal = new ModalBuilder()
				.setCustomId('ticketCloseReason')
				.setTitle('Motivo di chiusura ticket');
		
			const topicInput = new TextInputBuilder()
				.setCustomId('reason')
				.setLabel('Motivo')
				.setStyle(TextInputStyle.Paragraph)
				.setPlaceholder("Motivo")
				.setMinLength(3)
				.setMaxLength(250)
				.setRequired(true);		

				
				const firstActionRow = new ActionRowBuilder().addComponents(topicInput);
				
				
				modal.addComponents(firstActionRow);
				await interaction.showModal(modal);
		}else{
			interaction.reply({content: "Non puoi chiudere questo ticket con un motivo", ephemeral: true});
		}
	}else if(interaction.isModalSubmit() && interaction.customId === 'ticketCloseReason') {
		const reason = interaction.fields.getTextInputValue('reason');

		delete tickets[interaction.user.id];
		interaction.channel.delete();

		const dmEmbed = new EmbedBuilder()
			.setTitle('Ticket closed')
			.setDescription(`Il tuo ticket è stato chiuso con motivo:\n${reason}`)
			.setColor('Blue')
			.setTimestamp()
			.setFooter({text: `Sent from ${interaction.guild.name}`});

		const dmButton = new ButtonBuilder()
			.setLabel('Return')
			.setStyle(ButtonStyle.Link)
			.setURL('https://discord.com/channels/846773259852840960/1213161189870403684')

		const dmRow = new ActionRowBuilder()
			.addComponents(dmButton)
		interaction.user.send({ embeds: [dmEmbed], components: [dmRow]});
		interaction.reply({content: ".", ephemeral: true}); // Null reply
	}
});

// Ping Staff

client.on(Events.InteractionCreate, async interaction =>{
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
});