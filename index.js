const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const path = require("path");

// Cliente de discord
const Client = new Discord.Client({
  intents: 3276799,
});

// Inicializar la fila de reproducción
Client.queue = new Map();

// Cargar comandos
Client.commands = new Discord.Collection();

fs.readdirSync("./slash_commands").forEach((commandfile) => {
  const command = require(`./slash_commands/${commandfile}`);
  Client.commands.set(command.data.name, command);
});

// Registrar comandos
const REST = new Discord.REST({ version: '9' }).setToken(config.CLIENT_TOKEN);

(async () => {
  try {
    await REST.put(
      Discord.Routes.applicationGuildCommands(config.clientId, config.guildId),
      {
        body: Client.commands.map((cmd) => cmd.data.toJSON()),
      }
    );
    console.log(`[!] Loaded ${Client.commands.size} slashcommands {/}`);
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

// Conexion con el Token
Client.login(config.CLIENT_TOKEN);

// Handler de Eventos 
try {
  const files = fs.readdirSync("./events").filter((filename) => filename.endsWith(".js"));

  console.log("Events Loaded");
  files.forEach((filename) => {
    const listener = require(`./events/${filename}`);
    const eventName = path.basename(filename, ".js");
    Client.on(eventName, listener.bind(null, Client));
    console.log(`Event: ${filename}`);
  });
} catch (err) {
  console.log("[err] Ha ocurrido un error al cargar un evento", err);
}
