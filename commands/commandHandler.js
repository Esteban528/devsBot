const commands = {
  ia: (prompt) => {
    return prompt;
  }
}

const CommandHandler = {
  execute: (command, message) => {

    try {
      const response = commands[command](message.content.replace(`.${command}`, "").trim());

      message.reply(response);
    } catch (error) {
      console.log(error)
    }

  }
}

module.exports = CommandHandler;
