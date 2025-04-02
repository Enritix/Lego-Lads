import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/clickergame', (req: Request, res: Response) => {
  res.render('clickergame');
});

router.get('/memorygame', (req: Request, res: Response) => {
  res.render('memorygame');
});

export default router;
