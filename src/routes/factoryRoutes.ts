import express, { Request, Response } from "express";
import { getGameData, connectToMongoDB } from "../database";
import { fetchSets } from "../apicalls";
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

  console.log("ORDEN-FIG route aangeroepen:", { userId, fig, set, status });

  if (!userId || !fig || !status) {
    console.log("ORDEN-FIG: ontbrekende data", { userId, fig, set, status });
    return res.status(400).json({ success: false, message: "Data ontbreekt" });
  }

  try {
    const db = await connectToMongoDB();
    const result = await db.collection("geordende_figs").insertOne({
      userId: typeof userId === "string" ? userId : userId.toString(),
      name: fig.name,
      img: fig.img,
      set: set || null,
      status: status,
      date: new Date(),
    });
    console.log("ORDEN-FIG: insert result", result);
    res.json({ success: true });
  } catch (error: any) {
    console.log("ORDEN-FIG: error", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
