import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/factory-welcome', (req: Request, res: Response) => {
  res.render('factory-welcome', { title: "Lego Fabriek", cssFiles: ['/css/factory-welcome.css'], jsFiles: ['/js/factory-welcome.js'] });
});

router.get('/factory', (req: Request, res: Response) => {
  res.render('factory', { title: "Lego Fabriek", cssFiles: ['/css/factory.css'], jsFiles: ['/js/factory.js'] });
});

router.get('/figordenen', (req: Request, res: Response) => {
  res.render('figordenen', { title: "Figs Ordenen", cssFiles: ['/css/figordenen.css'], jsFiles: ['/js/figordenen.js'] });
});

router.get('/ordenen', (req: Request, res: Response) => {
  res.render('ordenen', { title: "Ordenen", cssFiles: ['/css/ordenen.css'], jsFiles: ['/js/ordenen.js'] });
});
router.get('/resultaat', (req: Request, res:Response) => {
    res.render('resultaat', { title: "Resultaat", cssFiles: ['/css/resultaat.css'], jsFiles: ['/js/resultaat.js'] });
})

export default router;
