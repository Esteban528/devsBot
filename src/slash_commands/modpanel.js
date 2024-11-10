const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("modpanel")
		.setDescription("🏛 Panel solo para Admins.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption((option) =>
			option
				.setName("usuario")
				.setDescription("Ingresa un usuario a moderar.")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("razon")
				.setDescription("🏛 La razón de tu acción.")
				.setRequired(true),
		),

	async execute(interaction, Client) {
		const { guild, options } = interaction;
		const target = options.getMember("usuario");
		const reason = options.getString("razon") || "No hay una razón.";
		const username = target;
		const user = interaction.user.id;

		if (target === interaction.user) {
			return await interaction.reply({
				content: "¡No puedes moderar a ti mismo!",
				ephemeral: true,
			});
		}

		// Tiempo
		const tRow = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("1")
				.setLabel("Por 5 Minutos")
				.setEmoji("⏳")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("2")
				.setLabel("Por 10 Minutos")
				.setEmoji("⏳")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("3")
				.setLabel("Por 1 Hora")
				.setEmoji("⏲")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("4")
				.setLabel("Por 1 Día")
				.setEmoji("⏰")
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId("5")
				.setLabel("Por 1 Semana")
				.setEmoji("🕰")
				.setStyle(ButtonStyle.Primary),
		);

		// Mod
		const Row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("ban")
				.setLabel("Ban")
				.setEmoji("🔨")
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId("kick")
				.setLabel("Kick")
				.setEmoji("📝")
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId("untimeout")
				.setEmoji("✅")
				.setLabel("Quitar aislamiento")
				.setStyle(ButtonStyle.Success),
		);

		const embed = new EmbedBuilder()
			.setTitle("Panel de moderación")
			.setColor("#0099ff")
			.setImage(
				"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
			)
			.setDescription(`Este es el panel de moderación de <@${target.id}>!`)
			.addFields(
				{ name: "Nombre", value: `${username}`, inline: true },
				{ name: "Usuario", value: `<@${target.id}>`, inline: true },
				{ name: "User ID", value: `${target.id}`, inline: true },
				{ name: "Reason", value: `${reason}`, inline: false },
			)
			.setThumbnail(await target.displayAvatarURL())
			.setTimestamp();

		const msg = await interaction.reply({
			embeds: [embed],
			components: [Row, tRow],
			ephemeral: true,
		});

		const collector = msg.createMessageComponentCollector();

		const embed3 = new EmbedBuilder()
			.setColor("#0099ff")
			.setImage(
				"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
			)
			.setTimestamp()
			.setFooter({ text: `Moderador: ${interaction.user.username}` });

		collector.on("collect", async (i) => {
			try {
				if (i.customId === "ban") {
					if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
						return await i.reply({
							content: "No tienes permisos para dar **BAN** a los miembros!",
							ephemeral: true,
						});
					}

					await interaction.guild.members.ban(target, { reason });

					embed3
						.setTitle("Ban")
						.setDescription(
							`¡Has sido baneado de ${i.guild.name}! || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					// No se envía DM
					await i.reply({
						content: `<@${target.id}> ha sido baneado!`,
						ephemeral: true,
					});
				}

				if (i.customId === "untimeout") {
					if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						return await i.reply({
							content:
								"No tienes permisos para quitar el estado de **aislamiento** a los miembros!",
							ephemeral: true,
						});
					}
					await target.timeout(null);

					embed
						.setTitle("Apelación")
						.setDescription(
							`¡Has sido liberado del aislamiento en ${i.guild.name}! || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					await target.send({ embeds: [embed] }).catch((err) => {
						return i.reply({
							content: "No se pudo enviar el mensaje al usuario en DM.",
							ephemeral: true,
						});
					});

					await i.reply({
						content: `<@${target.id}> ha sido liberado del aislamiento ✅.`,
						ephemeral: true,
					});
				}

				if (i.customId === "kick") {
					if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) {
						return await i.reply({
							content: "No tienes permisos para dar **KICK** a los miembros!",
							ephemeral: true,
						});
					}

					await interaction.guild.members.kick(target, { reason });

					embed
						.setTitle("Kick")
						.setDescription(
							`¡Has recibido un kick en ${i.guild.name}! || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					// No se envía DM
					await i.reply({
						content: `<@${target.id}> ha sido expulsado!`,
						ephemeral: true,
					});
				}

				if (i.customId === "1") {
					if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						return await i.reply({
							content:
								"No tienes permisos para poner a los miembros en **aislamiento**!",
							ephemeral: true,
						});
					}

					await target.timeout(300000, reason).catch((err) => {
						return i.reply({
							content: "¡Hubo un error al poner al miembro en aislamiento!",
							ephemeral: true,
						});
					});

					embed
						.setTitle("Aislamiento")
						.setDescription(
							`Te han puesto en un aislamiento de **5 Minutos** || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					await target.send({ embeds: [embed] }).catch((err) => {
						return i.reply({
							content: "No se pudo enviar el mensaje al usuario en DM.",
							ephemeral: true,
						});
					});

					await i.reply({
						content: `<@${target.id}> ha sido puesto en aislamiento de 5 minutos.`,
						ephemeral: true,
					});
				}

				if (i.customId === "2") {
					if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						return await i.reply({
							content:
								"No tienes permisos para poner a los miembros en **aislamiento**!",
							ephemeral: true,
						});
					}

					await target.timeout(600000, reason).catch((err) => {
						return i.reply({
							content: "¡Hubo un error al poner al miembro en aislamiento!",
							ephemeral: true,
						});
					});

					embed
						.setTitle("Aislamiento")
						.setDescription(
							`Te han puesto en un aislamiento de **10 Minutos** || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					await target.send({ embeds: [embed] }).catch((err) => {
						return i.reply({
							content: "No se pudo enviar el mensaje al usuario en DM.",
							ephemeral: true,
						});
					});

					await i.reply({
						content: `<@${target.id}> ha sido puesto en aislamiento de 10 minutos.`,
						ephemeral: true,
					});
				}

				if (i.customId === "3") {
					if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						return await i.reply({
							content:
								"No tienes permisos para poner a los miembros en **aislamiento**!",
							ephemeral: true,
						});
					}

					await target.timeout(3600000, reason).catch((err) => {
						return i.reply({
							content: "¡Hubo un error al poner al miembro en aislamiento!",
							ephemeral: true,
						});
					});

					embed
						.setTitle("Aislamiento")
						.setDescription(
							`Te han puesto en un aislamiento de **1 Hora** || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					await target.send({ embeds: [embed] }).catch((err) => {
						return i.reply({
							content: "No se pudo enviar el mensaje al usuario en DM.",
							ephemeral: true,
						});
					});

					await i.reply({
						content: `<@${target.id}> ha sido puesto en aislamiento de 1 hora.`,
						ephemeral: true,
					});
				}

				if (i.customId === "4") {
					if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						return await i.reply({
							content:
								"No tienes permisos para poner a los miembros en **aislamiento**!",
							ephemeral: true,
						});
					}

					await target.timeout(86400000, reason).catch((err) => {
						return i.reply({
							content: "¡Hubo un error al poner al miembro en aislamiento!",
							ephemeral: true,
						});
					});

					embed
						.setTitle("Aislamiento")
						.setDescription(
							`Te han puesto en un aislamiento de **1 Día** || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					await target.send({ embeds: [embed] }).catch((err) => {
						return i.reply({
							content: "No se pudo enviar el mensaje al usuario en DM.",
							ephemeral: true,
						});
					});

					await i.reply({
						content: `<@${target.id}> ha sido puesto en aislamiento de 1 día.`,
						ephemeral: true,
					});
				}

				if (i.customId === "5") {
					if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
						return await i.reply({
							content:
								"No tienes permisos para poner a los miembros en **aislamiento**!",
							ephemeral: true,
						});
					}

					await target.timeout(604800000, reason).catch((err) => {
						return i.reply({
							content: "¡Hubo un error al poner al miembro en aislamiento!",
							ephemeral: true,
						});
					});

					embed
						.setTitle("Aislamiento")
						.setDescription(
							`Te han puesto en un aislamiento de **1 Semana** || **Razón:** ${reason}`,
						)
						.setColor("#0099ff")
						.setImage(
							"https://cdn.discordapp.com/attachments/1248493745465200670/1269115360251220083/standard.gif?ex=66b38088&is=66b22f08&hm=2d51ec5d805acd009c597a558ef0a0fdc00dcf991999631378e09c56fcb2a794&",
						);

					await target.send({ embeds: [embed] }).catch((err) => {
						return i.reply({
							content: "No se pudo enviar el mensaje al usuario en DM.",
							ephemeral: true,
						});
					});

					await i.reply({
						content: `<@${target.id}> ha sido puesto en aislamiento de 1 semana.`,
						ephemeral: true,
					});
				}
			} catch (error) {
				console.error(error);
				await i.reply({
					content: "¡Ocurrió un error inesperado!",
					ephemeral: true,
				});
			}
		});
	},
};
