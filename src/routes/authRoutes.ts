import express, { Request, Response } from 'express';
import { fetchMinifigByName } from '../apicalls';
import { Minifig, User } from '../interfaces';
import { findUserByEmailOrUsername, insertUser } from '../database';
import bcrypt from "bcrypt";

const router = express.Router();
router.get("/register", async (req: Request, res: Response) => {
  const defaultFig1 = await fetchMinifigByName("Peter Parker");
  const defaultFig2 = await fetchMinifigByName("Arctic Guy");

  const minifigs: Minifig[] = [defaultFig1, defaultFig2];

  res.render("register", {
    error: null,
    popUp: false,
    uname: null,
    figs: minifigs,
  });
});

router.post("/register", async (req: Request, res: Response) => {
  console.log("POST /register ontvangen", req.body);
  const { uname, email, password, ["confirm-password"]: confirmPassword } = req.body;

  const defaultFig1 = await fetchMinifigByName("Peter Parker");
  const defaultFig2 = await fetchMinifigByName("Arctic Guy");
  const minifigs: Minifig[] = [defaultFig1, defaultFig2];

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

    const existingUser = await findUserByEmailOrUsername(email, uname);

    

    if (existingUser) {
      return res.render("register", {
        error: "Gebruiker met dit e-mailadres of gebruikersnaam bestaat al",
        popUp: false,
        fname: null,
        figs: minifigs,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await insertUser(uname, hashedPassword, email);

    // return res.redirect("/login");
    return res.render("register", {
      error: null,
      popUp: true,
      uname,
      figs: minifigs
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