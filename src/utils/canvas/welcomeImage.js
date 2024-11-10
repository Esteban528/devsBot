const { GuildMember } = require("discord.js");
const { createCanvas, registerFont, loadImage } = require("canvas");

const defaultIcon =
	"https://static.vecteezy.com/system/resources/previews/018/930/500/original/discord-logo-discord-icon-transparent-free-png.png";
const path = require("path");

const backgroundPath = path.resolve( "src", "assets", "images", "background.png");
const fontPath = path.resolve( "src", "assets", "fonts", "Quicksand_Bold.ttf");

console.log(backgroundPath); // Verifica que la ruta sea correcta
console.log(fontPath); // Verifica que la ruta sea correcta
const subtitle = "Bienvenido al Servidor!! ";
const avatarRadius = 150;

registerFont(fontPath, { family: "Quicksand" }); // registrar fuente

/**
 * Retorna un buffer de una imagen de bienvenida
 * @param {GuildMember} member
 */
module.exports = async (member) => {
	// Datos del miembro
	const username = member.user.username;
	const avatar =
		member.user.avatarURL({ size: 256, extension: "png" }) || defaultIcon;

	// Crear lienzo
	const canvas = createCanvas(1200, 600);
	const ctx = canvas.getContext("2d");

	// Aplicar sombreado al fondo
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
	ctx.shadowBlur = 15;
	ctx.shadowOffsetX = 5;
	ctx.shadowOffsetY = 5;

	const margin = 20;
	const background = await loadImage(backgroundPath);

	ctx.drawImage(
		background,
		margin,
		margin,
		canvas.width - margin * 2,
		canvas.height - margin * 2,
	);

	// Dibujar nombre de usuario
	ctx.font = "80px Quicksand";
	ctx.fillStyle = "white";

	ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
	ctx.shadowBlur = 5;

	const usernameMetrics = ctx.measureText(username);

	ctx.fillText(
		username,
		canvas.width / 2 - usernameMetrics.width / 2,
		(canvas.height * 3) / 4,
	);

	// Dibujar subtítulo
	ctx.font = "50px Quicksand";
	ctx.fillStyle = "white";

	const subtitleMetrics = ctx.measureText(subtitle);

	ctx.fillText(
		subtitle,
		canvas.width / 2 - subtitleMetrics.width / 2,
		(canvas.height * 3) / 4 + 60,
	);

	const avatarImage = await loadImage(avatar);

	// Dibujar avatar del usuario
	ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
	ctx.shadowBlur = 15;

	// Borde del avatar
	ctx.beginPath();
	ctx.arc(canvas.width / 2, canvas.height / 3, avatarRadius, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();

	// Avatar del usuario
	ctx.shadowColor = "transparent";

	ctx.beginPath();
	ctx.arc(
		canvas.width / 2,
		canvas.height / 3,
		avatarRadius - 5,
		0,
		Math.PI * 2,
	);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(
		avatarImage,
		canvas.width / 2 - (avatarRadius - 5),
		canvas.height / 3 - (avatarRadius - 5),
		avatarRadius * 2,
		avatarRadius * 2,
	);

	return canvas.toBuffer();
};
