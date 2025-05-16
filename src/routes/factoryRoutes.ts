import express, { Request, Response } from 'express';
import { getGameData } from '../database';
const router = express.Router();

router.get('/factory-welcome', (req: Request, res: Response) => {
  res.render('factory-welcome', { title: "Lego Fabriek", cssFiles: ['/css/factory-welcome.css'], jsFiles: ['/js/factory-welcome.js'] });
});

router.get('/factory', (req: Request, res: Response) => {
  res.render('factory', { title: "Lego Fabriek", cssFiles: ['/css/factory.css'], jsFiles: ['/js/factory.js'] });
});

router.get('/figordenen', (req: Request, res: Response) => {
  res.render('figordenen', { title: "Figs Ordenen", cssFiles: ['/css/figsordenen.css'], jsFiles: ['/js/figsordenen.js'] });
});

router.get('/ordenen', (req: Request, res: Response) => {
  res.render('ordenen', { title: "Ordenen", cssFiles: ['/css/ordenen.css'], jsFiles: ['/js/ordenen.js'] });
});
router.get('/resultaat', (req: Request, res:Response) => {
    res.render('resultaat', { title: "Resultaat", cssFiles: ['/css/resultaat.css'], jsFiles: ['/js/resultaat.js'] });
})

router.post('/get-game-data', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  
  try {
    const gameData = await getGameData(userId);
    if (!gameData) {
      return res.status(404).json({ success: false, message: "User game data not found" });
    }
    res.json({ success: true, gameData });
  } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
  }
});



export default router;
