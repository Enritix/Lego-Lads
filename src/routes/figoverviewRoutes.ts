import express, { Request, Response } from "express";
import { addMinifigToBin, deleteMinifigFromBin, getBin } from "../database";
import {
  fetchMinifigByName,
  getThemeById,
  fetchSets,
  fetchThemes,
  fetchMinifigs,
} from "../apicalls";
import { binElement, Minifig } from "../interfaces";
const router = express.Router();

router.get("/blacklist", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  // await addMinifigToBin(userId.toString(), "Pirate", "lelijk");

  // Haal daarna de nieuwe bin-array op
  const bin = await getBin(userId.toString());

  const minifigs: Minifig[] = [];
  await Promise.all(
    bin.map(async (binElement: binElement) => {
      const minifig = await fetchMinifigByName(binElement.fig);
      minifigs.push(minifig);
    })
  );

  res.render("blacklist", {
    title: "Blacklist",
    cssFiles: ["/css/blacklist.css"],
    jsFiles: ["/js/blacklist.js"],
    bin: bin,
    minifigs: minifigs,
  });
});

router.post("/delete-minifig", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }
  let minifig = req.body.minifig;

  try {
    const progress = await deleteMinifigFromBin(userId.toString(), minifig);
    res.json({ success: true, progress });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/detaillist/:id", async (req: Request, res: Response) => {
  let themeId = parseInt(req.params.id);
  let theme = await getThemeById(themeId);

  const allSets = await fetchSets();

  const sets = allSets.filter((set) => set.theme === themeId);

  const setIds = sets.map((set) => set.id);

  const allMinifigs = await fetchMinifigs();
  const minifigs = allMinifigs.filter(
    (fig) => fig.set && setIds.includes(fig.set)
  );

  const minifigsWithSets = minifigs.map((fig) => {
    const matchingSet = sets.find((set) => set.id === fig.set);
    return {
      ...fig,
      sets: matchingSet ? [matchingSet] : [],
    };
  });

  res.render("detaillist", {
    title: "Lego Fabriek",
    theme: theme,
    minifigsWithSets,
    cssFiles: ["/css/detaillist.css"],
    jsFiles: ["/js/detaillist.js"],
  });
});

router.get("/genre", async (req: Request, res: Response) => {
  const themes = await fetchThemes();
  res.render("genre", {
    title: "Genre",
    cssFiles: ["/css/genre.css"],
    jsFiles: ["/js/genre.js"],
    themes,
  });
});

router.get("/figset", (req: Request, res: Response) => {
  res.render("figset", {
    title: "Figset",
    cssFiles: ["/css/figset.css"],
    jsFiles: ["/js/figset.js"],
  });
});

export default router;
