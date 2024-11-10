const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const getDir = (file) => {
  return path.join(__dirname, file); // Usa __dirname para asegurarte de que la ruta sea absoluta
};

// Cliente de Discord
const Client = new Discord.Client({
  intents: 3276799,
});

// Inicializar la fila de reproducción
Client.queue = new Map();

// Cargar comandos del bot
Client.commands = new Discord.Collection();

fs.readdirSync(getDir("slash_commands")).forEach((commandfile) => {
  const command = require(getDir(path.join("slash_commands", commandfile)));
  Client.commands.set(command.data.name, command);
});

// Registrar comandos
const REST = new Discord.REST({ version: '9' }).setToken(process.env.DISCORD_KEY_TOKEN);

(async () => {
  try {
    await REST.put(
      Discord.Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      {
        body: Client.commands.map((cmd) => cmd.data.toJSON()),
      }
    );
    console.log(`Commands: Loaded ${Client.commands.size} Slashcommands {/}`);
  } catch (error) {
    console.log("Error loading commands.", error);
  }
})();

// Evento interactionCreate
Client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = Client.commands.get(interaction.commandName);
    if (command) {
      try {
        await command.execute(interaction, Client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Ocurrió un error al ejecutar el comando.', ephemeral: true });
      }
    }
  }
});

// Conexión con el Token
Client.login(process.env.DISCORD_KEY_TOKEN);

// Handler de Eventos 
try {
  const files = fs.readdirSync(getDir("events")).filter((filename) => filename.endsWith(".js"));

  console.log("Events Loaded");
  files.forEach((filename) => {
    const listener = require(getDir(path.join("events", filename)));
    const eventName = path.basename(filename, ".js");
    Client.on(eventName, listener.bind(null, Client));
    console.log(`Event: ${filename}`);
  });
} catch (err) {
  console.error("[err] Ha ocurrido un error al cargar un evento", err);
}

// Actividad del Bot
Client.on("ready", () => {
  Client.user.setActivity('| Moderando en >Run Devs', { type: Discord.ActivityType.Watching });
});
