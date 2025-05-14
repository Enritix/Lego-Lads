import express, { Request, Response } from 'express';
import { fetchMinifigByName } from '../apicalls';
import { Minifig } from '../interfaces';
const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
  res.render('login', { error: null, });
});

router.get('/register', async (req: Request, res: Response) => {
  const defaultFig1 = await fetchMinifigByName("Peter Parker");
  const defaultFig2 = await fetchMinifigByName("Arctic Guy");

  const minifigs: Minifig[] = [];
  try {
    minifigs.push(defaultFig1);
    minifigs.push(defaultFig2);
  } catch (error) {
    
  }

  res.render('register', { error: null, popUp: false, fname: null, figs: minifigs }); 

});



router.post("/register", async (req: Request, res: Response) => {
  const { fname, lname, email, password} = req.body;
  const defaultFig1 = await fetchMinifigByName("Peter Parker");
  const defaultFig2 = await fetchMinifigByName("Arctic Guy");

  const minifigs: Minifig[] = [];
  try {
    minifigs.push(defaultFig1);
    minifigs.push(defaultFig2);
  } catch (error) {
    
  }

  if (!fname || !lname || !email || !password) {
    return res.render("register", { error: "Alle velden zijn verplicht", popUp: false , fname: null,figs: minifigs});
  } else if (!email.includes("@")) {
    return res.render("register", { error: "Ongeldig e-mailadres", popUp: false, fname: null, figs: minifigs });
  }

  return res.render("register", { error: null , popUp: true, fname:fname, figs: minifigs });

  // Eventueel user opslaan hier...

  // return res.redirect("/success");
});


export default router;


