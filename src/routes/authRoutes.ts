import express, { Request, Response } from 'express';
import { fetchMinifigByName } from '../apicalls';
import { Minifig } from '../interfaces';
import { createUserTemplate, findUserByEmailOrUsername, insertUser } from '../database';
import bcrypt from "bcrypt";

const router = express.Router();
router.get("/register", async (req: Request, res: Response) => {
  const defaultFig1 = await fetchMinifigByName("Peter Parker");
  const defaultFig2 = await fetchMinifigByName("Arctic Guy");

  const minifigs: Minifig[] = [defaultFig1, defaultFig2];

  res.render("register", {
    error: null,
    popUp: false,
    fname: null,
    figs: minifigs,
  });
});

router.post("/register", async (req: Request, res: Response) => {
  const { uname, email, password, ["confirm-password"]: confirmPassword } = req.body;

  const defaultFig1 = await fetchMinifigByName("Peter Parker");
  const defaultFig2 = await fetchMinifigByName("Arctic Guy");
  const minifigs: Minifig[] = [defaultFig1, defaultFig2];

  // ✅ Validatie
  if (!uname  ||  !email || !password || !confirmPassword) {
    return res.render("register", {
      error: "Alle velden zijn verplicht",
      popUp: false,
      uname: null,
      figs: minifigs,
    });
  }

  if (!email.includes("@")) {
    return res.render("register", {
      error: "Ongeldig e-mailadres",
      popUp: false,
      uname: null,
      figs: minifigs,
    });
  }
if (password !== confirmPassword) {
    return res.render("register", {
      error: "Wachtwoorden komen niet overeen",
      popUp: false,
      uname: null,
      figs: minifigs,
    });
  }

  if (password.length < 8) {
    return res.render("register", {
      error: "Wachtwoord moet minimaal 8 tekens bevatten",
      popUp: false,
      uname: null,
      figs: minifigs,
    });
  }

  try {

    // ✅ Controleer of gebruiker al bestaat
    const existingUser = await findUserByEmailOrUsername(email, uname);


    

    if (existingUser) {
      return res.render("register", {
        error: "Gebruiker met dit e-mailadres of gebruikersnaam bestaat al",
        popUp: false,
        fname: null,
        figs: minifigs,
      });
    }

    // ✅ Wachtwoord hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Gebruiker object aanmaken
    const newUser = createUserTemplate(uname, hashedPassword, email);

    // ✅ Opslaan in de database
    const result = await insertUser(newUser);

    console.log("Nieuwe gebruiker geregistreerd:", result.insertedId);

    return res.render("register", {
      error: null,
      popUp: true,
      uname,
      figs: minifigs,
    });
  } catch (err) {
    console.error("Fout tijdens registratie:", err);
    return res.render("register", {
      error: "Er is iets misgegaan, probeer opnieuw.",
      popUp: false,
      fname: null,
      figs: minifigs,
    });
  }
});

export default router;