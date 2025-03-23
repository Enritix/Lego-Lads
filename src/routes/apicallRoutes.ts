import express, { Request, Response } from 'express';
import { fetchInitialData } from '../apicalls';

const router = express.Router();

router.get('/apical', async (req: Request, res: Response) => {
  try {
    const { fig, legoSet } = await fetchInitialData();
    res.render('apical', { fig, legoSet });
  } catch (error) {
    console.error('Fout bij ophalen fig/set:', error);
    res.status(500).send('Er ging iets mis bij het ophalen van de figuren.');
  }
});

export default router;




