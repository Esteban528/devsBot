const runGemini = require("../utils/ia/Gemini.js");

const commands = {
  ia: (prompt, message) => {
    runGemini(prompt)
      .then(result => {
        message.reply(result);
      })
      .catch(error => {
        message.reply("Ocurrió un error");
      })
  }
}

const CommandHandler = {
  execute: (command, message) => {

    try {
      commands[command](message.content.replace(`.${command}`, "").trim(), message);
    } catch (error) {
      console.log(error)
    }

  }
}

module.exports = CommandHandler;
