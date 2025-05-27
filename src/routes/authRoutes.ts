import express, { Request, Response } from 'express';
import { fetchMinifigByName } from '../apicalls';
import { Minifig, User } from '../interfaces';
import { findUserByEmailOrUsername, insertUser, updateUserPassword } from '../database';
import sessionMiddleware from '../sessions';
import { requireAuth, redirectIfLoggedIn } from '../middleware';
import bcrypt from "bcrypt";
import { generateVerificationCode } from '../utils/verification';
import { sendVerificationEmail } from '../utils/email';


const router = express.Router();
router.use(sessionMiddleware);

router.get("/register", redirectIfLoggedIn, async (req: Request, res: Response) => {
    const defaultFig1 = await fetchMinifigByName("Peter Parker");
    const defaultFig2 = await fetchMinifigByName("Arctic Guy");
    const minifigs: Minifig[] = [defaultFig1, defaultFig2];
    res.render("register", {
        error: null,
        popUp: false,
        uname: null,
        figs: minifigs,
        lang: res.locals.lang || "nl",
        showVerification: false,
        tempUser: null
    });
});

router.post("/register", redirectIfLoggedIn, async (req: Request, res: Response) => {
    const { uname, email, password, ["confirm-password"]: confirmPassword, profileFig, verificationCode } = req.body;
    const defaultFig1 = await fetchMinifigByName("Peter Parker");
    const defaultFig2 = await fetchMinifigByName("Arctic Guy");
    const minifigs: Minifig[] = [defaultFig1, defaultFig2];

    if (!verificationCode) {
        if (!uname || !email || !password || !confirmPassword || !profileFig) {
            return res.render("register", {
                error: "Alle velden zijn verplicht",
                popUp: false,
                uname: null,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: false,
                tempUser: { uname, email, password, profileFig }
            });
        }
        if (!email.includes("@")) {
            return res.render("register", {
                error: "Ongeldig e-mailadres",
                popUp: false,
                uname: null,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: false,
                tempUser: { uname, email, password, profileFig }
            });
        }
        if (password !== confirmPassword) {
            return res.render("register", {
                error: "Wachtwoorden komen niet overeen",
                popUp: false,
                uname: null,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: false,
                tempUser: { uname, email, password, profileFig }
            });
        }
        if (password.length < 8) {
            return res.render("register", {
                error: "Wachtwoord moet minimaal 8 tekens bevatten",
                popUp: false,
                uname: null,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: false,
                tempUser: { uname, email, password, profileFig }
            });
        }
        try {
            const existingUser = await findUserByEmailOrUsername(email, uname);
            if (existingUser) {
                return res.render("register", {
                    error: "Gebruiker met dit e-mailadres of gebruikersnaam bestaat al",
                    popUp: false,
                    uname: null,
                    figs: minifigs,
                    lang: res.locals.lang || "nl",
                    showVerification: false,
                    tempUser: { uname, email, password, profileFig }
                });
            }
            const code = generateVerificationCode();
            await sendVerificationEmail(email, code);

            req.session.tempUser = {
            uname,
            email,
            password,
            profile_fig: profileFig,
            code: code
        };

            return res.render("register", {
                error: null,
                popUp: false,
                uname,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: true,
                tempUser: { uname, email, password, profileFig }
            });
        } catch (err) {
            return res.render("register", {
                error: "Er is een fout opgetreden bij het registreren",
                popUp: false,
                uname: null,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: false,
                tempUser: { uname, email, password, profileFig }
            });
        }
    } else {
        const tempUser = req.session.tempUser;
        if (!tempUser) {
            return res.render("register", {
                error: "Sessie verlopen, probeer opnieuw te registreren.",
                popUp: false,
                uname: null,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: false,
                tempUser: null
            });
        }
        if (verificationCode !== tempUser.code) {
            return res.render("register", {
                error: "Verificatiecode is onjuist.",
                popUp: false,
                uname: tempUser.uname,
                figs: minifigs,
                lang: res.locals.lang || "nl",
                showVerification: true,
                tempUser
            });
        }

        const hashedPassword = await bcrypt.hash(tempUser.password, 10);
        await insertUser(tempUser.uname, hashedPassword, tempUser.email, tempUser.profile_fig);
        
        delete req.session.tempUser;
        req.session.successMessage = "Je account is succesvol aangemaakt! Log nu in.";
        return res.redirect(`/${res.locals.lang || "nl"}/login`);
    }
});

router.get("/login", redirectIfLoggedIn, (req: Request, res: Response) => {
    const successMessage = req.session.successMessage;
    delete req.session.successMessage;
    res.render("login", { error: null, successMessage: successMessage, lang: res.locals.lang || "nl" });
});

router.post("/login", redirectIfLoggedIn, async (req: Request, res: Response) => {
    const { uname, password, stayLoggedIn } = req.body;
    if (!uname || !password) {
        return res.render("login", { error: "Alle velden zijn verplicht" });
    }
    const user: User | null = await findUserByEmailOrUsername("", uname);
    if (!user) {
        return res.render("login", { error: "Gebruiker niet gevonden" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render("login", { error: "Wachtwoord klopt niet" });
    }
    req.session.user = user;
    if (stayLoggedIn) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 14;
    } else {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 2;
    }

    return res.redirect(`/${res.locals.lang || "nl"}/`);
});

router.get("/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect(`/${res.locals.lang || "nl"}/login`);
    });
});

router.get("/forgot-password", redirectIfLoggedIn, (req, res) => {
    res.render("forgot-password", { error: null, showResetForm: false, uname: null });
});

router.post("/forgot-password", redirectIfLoggedIn, async (req, res) => {
    const { uname, password, ["confirm-password"]: confirmPassword } = req.body;
    if (!uname) {
        return res.render("forgot-password", { error: "Gebruikersnaam is verplicht", showResetForm: false, uname: null });
    }
    const user = await findUserByEmailOrUsername("", uname);
    if (!user) {
        return res.render("forgot-password", { error: "Gebruiker niet gevonden", showResetForm: false, uname: null });
    }
    if (password && confirmPassword) {
        if (password !== confirmPassword) {
            return res.render("forgot-password", { error: "Wachtwoorden komen niet overeen", showResetForm: true, uname });
        }
        if (password.length < 8) {
            return res.render("forgot-password", { error: "Wachtwoord moet minimaal 8 tekens bevatten", showResetForm: true, uname });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserPassword(uname, hashedPassword);
        return res.render("login", { error: "Wachtwoord succesvol aangepast. Log nu in.", lang: res.locals.lang || "nl" });
    }
    return res.render("forgot-password", { error: null, showResetForm: true, uname });
});

router.post("/reset-password", async (req: Request, res: Response) => {
    const { uname, password, ["confirm-password"]: confirmPassword } = req.body;
    if (!uname || !password || !confirmPassword) {
        return res.render("reset-password", { uname, error: "Alle velden zijn verplicht" });
    }
    if (password !== confirmPassword) {
        return res.render("reset-password", { uname, error: "Wachtwoorden komen niet overeen" });
    }
    if (password.length < 8) {
        return res.render("reset-password", { uname, error: "Wachtwoord moet minimaal 8 tekens bevatten" });
    }
    const user = await findUserByEmailOrUsername("", uname);
    if (!user) {
        return res.render("reset-password", { uname, error: "Gebruiker niet gevonden" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPassword(uname, hashedPassword);
    return res.render("login", { error: "Wachtwoord succesvol aangepast. Log nu in." });
});

export default router;