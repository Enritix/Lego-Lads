import express, { Request, Response } from "express";
import { getUserById } from "../database";
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

router.post("/get-user-figs", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, figs: user.figs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
