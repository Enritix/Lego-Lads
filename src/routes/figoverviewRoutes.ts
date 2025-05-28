import express, { Request, Response } from "express";
import { addMinifigToBin, deleteMinifigFromBin, deleteSortedFig, getBin, getSortedFigs, updateMinifigReason } from "../database";
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

router.post("/update-minifig-reason", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  const { fig, reason } = req.body;
  if (!userId || !fig || !reason) {
    return res.status(400).json({ success: false, message: "Data ontbreekt" });
  }
  try {
    await updateMinifigReason(userId.toString(), fig, reason);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
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
  const userId = req.session.user?._id;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  let themeId = parseInt(req.params.id);
  let theme = await getThemeById(themeId);

  const sortedFigs = await getSortedFigs(userId.toString());

  const sortedFigsForTheme = sortedFigs.filter((fig: any) => String(fig.theme) === String(themeId));

  let minifigsWithSets: any[] = [];
  if (sortedFigsForTheme.length > 0) {
    const allSets = await fetchSets();
    const allMinifigs = await fetchMinifigs();

    minifigsWithSets = await Promise.all(
      sortedFigsForTheme.map(async (sortedFig: any) => {
        const minifig = allMinifigs.find((fig) => fig.name === sortedFig.fig);
        const set = allSets.find((set) => String(set.id) === String(sortedFig.set));
        return {
          ...minifig,
          sets: set ? [set] : [],
        };
      })
    );
  }

  res.render("detaillist", {
    title: "Lego Fabriek",
    theme: theme,
    minifigsWithSets,
    cssFiles: ["/css/detaillist.css"],
    jsFiles: ["/js/detaillist.js"],
    noSortedFigs: sortedFigsForTheme.length === 0,
  });
});

router.post("/delete-sorted-fig", async (req: Request, res: Response) => {
  const userId = req.session.user?._id;
  const { fig, set, theme } = req.body;
  if (!userId || !fig || !set || !theme) {
    return res.status(400).json({ success: false, message: "Data ontbreekt" });
  }
  try {
    await deleteSortedFig(userId.toString(), String(fig), String(set), Number(theme));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
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
