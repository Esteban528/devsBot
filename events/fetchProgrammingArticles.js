const fetch = require('node-fetch');

async function fetchProgrammingArticles() {
  const url = 'https://dev.to/api/articles?tag=javascript'; 

  try {
    // Realiza la solicitud a la API
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const serverEmoji = '<:hyperpinged:1243296463228899528>'; 
      // Mensaje inicial, incluyendo la mención a todos
      let articlesMessage = `# ${serverEmoji} @everyone ¡Noticias del día!:\n`;

      const numberOfArticlesToShow = 5; 
      const randomArticles = []; 


      while (randomArticles.length < numberOfArticlesToShow && randomArticles.length < data.length) {
        const randomIndex = Math.floor(Math.random() * data.length);
        if (!randomArticles.includes(data[randomIndex])) {
          randomArticles.push(data[randomIndex]);
        }
      }

      randomArticles.forEach(article => {
        articlesMessage += `📰 ${article.title}\n🔗 ${article.url}\n`;
      });

      if (articlesMessage.length > 2000) {
        articlesMessage = articlesMessage.substring(0, 1997) + '...';
      }

      return articlesMessage; 
    } else {
      return 'No se encontraron artículos de programación.'; 
    }
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    return 'Ocurrió un error al obtener artículos.'; 
  }
}

module.exports = fetchProgrammingArticles;
