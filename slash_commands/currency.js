const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('currency')
    .setDescription('🧐 Realiza un lanzamiento de moneda. [cara o cruz]'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'cara' : 'cruz';
    const imageUrl = result === 'cara' ? 'https://cdn.discordapp.com/attachments/1248493745465200670/1249493475452256317/cara.png?ex=666780fb&is=66662f7b&hm=9b189d8c44aa10e539da2bca652190c238af30875e30df1f2765e880523d36dc&' : 'https://cdn.discordapp.com/attachments/1248493745465200670/1249493475087356044/cruz.png?ex=666780fa&is=66662f7a&hm=e3c2347446fe7234ec61f9b00a5cf8a30c4bc7604c481af0f984e501bda0c758&';

    const embed = {
      color: 0x0099ff,
      title: 'Lanzamiento de moneda',
      description: `Resultado: ${result}`,
      image: { url: imageUrl }
    };

    interaction.reply({ embeds: [embed] });
  },
};
