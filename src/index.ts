import express, { Request, Response } from 'express';
import path from 'path';
import authRoutes from './routes/authRoutes';
import gameRoutes from './routes/gameRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import mainRoutes from './routes/mainRoutes';
import factoryRoutes from './routes/factoryRoutes';
import profileRoutes from './routes/profileRoutes';
import figoverviewRoutes from './routes/figoverviewRoutes';

const app = express();
const PORT = 8091;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// Abe: hier activeer ik de route. routes staan in de routes staan in de SRC -> ROUTES "dan alles zo goed mogelijk samen ge groupd" daar schrijf je de logica voor uw pages uw js omzetten dus uw html page zet ge un de map views.
app.use('/', authRoutes);
app.use('/', gameRoutes);
app.use('/', chatbotRoutes);
app.use('/', mainRoutes);
app.use('/', factoryRoutes);
app.use('/', profileRoutes);
app.use('/', figoverviewRoutes);

// Abe: hier zie je op welke poort de server draait als je problemen hent met ALREADY IN USE  laat dit dan weten. (in de console)
app.listen(PORT, () => {
  console.log(`port http://localhost:${PORT}`);
});
