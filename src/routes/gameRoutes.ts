import express, { Request, Response } from "express";
// import { getUserById, incrementAchievementProgress, collectAchievementReward } from "../database";
const router = express.Router();

router.get("/clickergame", (req: Request, res: Response) => {
  res.render("clickergame", {
    title: "Klikkerspel",
    cssFiles: ["/css/clickergame.css"],
    jsFiles: ["/js/clicker.js"],
  });
});

router.get("/memorygame", async (req: Request, res: Response) => {
  // const userId = "680d098a9e371da5cefb77cb";
  // const achievementKey = "coins";

  // const progress = await incrementAchievementProgress(userId, achievementKey, 30);
  // console.log("Progress:", progress);

  // let collectResult = null;
  // if (progress.finished) {
  //   collectResult = await collectAchievementReward(userId, achievementKey);
  //   console.log("Collected:", collectResult);
  // }

  res.render("memorygame", {
    title: "Geheugenspel",
    cssFiles: ["/css/memorygame.css"],
    jsFiles: ["/js/timer.js", "/js/memorygame.js", "/js/achievement.js"],
  });
});

export default router;
