import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
const router = express.Router();

router.get('/chatbot', (req: Request, res: Response) => {
  res.render('chatbot', { title: "Chatbot", cssFiles: ['/css/chatbot.css'], jsFiles: ['/js/chatbot.js'] });
});



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/send', async (req: Request, res: Response) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
          Je bent een supportbot voor het spel Lego Lads.
          In dit spel kun je:
          - Minigames spelen (zoals een clicker game en een memory game)
          - Figs (Lego poppetjes) verzamelen en ordenen in sets
          - Coins verdienen door:
            - Minigames te spelen
            - Figs correct te ordenen in de Lego Fabriek

            Antwoord altijd vriendelijk en duidelijk, en beperk je tot vragen over het spel.`,
        },
        { role: 'user', content: message },
      ],
});

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error: any) {
  if (error.response) {
    console.error(" OpenAI Response Data:", error.response.data);
    console.error("OpenAI Status:", error.response.status);
    console.error("OpenAI Headers:", error.response.headers);
  } else {
    console.error("Algemene fout:", error.message || error);
  }

  res.status(500).json({ error: 'Fout bij het ophalen van AI-antwoord.' });
}

});

export default router
