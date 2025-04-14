import express, { Request, Response } from 'express';
import {fetchMinifigs} from'../apicalls';
import { connectToMongoDB } from '../database';



const router = express.Router();

router.get('/profile', async (req: Request, res: Response) => {
 
  
  res.render('profile', { title: "Profiel", cssFiles: ['/css/profile.css'], jsFiles: ['/js/profile.js'] });
});

router.get('/inventory', async (req, res) => {
  const db = await connectToMongoDB();

  // Abe: dit moet  sesie token worden moeten we nog zien op school hoe enwat 
  const gebruikersnaam = "abe";

  const user =  await db.collection("gebruikers").findOne({ gebruikersnaam});

  if(!user){

    return res.status(404).send("gebruiker bestaat niet")
  }

  res.render('inventory', { title: "Rugzak",
     cssFiles: ['/css/inventory.css'], 
     jsFiles: ['/js/inventory.js'], 
     figs:user.figs,
     ongewoon: user.kisten.ongewoon,
     episch: user.kisten.episch,
     legendarisch: user.kisten.legendarisch,
     keys: user.keys });
});


router.get('/chest', (req: Request, res: Response) => {
  res.render('chest', { title: "Kistopening", cssFiles: ['/css/chest.css'], jsFiles: ['/js/chest.js'] });
});

router.get('/shop', async (req: Request, res: Response) => {
    res.render('shop', { title: "Winkel", cssFiles: ['/css/shop.css'], jsFiles: ['/js/shop.js'] });
});





// Abe: post routes 

router.post("/set-profiel-fig", async (req, res) => {
  const db = await connectToMongoDB();

  const gebruikersnaam = "abe"; 

  const { img } = req.body;
  if (!img) {
    return res.status(400).json({ error: "Geen afbeelding" });
  }
  // Abe: dit moet  sesie token worden moeten we nog zien op school hoe enwat 
  const result = await db.collection("gebruikers").updateOne(
    { gebruikersnaam },
    { $set: { profiel_fig: img } }
  );

  if (result.modifiedCount === 1) {
    res.json({ message: " profiel_fig geüpdatet", img });
  } else {
    res.status(500).json({ error: "Mislukt  profiel_fig" });
  }
});
export default router;