import express, { Request, Response } from "express";
import { getGameData } from "../database";
import { fetchSets } from "../apicalls";
const router = express.Router();

router.get("/factory-welcome", (req: Request, res: Response) => {
  res.render("factory-welcome", {
    title: "Lego Fabriek",
    cssFiles: ["/css/factory-welcome.css"],
    jsFiles: ["/js/factory-welcome.js"],
  });
});

router.get("/factory", (req: Request, res: Response) => {
  res.render("factory", {
    title: "Lego Fabriek",
    cssFiles: ["/css/factory.css"],
    jsFiles: ["/js/factory.js"],
  });
});

router.get("/figordenen", async (req: Request, res: Response) => {
  const allSets = await fetchSets();
  const shuffled = allSets.sort(() => 0.5 - Math.random());
  const randomSets = shuffled.slice(0, 3);
  const currentFig = req.session.currentFig || null;

  res.render("figordenen", {
    title: "Figs Ordenen",
    cssFiles: ["/css/figsordenen.css"],
    jsFiles: ["/js/figsordenen.js"],
    sets: randomSets,
    currentFig,
  });
});

router.get("/ordenen", (req: Request, res: Response) => {
  res.render("ordenen", {
    title: "Ordenen",
    cssFiles: ["/css/ordenen.css"],
    jsFiles: ["/js/ordenen.js"],
  });
});
router.get("/resultaat", (req: Request, res: Response) => {
  res.render("resultaat", {
    title: "Resultaat",
    cssFiles: ["/css/resultaat.css"],
    jsFiles: ["/js/resultaat.js"],
  });
});

router.post("/get-game-data", async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const gameData = await getGameData(userId);
    if (!gameData) {
      return res
        .status(404)
        .json({ success: false, message: "User game data not found" });
    }
    res.json({ success: true, gameData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/set-current-fig", (req: Request, res: Response) => {
  req.session.currentFig = req.body.fig;
  res.json({ success: true });
});

export default router;
