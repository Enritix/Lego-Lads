import express, { Request, Response } from 'express';
import {fetchMinifigs} from'../apicalls';

const router = express.Router();

router.get('/profile', (req: Request, res: Response) => {
  res.render('profile', { title: "Profiel", cssFiles: ['/css/profile.css'], jsFiles: ['/js/profile.js'] });
});

router.get('/inventory', async (req, res) => {
  res.render('inventory', { title: "Rugzak", cssFiles: ['/css/inventory.css'], jsFiles: ['/js/inventory.js'] });
});

router.get('/chest', (req: Request, res: Response) => {
  res.render('chest', { title: "Kistopening", cssFiles: ['/css/chest.css'], jsFiles: ['/js/chest.js'] });
});

router.get('/shop', async (req: Request, res: Response) => {
    res.render('shop', { title: "Winkel", cssFiles: ['/css/shop.css'], jsFiles: ['/js/shop.js'] });
});

export default router;
