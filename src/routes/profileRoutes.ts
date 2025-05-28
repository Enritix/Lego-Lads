import express, { Request, Response } from 'express';
import {fetchMinifigs} from'../apicalls';
import { collectAchievementReward, connectToMongoDB, getUserAchievements, getUserById, updateUserFig,updateUserCoins, getUserCoins } from '../database';
import { fetchRandomMinifigs} from '../apicalls';
import { ObjectId } from "mongodb";




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
  const username = req.session.user?.username;

  if (!username) return res.redirect('/login');

  const db = await connectToMongoDB();
  const user = await db.collection("gebruikers").findOne({ username });

  if (!user) return res.redirect('/login');

  res.render('inventory', {
    title: "Rugzak",
    cssFiles: ['/css/inventory.css'],
    jsFiles: ['/js/inventory.js'],
    figs: user.figs,
    ongewoon: user.chests.uncommon,
    episch: user.chests.epic,
    legendarisch: user.chests.legendary,
    keys: user.keys
  });
});

router.get('/chest', (req: Request, res: Response) => {
  const chestType = req.query.type;
  res.render('chest', { title: "Kistopening", cssFiles: ['/css/chest.css'], jsFiles: ['/js/chest.js'], chestType });


});

router.get('/shop', async (req: Request, res: Response) => {
  try {
    const minifigs  = await fetchRandomMinifigs(10);

    res.render('shop', {
      title: "Winkel",
      cssFiles: ['/css/shop.css'],
      jsFiles: ['/js/shop.js'],
      minifigs 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Fout laden winkel.");
  }
});

router.get("/api/random-figs", async (req: Request, res: Response) => {
  try {
    const username = req.session.user?.username;
    if (!username) return res.status(401).json({ error: "Niet ingelogd" });

    const db = await connectToMongoDB();
    const gebruiker = await db.collection("gebruikers").findOne({ username });

    if (!gebruiker) {
      return res.status(404).json({ error: "Gebruiker niet gevonden" });
    }

    const excludeNames = gebruiker.figs?.map((fig: any) => fig.name) || [];

    const figs = await fetchRandomMinifigs(10, excludeNames);

    res.json(figs);
  } catch (err) {
    console.error("Fout bij ophalen random figs:", err);
    res.status(500).json({ error: "Interne serverfout" });
  }
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


//Abe: post om fig te kopen
router.post("/buy-fig", async (req: Request, res: Response) => {
  try {
    const username = req.session.user?.username;
    if (!username) return res.status(401).json({ error: "Niet ingelogd" });

    const fig = req.body.fig;
    if (!fig?.name || !fig?.rarity || !fig?.img || !fig?.price) {
      return res.status(400).json({ error: "Ongeldige fig-gegevens" });
    }

    const db = await connectToMongoDB();
    const gebruiker = await db.collection("gebruikers").findOne({ username });
    if (!gebruiker) return res.status(404).json({ error: "Gebruiker niet gevonden" });

    if (gebruiker.coins < fig.price) {
      return res.status(400).json({ error: "Niet genoeg munten" });
    }
    await updateUserCoins(gebruiker._id.toString(), -fig.price);

    await db.collection("gebruikers").updateOne(
      { _id: gebruiker._id },
      { $addToSet: { figs: fig } }
    );
    const updatedUser = await db.collection("gebruikers").findOne({ _id: gebruiker._id });

    res.json({ message: "Figuur gekocht!", newBalance: updatedUser?.coins ?? 0 });

  } catch (err) {
    console.error("Fout bij kopen:", err);
    res.status(500).json({ error: "Interne fout bij kopen" });
  }
});


type ChestType = "common" | "epic" | "legendary";
router.post("/api/open-chest", async (req, res) => {
  const chestType = req.body.type as ChestType;
  const fig = req.body.fig;
  const username = req.session.user?.username;

  if (!username) {
    return res.status(401).json({ success: false, message: "Niet ingelogd." });
  }

  if (!fig || !fig.name || !fig.img || !fig.rarity) {
    return res.status(400).json({ success: false, message: "Ongeldige figuur." });
  }

  const db = await connectToMongoDB();
  const user = await db.collection("gebruikers").findOne({ username });

  if (!user) {
    return res.status(404).json({ success: false, message: "Gebruiker niet gevonden." });
  }

  const rarityMap: Record<ChestType, string> = {
    common: "uncommon",
    epic: "epic",
    legendary: "legendary"
  };

  const rarityKey = rarityMap[chestType];
  const chestCount = user.chests?.[rarityKey] || 0;
  const keyCount = user.keys || 0;

  if (chestCount <= 0 || keyCount <= 0) {
    return res.status(400).json({ success: false, message: "Geen kisten of sleutels beschikbaar." });
  }

  await db.collection("gebruikers").updateOne(
    { username },
    {
      $inc: {
        [`chests.${rarityKey}`]: -1,
        keys: -1
      },
      $push: {
        figs: fig
      }
    }
  );
  return res.json({
    success: true,
    addedFig: fig
  });
});


router.post("/api/get-chest-contents", async (req, res) => {
  const chestType = req.body.type as ChestType;

  if (!["common", "epic", "legendary"].includes(chestType)) {
    return res.status(400).json({ success: false, message: "Ongeldig chest-type." });
  }

  const db = await connectToMongoDB();
  const chest = await db.collection("chests").aggregate([
    { $match: { type: chestType } },
    { $sample: { size: 1 } }
  ]).toArray();

  if (!chest[0]) {
    return res.status(404).json({ success: false, message: "Geen chest gevonden." });
  }

  res.json({ success: true, figs: chest[0].figs });
});



export default router;