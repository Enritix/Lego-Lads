import { Request, Response, NextFunction } from 'express';
import {fetchMinifigs,fetchSets,fetchThemes} from'./apicalls';

// Abe: api middleware
export async function minifigsApi(req: Request, res: Response, next: NextFunction) {
    try {
      const figs = await fetchMinifigs();
      res.locals.minifigs = figs;
    } catch (err) {
      console.error('Fout bij  minifigsApi middleware.ts:', err);
      res.locals.minifigs = []; // Abe: geeft een lege terug
    }
    next();
  }

  export async function setsApi(req: Request, res: Response, next: NextFunction) {
    try {
      const sets = await fetchSets();
      res.locals.sets = sets;
    } catch (err) {
      console.error('Fout bij setsApi middleware.ts:', err);
      res.locals.sets = []; // Abe: geeft een lege terug
    }
    next();
  }

  export async function themesApi(req: Request, res: Response, next: NextFunction) {
    try {
      const themes = await fetchThemes();
      res.locals.themes = themes;
    } catch (err) {
      console.error('Fout bij themesApi middleware.ts:', err);
      res.locals.themes = []; // Abe: geeft een lege terug
    }
    next();
  }
  