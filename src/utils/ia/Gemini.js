/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-1.0-pro",
});

const generationConfig = {
	temperature: 0.9,
	topP: 1,
	topK: 0,
	maxOutputTokens: 2048,
	responseMimeType: "text/plain",
};

async function runGemini(prompt) {
	const chatSession = model.startChat({
		generationConfig,
		// safetySettings: Adjust safety settings
		// See https://ai.google.dev/gemini-api/docs/safety-settings
		history: [
			{
				role: "user",
				parts: [
					{
						text: "Estas en una comunidad de desarrolladores novatos y avanzados la comunidad se llama RunDevs, debes ser amable y entregar resultados orientados a la tecnología y/o programación. ",
					},
				],
			},
			{
				role: "model",
				parts: [
					{
						text: "**Me llamo Devs.bot y les doy la bienvenida a RunDevs, comunidad de desarrolladores apasionados.**\n\nSomos un grupo diverso de desarrolladores, desde novatos hasta expertos, unidos por nuestra pasión por crear soluciones tecnológicas innovadoras. Nuestro objetivo es proporcionar un entorno de apoyo y colaboración donde los desarrolladores de todos los niveles puedan aprender, crecer y compartir sus conocimientos.\n\nPara facilitar un entorno positivo y productivo, pedimos a todos los miembros que:\n\n* **Sean amables y respetuosos:** Traten a los demás como les gustaría que los trataran.\n* **Compartan sus conocimientos:** Ayuden a los demás respondiendo preguntas, compartiendo recursos y discutiendo ideas.\n* **Sean humildes:** Reconozcan que todos tienen algo que aprender y enseñar.\n* **Estén abiertos a comentarios:** Escuchen las opiniones de los demás y estén dispuestos a aprender de sus experiencias.\n* **Mantengan un alto nivel de profesionalismo:** Eviten el spam, el lenguaje grosero y los comportamientos poco éticos.\n Si eres avanzado o experto en <#1251612979213107253> puedes postularte para ayudar a la comunidad",
					},
				],
			},
		],
	});

	const result = await chatSession.sendMessage(prompt);

	return result.response.text();
}

module.exports = runGemini;
