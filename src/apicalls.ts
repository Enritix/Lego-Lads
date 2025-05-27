

import { Request, Response, NextFunction } from "express";
//Abe : minifigs ophalen eigen api ;)
interface Minifig {
  id: number;
  name: string;
  rarity: string;
  img: string;
  set?: number | null;
}

export async function fetchMinifigs(): Promise<Minifig[]> {
  const res = await fetch("https://supabase-api-q362.onrender.com/minifigs");

  if (!res.ok) {
    throw new Error(`Foutt ophalen: ${res.status}`);
  }

  const data: Minifig[] = await res.json();

  console.log("\x1b[34m figs \x1b[0m", data);

  return data;
}

export async function fetchMinifigByName(name: string): Promise<Minifig> {
  const minifigName = name;
  const minifigs = await fetchMinifigs();
  let foundMinifig: Minifig = {
    id: 0,
    name: "",
    rarity: "",
    img: "",
  };
  minifigs.forEach((minifig) => {
    if (minifig.name === minifigName) {
      foundMinifig = {
        id: minifig.id,
        name: minifig.name,
        rarity: minifig.rarity,
        img: minifig.img,
      };
    }
  });
  return foundMinifig;
}

interface Sets {
  id: number;
  name: string;
  img: string;
  code: string;
  theme: number;
}

export async function fetchSets(): Promise<Sets[]> {
  const res = await fetch("https://supabase-api-q362.onrender.com/sets");

  if (!res.ok) {
    throw new Error(`Foutt ophalen: ${res.status}`);
  }

  const data: Sets[] = await res.json();

  console.log("\x1b[34m sets \x1b[0m", data);

  return data;
}

interface Theme {
  id: number;
  name: string;
  img: string;
}

export async function fetchThemes(): Promise<Theme[]> {
  const res = await fetch("https://supabase-api-q362.onrender.com/theme");

  if (!res.ok) {
    throw new Error(`Foutt ophalen: ${res.status}`);
  }

  const data: Theme[] = await res.json();

  console.log("\x1b[34mthemes \x1b[0m", data);

  return data;
}

export async function getThemeById(id: number): Promise<Theme> {
  try {
    const themes = await fetchThemes();
    const foundTheme = themes.find((theme) => theme.id === id);
    if (!foundTheme) {
      throw new Error("Theme niet gevonden.");
    }
    return foundTheme;
  } catch (error) {
    console.error("Fout bij ophalen theme:", error);
    throw error;
  }
}

 // Abe: random figs voor shop
export async function fetchRandomMinifigs(
  amount = 10,
  excludeNames: string[] = []
): Promise<Minifig[]> {
  const res = await fetch(`https://supabase-api-q362.onrender.com/minifigs?_=${Date.now()}`);
  if (!res.ok) {
    throw new Error(`Fout bij ophalen: ${res.status}`);
  }

  const allFigs: Minifig[] = await res.json();

  const availableFigs = allFigs.filter(fig => !excludeNames.includes(fig.name));

  const shuffled = availableFigs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, amount);
}

