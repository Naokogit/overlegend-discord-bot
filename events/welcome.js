const { Events, EmbedBuilder } = require("discord.js")

const { welcomeChannelId, primaryColor, logoIMG, welcomeIMG} = require('../configs/config.json');

const frasi = require('../configs/welcome.json');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {
    
        
        const random = frasi[Math.floor(Math.random() * frasi.length)]

        const embed = new EmbedBuilder()
            .setTitle(`Benvenuto nel Discord ufficiale di OVERLEGEND`)
            .setDescription(`Benvenuto <@${member.id}> su OverLegend, \n${random}`)
            .setColor(Number(primaryColor))
            .setImage(welcomeIMG)
            .setThumbnail(logoIMG)
            .setTimestamp()
            .setFooter({ text: "OverLegend", iconURL: logoIMG });

        const channel = member.guild.channels.cache.get(welcomeChannelId);
        channel.send({embeds: [embed]});
        member.send({embeds: [embed]}).catch(err => { }); 
    }
}