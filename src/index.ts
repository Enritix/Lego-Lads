import express, { Request, Response} from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import mainRoutes from './routes/mainRoutes';
import factoryRoutes from './routes/factoryRoutes';
import profileRoutes from './routes/profileRoutes';
import figoverviewRoutes from './routes/figoverviewRoutes';
import {connectToMongoDB, insertTestUser, readAllUsers,deleteAllUsers} from './database';
import {fetchMinifigs,fetchSets,fetchThemes} from'./apicalls';
import { minifigsApi,setsApi,themesApi } from './middleware';

const app = express();
const PORT = 8092;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static("public"));
console.log("STATIC PATH →", path.join(__dirname, '../public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware func en var meegeven 
app.use(minifigsApi);
app.use(setsApi);
app.use(themesApi);

// middleware mongo db 
app.use(async (req, res ,next) => {
  const db = await connectToMongoDB();

 // Abe: dit moet  sesie token worden moeten we nog zien op school hoe enwat 
  const gebruikersnaam = "abe";

  const user = await db.collection("gebruikers").findOne({ gebruikersnaam });

  if (user) {
    res.locals.profielFig = user.profiel_fig; 
  } else {
    res.locals.profielFig = null;
  }

  next();
})


// Routes -> routes map
// Abe: hier activeer ik de route. routes staan in de SRC -> ROUTES "dan alles zo goed mogelijk samen ge groupd" daar schrijf je de logica voor uw pages uw js omzetten dus uw html page zet ge un de map views.
app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/', chatbotRoutes);
app.use('/', mainRoutes);
app.use('/', factoryRoutes);
app.use('/', profileRoutes);
app.use('/', figoverviewRoutes);





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





