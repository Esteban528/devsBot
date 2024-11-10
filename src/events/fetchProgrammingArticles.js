const fetch = require('node-fetch');

const MAX_MESSAGE_LENGTH = 2000;
const ARTICLES_TO_SHOW = 5;

async function fetchProgrammingArticles() {
  const url = 'https://dev.to/api/articles?tag=javascript';

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const serverEmoji = '<:hyperpinged:1243296463228899528>';
      let articlesMessage = `# ${serverEmoji} ||@everyone|| ¡Noticias del día!:\n`;

      const randomArticles = getRandomArticles(data, ARTICLES_TO_SHOW);

      randomArticles.forEach((article) => {
        articlesMessage += `📰 ${article.title}\n🔗 ${article.url}\n`;
      });

      return truncateMessage(articlesMessage);
    } else {
      return 'No se encontraron artículos de programación.';
    }
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    return 'Ocurrió un error al obtener artículos.';
  }
}

function getRandomArticles(data, count) {
  const randomArticles = [];

  while (randomArticles.length < count && randomArticles.length < data.length) {
    const randomIndex = Math.floor(Math.random() * data.length);
    if (!randomArticles.includes(data[randomIndex])) {
      randomArticles.push(data[randomIndex]);
    }
  }

  return randomArticles;
}

function truncateMessage(message) {
  if (message.length > MAX_MESSAGE_LENGTH) {
    return message.substring(0, MAX_MESSAGE_LENGTH - 3) + '...';
  }
  return message;
}

module.exports = fetchProgrammingArticles;
