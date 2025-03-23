import axios from 'axios';

const API_KEY = '15f26f4e839a69264b4fb0d045edfc64';

export interface LegoItem {
  id: string;
  name: string;       // ingekort
  name_full: string;  // volledige naam voor hover geef het element dan een title tage mee -> <p title="<%= fig.name_full %>"><%= fig.name %></p>
  image: string;
}

// Abe: tijdelijk 10 figs ophalen en in een lijst zetten voor te gebruiken in ejs om dat we ng geen data base hebben 
async function fetchMinifigs(limit = 10) {
  try {
    const response = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/?page_size=${limit}`, {
      headers: {
        Authorization: `key ${API_KEY}`
      }
    });
    return response.data.results;
  } catch (error: any) {
    console.error('Fout bij ophalen van MINIFIGS:', error.response?.data || error.message);
    return [];
  }
}

// Abe: tijdelijk 10 figs ophalen en in een lijst zetten voor te gebruiken in ejs om dat we ng geen data base hebben 
async function fetchSets(limit = 10) {
  try {
    const response = await axios.get(`https://rebrickable.com/api/v3/lego/sets/?page_size=${limit}`, {
      headers: {
        Authorization: `key ${API_KEY}`
      }
    });
    return response.data.results;
  } catch (error: any) {
    console.error('Fout bij ophalen van SETS:', error.response?.data || error.message);
    return [];
  }
}

// Abe: 1 set en 1 fig op halen 
export async function fetchInitialData(): Promise<{ fig: LegoItem; legoSet: LegoItem }> {
  const [minifigs, sets] = await Promise.all([
    fetchMinifigs(1),
    fetchSets(1)
  ]);

  const fig: LegoItem = {
    id: minifigs[0].set_num,
    name: minifigs[0].name,
    name_full: sets[0].name,
    image: minifigs[0].set_img_url
  };

  const legoSet: LegoItem = {
    id: sets[0].set_num,
    name: sets[0].name,
    name_full: sets[0].name,
    image: sets[0].set_img_url
  };
  return { fig, legoSet };
}

// Abe: tijdelijk 10 figs ophalen en in een lijst zetten voor te gebruiken in ejs om dat we ng geen data base hebben 
export async function fetchInitialList(): Promise<{ figs: LegoItem[]; legoSets: LegoItem[] }> {
  const [minifigs, sets] = await Promise.all([
    fetchMinifigs(10),
    fetchSets(10)
  ]);

  const figs: LegoItem[] = minifigs.map((fig: any, index: number) => ({
    id: fig.set_num,
    name: fig.name.substring(0, 3).toUpperCase() + '...',
    name_full: fig.name, 
    image: fig.set_img_url
  }));

  const legoSets: LegoItem[] = sets.map((set: any) => ({
    id: set.set_num,
    name: set.name,
    image: set.set_img_url
  }));

 
  console.log('Figs:', figs);
  console.log('API 10 figs  klaar');
  return { figs, legoSets };
}


