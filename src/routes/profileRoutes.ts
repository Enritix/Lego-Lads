import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/profile', (req: Request, res: Response) => {
  res.render('profile');
});

router.get('/inventory', (req: Request, res: Response) => {
  res.render('inventory');
});

router.get('/chest', (req: Request, res: Response) => {
  res.render('chest');
});

router.get('/shop', (req: Request, res: Response) => {
  res.render('shop');
});

export default router;
