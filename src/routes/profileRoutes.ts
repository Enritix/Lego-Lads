import express, { Request, Response } from 'express';
import {fetchMinifigs} from'../apicalls';
import { collectAchievementReward, connectToMongoDB, getUserAchievements, getUserById, updateUserFig } from '../database';



const router = express.Router();

router.get('/profile', async (req: Request, res: Response) => {
  const userId = req.session.user?._id;

  if (!userId) {
    return res.redirect('/login');
  }

  const user = await getUserById(typeof userId === 'string' ? userId : userId?.toString());
  const achievements = await getUserAchievements(typeof userId === 'string' ? userId : userId?.toString());
  
  res.render('profile', 
    { 
      figs: user.figs,
      title: "Profiel", 
      achievements: achievements, 
      cssFiles: ['/css/profile.css'], 
      jsFiles: ['/js/profile.js'] });
});

router.get('/inventory', async (req, res) => {
  const db = await connectToMongoDB();


  const username = req.session.user?.username;

  const user = await db.collection("gebruikers").findOne({ username });


  if(!user){

    return res.status(404).send("gebruiker bestaat niet")
  }

  res.render('inventory', { title: "Rugzak",
     cssFiles: ['/css/inventory.css'], 
     jsFiles: ['/js/inventory.js'], 
     figs:user.figs,
     ongewoon: user.chests.uncommon,
     episch: user.chests.epic,
     legendarisch: user.chests.legendary,
     keys: user.keys });
});


router.get('/chest', (req: Request, res: Response) => {
  const chestType = req.query.type;
  res.render('chest', { title: "Kistopening", cssFiles: ['/css/chest.css'], jsFiles: ['/js/chest.js'], chestType });
});

router.get('/shop', async (req: Request, res: Response) => {
    res.render('shop', { title: "Winkel", cssFiles: ['/css/shop.css'], jsFiles: ['/js/shop.js'] });
});
 
// Abe: post routes 
router.post("/set-profiel-fig", async (req, res) => {
  const db = await connectToMongoDB();

  const gebruikersnaam = req.session.user?.username; 

  const { img } = req.body;
  if (!img) {
    return res.status(400).json({ error: "Geen afbeelding" });
  }
  if (!gebruikersnaam) {
    return res.status(400).json({ error: "Gebruikersnaam ontbreekt" });
  }
  
  try {
    await updateUserFig(gebruikersnaam, img);
   req.session.user!.profile_fig = img;

    res.status(200).json({ message: "Profiel figuur succesvol geupdate" });
  } catch (error) {
    console.error("Fout bij het updaten van profiel figuur:", error);
    res.status(500).json({ error: "Fout bij het updaten van profiel figuur" });
  }
});

// Enrico: dit is de post om een bepaalde user te krijgen
router.post("/get-user", async (req, res) => {
    const userId = req.session.user?._id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing" });
    }

    try {
      const user = await getUserById(typeof userId === 'string' ? userId : userId.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
});

// Enrico: dit is de post om een bepaalde achievement te collecten
router.post("/collect-achievement", async (req, res) => {
    const userId = req.session.user?._id;
    const achievementKey = req.body.achievementKey;

    if (!userId || !achievementKey) {
      return res.status(400).json({ success: false, message: "User ID of achievementKey ontbreekt" });
    }

    try {
      const progress = await collectAchievementReward(typeof userId === 'string' ? userId : userId.toString(), achievementKey);
      res.json({ success: true, progress });
      
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
    res.redirect('/profile');
});
export default router;