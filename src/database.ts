import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config();



/*require('dotenv').config();
const mongoose = require('mongoose');

 export async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\x1b[34m Verbonden met MongoDB\x1b[0m');
    console.log('\x1b[34m je kan beginnen met spaghetti code te  schrijven \x1b[0m)')
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fout bij verbinden:', err.message);
    } else {
      console.error(err);
    }
  }
}*/




const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI staat niet in je .env bestand");

const client = new MongoClient(uri);

export async function connectToMongoDB(): Promise<Db> {
  try {
    await client.connect();
    console.log('\x1b[34mVerbonden met MongoDB\x1b[0m');
    console.log('\x1b[34mJe mag beginnen met spaghetti code schrijven!\x1b[0m');
    return client.db("LegoLads"); 
  } catch (err) {
    if (err instanceof Error) {
      console.error('Fout bij verbinden:', err.message);
    } else {
      console.error(err);
    }
    throw new Error("Verbinding met MongoDB is mislukt");
  }
}

// Abe: hier word een user test template gemaakt 

export function createUserTemplate(
  gebruikersnaam: string,
  wachtwoord: string,
  email: string,
  profiel_fig: string
) {
  return {
    gebruikersnaam,
    wachtwoord,
    email,
    profiel_fig,
    munten: 500,
    verdiende_munten: 800,
    uitgegeven_munten: 300,
    figs: [
      {
        naam: "batman",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/batman.png?raw=true",
        rarity: "episch"
      },
      {
        naam: "driod",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/droid.png?raw=true",
        rarity: "legendarisch"
      },
      {
        naam: "joker",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/joker.png?raw=true",
        rarity: "episch"
      }
    ],
    vuilbak: [
      {
        fig: "pirate",
        reden: "per ongeluk verwijderd"
      }
    ],
    geordendeFigs: [
      {
        fig: "anakin",
        set: "ambush-on-errix",
        theme: "theme01"
      },
      {
        fig: "chen",
        set: "the-joker-steam-roller",
        theme: "theme02"
      }
    ],
    achievements: {
      "100_coins": {
        title: "100 munten",
        description: "Verdien 100 munten",
        current: 55,
        total: 100,
        finished: false
      },
      "first_login": {
        title: "Login",
        description: "Log voor de eerste keer in",
        current: 1,
        total: 1,
        finished: true
      }
    },
    kisten: {
      ongewoon: 2,
      episch: 1,
      legendarisch: 0
    },
    keys: 5,
    clickerGame: {
      stenen: 150,
      tools: {
        hamer: {
          level: 2
        },
        zaag: {
          level: 1
        },
        boor: {
          level: 3
        }
      }
    }
  };
}
// Abe: test data word toegevoegd 
export async function insertTestUser() {
  const db = await connectToMongoDB(); 
  const gebruiker = createUserTemplate("abe", "lego", "abe@email.com", "agent");
  const result = await db.collection("gebruikers").insertOne(gebruiker);
  console.log("Testgebruiker toegevoegd met ID:", result.insertedId);
}
// Abe: gebruikers worden uitgelezen
export async function readAllUsers() {
  const db = await connectToMongoDB(); 
  const gebruikers = await db.collection("gebruikers").find().toArray();
  console.log("Alle gebruikers:", gebruikers);
}

// Abe: voor users te deleten was effe voor te testen en op te kuisen
export async function deleteAllUsers() {
  const db = await connectToMongoDB();
  const result = await db.collection("gebruikers").deleteMany({});
  console.log(`${result.deletedCount} gebruikers verwijderd.`);
}
