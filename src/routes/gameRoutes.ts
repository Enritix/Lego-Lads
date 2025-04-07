import express, { Request, Response } from "express";
const router = express.Router();

router.get("/clickergame", (req: Request, res: Response) => {
  res.render("clickergame", { title: "Klikkerspel", cssFiles: ['/css/clickergame.css'], jsFiles: ['/js/clicker.js'] });
});

router.get("/memorygame", (req: Request, res: Response) => {
  res.render("memorygame", { title: "Geheugenspel", cssFiles: ['/css/memorygame.css'], jsFiles: ['/js/memorygame.js'] });
});

export default router;
