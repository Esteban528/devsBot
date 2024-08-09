const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildExplicitContentFilter } = require('discord.js');
 
module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('server')
    .setDescription('💾 Utilice este comando para verificar la información del servidor'),
  async execute(interaction) {
    const serwer = interaction.guild;
    const owner = await serwer.fetchOwner().catch(() => null);
    const onlineMembers = serwer.members.cache.filter((member) => member.presence?.status === 'online');
    const { channels, roles } = serwer;
    const sortowaneRole = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
    const roleUserów = sortowaneRole.filter(role => !role.managed);
    const roleManaged = sortowaneRole.filter(role => role.managed);
    const BoosterCount = serwer.members.cache.filter(member => member.roles.cache.has('1249987041467301889')).size; 
 
    const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];
 
      for (const role of roles) {
        const roleString = `<@&${role.id}>`;
 
        if (roleString.length + totalLength > maxFieldLength) break;
 
        totalLength += roleString.length + 1;
        result.push(roleString);
      }
 
      return result.length;
    };
 
    const allRolesCount = roles.cache.size - 1;
    const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
    const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum]);
    const verificationLevelMap = {
      [GuildExplicitContentFilter.Disabled]: 'Low',
      [GuildExplicitContentFilter.MembersWithoutRoles]: 'Medium',
      [GuildExplicitContentFilter.AllMembers]: 'Hard',
    };
    const verificationLevel = verificationLevelMap[serwer.explicitContentFilter] || 'Unknown';
    const userId = '954592544539443240'; 
    const mention = `<@${userId}>`;
 
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({ name: serwer.name, iconURL: serwer.iconURL({ dynamic: true }) })
      .addFields(
        { name: `<:_:1243296521009758208>  Server ID:`, value: `└ ${serwer.id}`, inline: true },
        { name: `<:_:1243296498125635584> Fecha de Creación:`, value: `└ <t:${Math.floor(serwer.createdTimestamp / 1000)}:R>`, inline: true },
        { name: `<:_:1243296514600865832> Dueños:`, value: `└ ${owner?.user?.toString() || 'dueño'}\n└ ${mention}`, inline: true },
        { name: `<:_:1243296475958738974> Miembros (${serwer.memberCount})`, value: `└ **${onlineMembers.size}** Online ✅\n└ **${BoosterCount}** Boosters 💜`, inline: true },
        { name: `<:_:1243296390902321173> Canales (${totalChannels})`, value: `└ **${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}** Texto\n└ **${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}** Voz`, inline: true },
        { name: `<:_:1243296460917833808> Otros:`, value: `└ Verificación nivel: **${verificationLevel}**`, inline: true },
        { name: `<:_:1243296544351060118> Roles (${allRolesCount})`, value: `└ **${maxDisplayRoles(roleUserów)}** Normal roles` }
      )
      .setImage('https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&')
      .setFooter({ text: `Invocado por: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
      .setTimestamp();
 
    await interaction.reply({ embeds: [embed] });
  },
};
