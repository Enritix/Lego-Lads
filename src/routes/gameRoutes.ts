import express, { Request, Response } from "express";
import { getUserById, incrementAchievementProgress } from "../database";
const router = express.Router();

router.get("/clickergame", (req: Request, res: Response) => {
  res.render("clickergame", {
    title: "Klikkerspel",
    cssFiles: ["/css/clickergame.css"],
    jsFiles: ["/js/clicker.js"],
  });
});

router.get("/memorygame", async (req: Request, res: Response) => {
  const userId = "67fd62e96aa5b6e79491bea4";
const achievementKey = "100_coins"; 
const incrementBy = 45;

try {
  const result = await incrementAchievementProgress(userId, achievementKey, incrementBy);
  console.log("Achievement bijgewerkt:", result);
} catch (error: any) {
  console.error("Fout bij updaten van achievement:", error.message);
}

  console.log(getUserById(userId));

  res.render("memorygame", {
    title: "Geheugenspel",
    cssFiles: ["/css/memorygame.css"],
    jsFiles: ["/js/timer.js", "/js/memorygame.js"],
  });
});

export default router;
