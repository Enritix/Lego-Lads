import express, { Request, Response } from 'express';
import { incrementAchievementProgress, updateUserCoins } from "../database";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { message: "main", title: "Home", cssFiles: ['/css/index.css'], jsFiles: ['/js/index.js'] });
});

router.get('/landingspage', (req: Request, res: Response) => {
  res.render('landingspage');
});

router.get('/loader', (req: Request, res: Response) => {
  res.render('loader');
});

// Enrico: hier worden de coins van de user geupdate
router.post("/update-coins", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const coins = parseInt(req.body.coins, 10);

  try {
    await updateUserCoins(userId, coins);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enrico: dit is de post voor een bepaalde achievement te updaten
router.post("/update-achievement", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const achievementKey = req.body.achievementKey;
  const incrementBy = parseInt(req.body.incrementBy, 10);

  try {
    const progress = await incrementAchievementProgress(userId, achievementKey, incrementBy);
    res.json({ success: true, progress });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
