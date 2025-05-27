import express, { Request, Response } from 'express';
import { incrementAchievementProgress, updateUserCoins, getUserCoins, updateUserSettings, getUserSettings } from "../database";
import { requireAuth } from '../middleware';
const router = express.Router();

router.get('/', requireAuth, (req: Request, res: Response) => {
  res.render('index', { message: "main", title: "Home", cssFiles: ['/css/index.css'], jsFiles: ['/js/index.js'] });
});

router.get('/loader', requireAuth, (req: Request, res: Response) => {
  res.render('loader');
});

// Enrico: dit is de post voor de coins van de user
router.post("/get-coins", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const coins = await getUserCoins(userId.toString());
    res.json({ success: true, coins });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// Enrico: hier worden de coins van de user geupdate
router.post("/update-coins", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  const coins = parseInt(req.body.coins, 10);

  try {
    await updateUserCoins(userId.toString(), coins);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enrico: dit is de post voor een bepaalde achievement te updaten
router.post("/update-achievement", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  const achievementKey = req.body.achievementKey;
  const incrementBy = parseInt(req.body.incrementBy, 10);

  try {
    const progress = await incrementAchievementProgress(userId.toString(), achievementKey, incrementBy);
    res.json({ success: true, progress });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enrico: dit is de post voor de settings van de user op te halen
router.post("/get-settings", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const settings = await getUserSettings(userId.toString());
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enrico: dit is de post voor de settings van de user te updaten
router.post("/update-settings", async (req: Request, res: Response) => {
  const { newSettings } = req.body;

  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    await updateUserSettings(userId.toString(), newSettings);
    res.json({ success: true, message: "Instellingen succesvol bijgewerkt." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
