import express, { Request, Response} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import mainRoutes from './routes/mainRoutes';
import factoryRoutes from './routes/factoryRoutes';
import profileRoutes from './routes/profileRoutes';
import figoverviewRoutes from './routes/figoverviewRoutes';
import {connectToMongoDB, insertTestUser, readAllUsers,deleteAllUsers} from './database';
import {fetchMinifigs,fetchSets,fetchThemes} from'./apicalls';
import { minifigsApi,requireAuth,setsApi,themesApi } from './middleware';
import sessionMiddleware from './sessions';
import apiRoutes from'./routes/profileRoutes';

const app = express();
const PORT = 8092;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static("public"));
console.log("STATIC PATH →", path.join(__dirname, '../public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

// middleware func en var meegeven 
app.use(minifigsApi);
app.use(setsApi);
app.use(themesApi);

app.use(sessionMiddleware);

// middleware mongo db 
app.use(async (req, res, next) => {
  const db = await connectToMongoDB();

  // Gebruik de ingelogde gebruiker uit de session
  const username = req.session.user?.username;

  if (username) {
    const user = await db.collection("gebruikers").findOne({ username });
    if (user) {
      res.locals.profileFig = user.profile_fig; 
      res.locals.username = user.username;
      res.locals.coins = user.coins;
      res.locals.spent_coins = formatCoins(user.spent_coins);
      res.locals.earned_coins = formatCoins(user.earned_coins);
      res.locals.formattedCoins = formatCoins(user.coins);
    } else {
      res.locals.profileFig = null;
    }
  } else {
    res.locals.profileFig = null;
  }

  next();
});


// Routes -> routes map
// Abe: hier activeer ik de route. routes staan in de SRC -> ROUTES "dan alles zo goed mogelijk samen ge groupd" daar schrijf je de logica voor uw pages uw js omzetten dus uw html page zet ge un de map views.
app.use('/:lang(nl|en)', (req, res, next) => {
  res.locals.lang = req.params.lang;
  next();
});



// Enrico: dit moet hier staan omdat de landingspage geen auth nodig heeft
app.get('/:lang(nl|en)/landingspage', (req: Request, res: Response) => {
  res.render('landingspage');
});
app.use("/api", apiRoutes);
app.use('/:lang(nl|en)', authRoutes);
app.use('/:lang(nl|en)', requireAuth, gameRoutes);
app.use('/:lang(nl|en)', requireAuth, chatbotRoutes);
app.use('/:lang(nl|en)', mainRoutes);
app.use('/:lang(nl|en)', requireAuth, factoryRoutes);
app.use('/:lang(nl|en)', requireAuth, profileRoutes);
app.use('/:lang(nl|en)', requireAuth, figoverviewRoutes);
app.use('/api', apiRoutes);
app.use('/:lang(nl|en)/api', apiRoutes);





app.use((req, res, next) => {
  const langMatch = req.path.match(/^\/(nl|en)(\/|$)/);
  if (!langMatch) {
    const lang = req.cookies.lang === 'en' ? 'en' : 'nl';
    return res.redirect(`/${lang}${req.path}`);
  }
  next();
});



// Abe: hier zie je op welke poort de server draait als je problemen hent met ALREADY IN USE  laat dit dan weten.  (in de console) normaal als die al in gebruiks is  gaat het naar de volgende en een promis van gemaakt voor startApp
function startServer(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`\x1b[34m Server draait op http://localhost:${port}\x1b[0m`);
      resolve(); 
    });


    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`\x1b[31m Poort ${port} is al in gebruik. Probeer ${port + 1}...\x1b[0m`);
        resolve(startServer(port + 1)); 
      } else {
        reject(err); 
      }
    });
  });
}

//Abe: zorgen dat alles 
async function startApp() {
  try {
    await startServer(PORT);       
    await connectToMongoDB();   
    /*await insertTestUser();*/
    await readAllUsers();     
    await fetchMinifigs();              
    await fetchSets();
    await fetchThemes()
    /*await deleteAllUsers();*/
  } catch (err) {
    console.error( err);
  }
}
startApp()

// Enrico: hier word de coins geformatteerd naar K als het meer dan 1000 is
function formatCoins(coins: number): string {
  if (coins >= 1000) {
    return Math.floor(coins / 100) / 10 + "K";
  }
  return coins.toString();
}



