import express, { Request, Response } from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import mainRoutes from './routes/mainRoutes';
import factoryRoutes from './routes/factoryRoutes';
import profileRoutes from './routes/profileRoutes';
import figoverviewRoutes from './routes/figoverviewRoutes';
import apicallRoutes from './routes/apicallRoutes';
import { fetchInitialData } from './apicalls';

const app = express();
const PORT = 8092;

// hier komt middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

let globalFig: any = null;
let globalSet: any = null;

app.use(async (req: Request, res: Response, next) => {
  // Abe: eerst kijken of  er al een set of fig is wo nee dan doen we api call zo nee niet dit is voorlopig 
  if (!globalFig || !globalSet) {
    try {
      const { fig, legoSet } = await fetchInitialData();
      globalFig = fig;
      globalSet = legoSet;
      
      
    } catch (err) {
      console.error('Fout van API-data:', err);
    }
  }
// Abe: dit is dat het beschikbaar is op elke page,ejs
  res.locals.fig = globalFig;
  res.locals.legoSet = globalSet;

  next();
});

// Routes -> routes map
// Abe: hier activeer ik de route. routes staan in de SRC -> ROUTES "dan alles zo goed mogelijk samen ge groupd" daar schrijf je de logica voor uw pages uw js omzetten dus uw html page zet ge un de map views.
app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/', chatbotRoutes);
app.use('/', mainRoutes);
app.use('/', factoryRoutes);
app.use('/', profileRoutes);
app.use('/', figoverviewRoutes);
app.use('/', apicallRoutes);

// Abe: hier zie je op welke poort de server draait als je problemen hent met ALREADY IN USE  laat dit dan weten.  (in de console) normaal als die al in gebruiks is  gaat het naar de volgende 
function startServer(port: number) {
  app.listen(port, () => {
    console.log(`Server http://localhost:${port}`);
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(` Poort ${port} is al in gebruik. volgende is  ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Serverfout:', err);
    }
  });
}


startServer(PORT);




