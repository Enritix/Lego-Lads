import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/profile', (req: Request, res: Response) => {
  res.render('profile');
});


import { fetchInitialList } from '../apicalls';



router.get('/inventory', async (req, res) => {
  const { figs } = await fetchInitialList(); // haalt 10 figuren op
  res.render('inventory', { figs }); // ✅ geef figs mee aan de EJS-pagina
});



router.get('/chest', (req: Request, res: Response) => {
  res.render('chest');
});

router.get('/shop', (req: Request, res: Response) => {
  res.render('shop');
});

export default router;
