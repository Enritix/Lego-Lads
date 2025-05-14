/*import axios from 'axios';

const API_KEY = '15f26f4e839a69264b4fb0d045edfc64';


// Abe: api calls rebriable
 require('dotenv').config();
const API_KEY = process.env.API_KEY;

interface LegoFig {
  set_num: string;
  name: string;
  set_img_url: string;
  rarity: 'gewoon'|'episch'|'legendary';
}

// Abe: hier eggen we welke index welke rarety moet krijgen kan ng veranderd worden is voorlopig
//  Indexen 0 tem 4 → gewoon
// Indexen 5 tem 7 → episch
// Index 8 → legendary
// Daarna begint het opnieuww door modullo 9 te gebruiken
function getRarity(index: number):'gewoon'|'episch'|'legendary'{
  const cykleIndex = index % 9;

  if(cykleIndex <5) return'gewoon';
  if(cykleIndex <8 ) return 'episch';
  return'legendary'
}

// Abe: lego figs fetchen en in array figs[] steken voorlopig 5 (page_size=5)
// Abe: nog een manier vinden om de namen mooi kort te krijgen (onmogelijk denk ik)
export async function fetchfigs() {
  try {
    const response = await fetch('https://rebrickable.com/api/v3/lego/minifigs?page_size=9', {
      headers: {
        'Authorization': `key ${API_KEY}`
      }
    });
    const figData = await response.json();
    const figs: LegoFig[] = figData.results.map((fig: any, index: number)=>({
      set_num: fig.set_num,
      name: fig.name,
      set_img_url: fig.set_img_url,
      rarity: getRarity(index),
    }));
    console.log(" response apo . ");
    figs.forEach(fig => {
      console.log(`${fig.name} --rarety: ${fig.rarity}`);
    });
    figs.forEach(fig => {
      console.log(`Naam: ${fig.name}`);
      console.log(`Nummer: ${fig.set_num}`);
      console.log(`Afbeelding: ${fig.set_img_url}`);
    });
    return figs;
  }
  catch(error: any){
    console.log(error)
    return [];
  }
}

// Abe: lego stets fetchen en in array sets[] steken   voorlopig 5 (page_size=5)
interface LegoSet {
  set_num: string;
  name: string;
  year: number;
  theme_id: number;
  num_parts: number;
  set_img_url: string;
  set_url: string;
}
export async function  fetchsets() {
  try {
    const response = await fetch ('https://rebrickable.com/api/v3/lego/sets?page_size=5',{
      headers:{
         'Authorization': `key ${API_KEY}`
      }
    });
    const setData = await response.json();
    const sets: LegoSet[] = setData.results;
    console.log(setData)
  }
  catch(error: any){
    console.log(error)
  }
}*/

import { Request, Response, NextFunction } from "express";
//Abe : minifigs ophalen eigen api ;)
interface Minifig {
  id: number;
  name: string;
  rarity: string;
  img: string;
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
