import express, { Request, Response } from "express";
import {
  getGameData,
  connectToMongoDB,
  insertUserGameData,
  getUserById,
  updateGameDataFromFactory,
  updateGameDataFromOrdenen,
  deleteMinifigFromBin,
  addMinifigToBin,
} from "../database";
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

router.get("/factory", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User of fig ontbreekt" });
  }
  const gameData = await getGameData(userId.toString());
  const currentFig = gameData.figs.find(
    (fig: { status: string }) => fig.status === "pending"
  );

  res.render("factory", {
    title: "Lego Fabriek",
    cssFiles: ["/css/factory.css"],
    jsFiles: ["/js/factory.js"],
    currentFig: currentFig,
  });
});

router.get("/figordenen", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ontbreekt" });
  }
  const gameData = await getGameData(userId.toString());
  const pendingFig = gameData.figs.find((fig: any) => fig.status === "pending");
  if (!pendingFig) {
    return res.redirect("/resultaat");
  }

  const allSets = await fetchSets();

  const correctSet = allSets.find((set: any) => set.code === pendingFig.set);
  const otherSets = allSets.filter((set: any) => set.code !== pendingFig.set);
  const shuffled = otherSets.sort(() => 0.5 - Math.random());
  const randomSets = [correctSet, ...shuffled.slice(0, 2)].sort(
    () => 0.5 - Math.random()
  );

  // if (
  //   (req.session.ordenenDone ?? 0) >= (req.session.ordenenCount ?? 0) &&
  //   (req.session.ordenenCount ?? 0) > 0
  // ) {
  //   return res.redirect("/resultaat");
  // }

  // const idx = req.session.ordenenDone ?? 0;
  // const fig = req.session.ordenenFigs ? req.session.ordenenFigs[idx] : null;
  // req.session.currentFig = fig;

  res.render("figordenen", {
    title: "Figs Ordenen",
    cssFiles: ["/css/figsordenen.css"],
    jsFiles: ["/js/figsordenen.js"],
    sets: randomSets,
    currentFig: pendingFig,
  });
});

router.get("/ordenen", (req: Request, res: Response) => {
  res.render("ordenen", {
    title: "Ordenen",
    cssFiles: ["/css/ordenen.css"],
    jsFiles: ["/js/ordenen.js"],
  });
});


interface Fig {
  name: string;
  img: string;
  status: "pending" | "assigned" | "destroyed";
  date?: string;
  set?: string;
}

router.get("/resultaat", async (req: Request, res: Response) => {
  const playerId = req.session.user?._id;

  if (!playerId) return res.redirect("/login");

  try {
    const gameData = await getGameData(playerId.toString());
    const figs: Fig[] = gameData?.figs || [];
    res.render("resultaat", {
      title: "Resultaat",
      cssFiles: ["/css/resultaat.css"],
      jsFiles: ["/js/resultaat.js"],
      figs
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Fout bij ophalen van resultaten");
  }
});

router.post("/get-game-data", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User of fig ontbreekt" });
  }

  try {
    const gameData = await getGameData(userId.toString());
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
    await addMinifigToBin(userId.toString(), fig.name, reason);
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
  const userId = req.session.user?._id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ontbreekt" });
  }

  try {
    const db = await connectToMongoDB();
    const insertResult = await insertUserGameData(userId.toString(), count);
    const newGameData = await db
      .collection("game_data")
      .findOne({ _id: insertResult.insertedId });
    return res.json({ success: true, gameData: newGameData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Enrico: dit is een post die random figs in de game data zet
router.post("/set-random-figs", async (req, res) => {
  const userId = req.session.user?._id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User of fig ontbreekt" });
  }

  try {
    const user = await getUserById(userId.toString());
    const allFigs = user.figs;
    const allFigsWithoutBin = allFigs.filter(
      (fig: any) => !user.bin.some((b: any) => b.fig === fig.name)
    );
    const shuffled = allFigsWithoutBin.sort(() => 0.5 - Math.random());

    const gameData = await getGameData(userId.toString());
    const totalFigs = gameData?.totalFigs;

    const randomFigs = shuffled.slice(0, totalFigs);

    const allMinifigs = await fetchMinifigs();
    const randomFigsWithSet = randomFigs.map((fig: any) => {
      const found = allMinifigs.find(
        (minifig: any) => minifig.name === fig.name
      );
      return {
        ...fig,
        set: found ? found.set : null,
        status: "pending",
      };
    });
    const gameStatus = "pending";

    const updatedGameData = await updateGameDataFromFactory(
      userId.toString(),
      randomFigsWithSet,
      gameStatus
    );
    if (!updatedGameData) {
      return res
        .status(404)
        .json({ success: false, message: "User game data not found" });
    }
    req.session.ordenenFigs = randomFigs;
    res.json({ success: true, gameData: updatedGameData });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/set-status", async (req, res) => {
  const userId = req.session.user?._id;
  const { status, gameStatus } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User of fig ontbreekt" });
  }

  try {
    const gameData = await updateGameDataFromOrdenen(
      userId.toString(),
      status,
      gameStatus
    );
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

export default router;
