const goodbyeChannelId = "1244496193254461460";

module.exports = async (client, member) => {
  const { guild } = member;

  const goodbyeChannel = await guild.channels.fetch(goodbyeChannelId);
 
  if (goodbyeChannel)
    await goodbyeChannel.send(
     ` 💤 **${member.user.username}** ha abandonado el servidor**!!** `
    );
};
