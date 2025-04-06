import express, { Request, Response } from 'express';
import {fetchMinifigs} from'../apicalls';

const router = express.Router();

router.get('/profile', (req: Request, res: Response) => {
  res.render('profile');
});

router.get('/inventory', async (req, res) => {
  res.render('inventory');
});

router.get('/chest', (req: Request, res: Response) => {
  res.render('chest');
});

router.get('/shop', async (req: Request, res: Response) => {
    res.render('shop');
});

export default router;
