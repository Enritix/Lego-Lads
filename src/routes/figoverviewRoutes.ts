import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/blacklist', (req: Request, res: Response) => {
  res.render('blacklist', { title: "Blacklist", cssFiles: ['/css/blacklist.css'], jsFiles: ['/js/blacklist.js'] });
});

router.get('/detaillist', (req: Request, res: Response) => {
  res.render('detaillist', { title: "Lego Fabriek", cssFiles: ['/css/factory-welcome.css'], jsFiles: ['/js/factory-welcome.js'] });
});

router.get('/genre', (req: Request, res: Response) => {
  res.render('genre', { title: "Genre", cssFiles: ['/css/genre.css'], jsFiles: ['/js/genre.js'] });
});

router.get('/figset', (req: Request, res: Response) => {
  res.render('figset', { title: "Figset", cssFiles: ['/css/figset.css'], jsFiles: ['/js/figset.js'] });
});

export default router;
