import express, { Request, Response } from 'express';
import {fetchfigs, fetchsets} from'../apicalls';

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
  try{
    const figs = await fetchfigs();
    res.render('shop',{figs});

  }catch(error){
    console.error("fout api")
    // binne kort eeror status codes 
  }

});

export default router;
