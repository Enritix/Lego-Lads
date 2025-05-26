import express, { Request, Response } from "express";
import { getGameData, connectToMongoDB } from "../database";
import { fetchSets, fetchMinifigs } from "../apicalls";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/factory-welcome", (req: Request, res: Response) => {
  res.render("factory-welcome", {
    title: "Lego Fabriek",
    cssFiles: ["/css/factory-welcome.css"],
    jsFiles: ["/js/factory-welcome.js"],
  });
});

router.get("/factory", (req: Request, res: Response) => {
  if (
    (req.session.ordenenDone ?? 0) >= (req.session.ordenenCount ?? 0) &&
    (req.session.ordenenCount ?? 0) > 0
  ) {
    return res.redirect("/resultaat");
  }

  const idx = req.session.ordenenDone ?? 0;
  const fig = req.session.ordenenFigs ? req.session.ordenenFigs[idx] : null;
  req.session.currentFig = fig;

  console.log("ordenenFigs:", req.session.ordenenFigs);
  console.log("ordenenDone:", req.session.ordenenDone);
  console.log("currentFig:", fig);

  res.render("factory", {
    title: "Lego Fabriek",
    cssFiles: ["/css/factory.css"],
    jsFiles: ["/js/factory.js"],
    currentFig: fig,
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
  const geordendeFigs = req.session.ordenenFigs || [];
  res.render("resultaat", {
    title: "Resultaat",
    cssFiles: ["/css/resultaat.css"],
    jsFiles: ["/js/resultaat.js"],
    geordendeFigs,
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

router.post("/bin-fig", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  const { fig, reason } = req.body;

  if (!userId || !fig) {
    return res
      .status(400)
      .json({ success: false, message: "User of fig ontbreekt" });
  }

  try {
    const db = await connectToMongoDB();
    await db.collection("gebruikers");
    await (db.collection("gebruikers") as any).updateOne(
      { _id: new ObjectId(userId.$oid) },
      { $push: { bin: { fig: fig.name, reason: reason || "" } } }
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/orden-fig", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  const { fig, set, status } = req.body;

  if (!userId || !fig || !status) {
    return res.status(400).json({ success: false, message: "Data ontbreekt" });
  }

  try {
    const db = await connectToMongoDB();
    await db.collection("geordende_figs").insertOne({
      userId: typeof userId === "string" ? userId : userId.toString(),
      name: fig.name,
      img: fig.img,
      set: set || null,
      status: status,
      date: new Date(),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }

  req.session.ordenenDone = (req.session.ordenenDone ?? 0) + 1;

  if ((req.session.ordenenDone ?? 0) >= (req.session.ordenenCount ?? 0)) {
    return res.json({ success: true, redirect: "/resultaat" });
  } else {
    return res.json({ success: true, redirect: "/factory" });
  }
});

router.post("/set-ordenen-count", async (req, res) => {
  const count = parseInt(req.body.count, 10);
  req.session.ordenenCount = count;
  req.session.ordenenDone = 0;

  const allFigs = await fetchMinifigs();
  const shuffled = allFigs.sort(() => 0.5 - Math.random());
  req.session.ordenenFigs = shuffled.slice(0, count);

  const userId = req.session.user?._id;
  if (userId) {
    const db = await connectToMongoDB();
    await db
      .collection("game_data")
      .updateOne(
        { playerId: typeof userId === "string" ? userId : userId.toString() },
        { $set: { totalFigs: count } }
      );
  }

  res.json({ success: true });

  console.log("Gekozen figs:", req.session.ordenenFigs);
});

export default router;
