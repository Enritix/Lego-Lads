import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = 8080;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  res.render('index', { message: "Welkom bij Lego Masters!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
