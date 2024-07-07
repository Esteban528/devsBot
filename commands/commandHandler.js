const runGemini = require("../utils/ia/Gemini.js");

const commands = {
  ia: (prompt, message) => {
    runGemini(prompt)
      .then(result => {
        const responses = splitString(inputString)
        responses.forEach(response => {
          message.reply(response);
        })
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

function splitString(inputString) {
  const maxLength = 2000;

  if (inputString.length > maxLength) {
    const part1 = inputString.slice(0, maxLength);
    const part2 = inputString.slice(maxLength);
    return [part1, part2];
  } else {
    return [inputString];
  }
}

// Ejemplo de uso
const longString = "Aquí va un string muy largo...";
const result = splitString(longString);

// Output para verificar
console.log(result);


module.exports = CommandHandler;
