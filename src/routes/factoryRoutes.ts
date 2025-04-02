import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/factory-welcome', (req: Request, res: Response) => {
  res.render('factory-welcome');
});

router.get('/factory', (req: Request, res: Response) => {
  res.render('factory');
});

router.get('/figordenen', (req: Request, res: Response) => {
  res.render('figordenen');
});

router.get('/ordenen', (req: Request, res: Response) => {
  res.render('ordenen');
});
router.get('/resultaat', (req: Request, res:Response) => {
    res.render('resultaat');
})

export default router;
