const runGemini = require("../utils/ia/Gemini.js");

const commands = {
  ia: (prompt, message) => {
    runGemini(prompt)
      .then((result) => {
        const responses = splitString(result);
        responses.forEach((response) => {
          message.reply(response);
        });
      })
      .catch((error) => {
        message.reply("Ocurrió un error");
      });
  },
};

const CommandHandler = {
  execute(command, message) {
    try {
      const commandFunction = commands[command];
      if (commandFunction) {
        const prompt = message.content.replace(`.${command}`, "").trim();
        commandFunction(prompt, message);
      } else {
        console.error(`Comando no encontrado: ${command}`);
      }
    } catch (error) {
      console.error("Error al ejecutar el comando:", error);
    }
  }
}

function splitString(inputString) {
  const maxLength = 2000;
  const parts = [];
  let startIndex = 0;

  while (startIndex < inputString.length) {
    parts.push(inputString.slice(startIndex, startIndex + maxLength));
    startIndex += maxLength;
  }

  return parts;
}

module.exports = CommandHandler;
