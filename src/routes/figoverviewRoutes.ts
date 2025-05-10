import express, { Request, Response } from "express";
import { deleteMinifigFromBin, getBin } from "../database";
import { fetchMinifigByName, getThemeById } from "../apicalls";
import { binElement, Minifig } from "../interfaces";
const router = express.Router();

router.get("/blacklist", async (req: Request, res: Response) => {
  const userId = "680d098a9e371da5cefb77cb";
  const bin = await getBin(userId);

  const minifigs: Minifig[] = [];
  await Promise.all(
    bin.map(async (binElement: binElement) => {
      const minifig = await fetchMinifigByName(binElement.fig);
      minifigs.push(minifig);
    })
  );

  // await deleteMinifigFromBin(userId, "Pirate");

  res.render("blacklist", {
    title: "Blacklist",
    cssFiles: ["/css/blacklist.css"],
    jsFiles: ["/js/blacklist.js"],
    bin: bin,
    minifigs: minifigs,
  });
});

router.post("/delete-minifig", async (req: Request, res: Response) => {
  let userId = req.body.userId;
  let minifig = req.body.minifig;

  try {
    const progress = await deleteMinifigFromBin(userId, minifig);
    res.json({ success: true, progress });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/detaillist/:id", async (req: Request, res: Response) => {
  let themeId = parseInt(req.params.id);
  let theme = await getThemeById(themeId);

  res.render("detaillist", {
    title: "Lego Fabriek",
    theme: theme,
    cssFiles: ["/css/detaillist.css"],
    jsFiles: ["/js/detaillist.js"],
  });
});

router.get("/genre", (req: Request, res: Response) => {
  res.render("genre", {
    title: "Genre",
    cssFiles: ["/css/genre.css"],
    jsFiles: ["/js/genre.js"],
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
