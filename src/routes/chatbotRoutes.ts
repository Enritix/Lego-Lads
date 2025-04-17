import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/chatbot', (req: Request, res: Response) => {
  res.render('chatbot', { title: "Chatbot", cssFiles: ['/css/chatbot.css'], jsFiles: ['/js/chatbot.js'] });
});

export default router;
