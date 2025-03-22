import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/blacklist', (req: Request, res: Response) => {
  res.render('blacklist');
});

router.get('/detaillist', (req: Request, res: Response) => {
  res.render('detaillist');
});

router.get('/genre', (req: Request, res: Response) => {
  res.render('genre');
});

router.get('/figset', (req: Request, res: Response) => {
  res.render('figset');
});

export default router;
