import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/chatbot', (req: Request, res: Response) => {
  res.render('chatbot');
});

export default router;
