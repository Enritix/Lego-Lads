import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { message: "main", title: "Home", cssFiles: ['/css/index.css'], jsFiles: ['/js/index.js'] });
});

router.get('/landingspage', (req: Request, res: Response) => {
  res.render('landingspage');
});

router.get('/loader', (req: Request, res: Response) => {
  res.render('loader');
});

export default router;
