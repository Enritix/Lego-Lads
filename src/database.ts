import { MongoClient, Db, ObjectId } from "mongodb";
import { User } from "./interfaces";
import dotenv from "dotenv";
import { randomUUID } from "crypto";
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

export const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
if (!uri) throw new Error("MONGO_URI staat niet in je .env bestand");

const client = new MongoClient(uri);

export async function connectToMongoDB(): Promise<Db> {
  try {
    await client.connect();
    console.log("\x1b[34mVerbonden met MongoDB\x1b[0m");
    console.log("\x1b[34mJe mag beginnen met spaghetti code schrijven!\x1b[0m");
    return client.db("LegoLads");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Fout bij verbinden:", err.message);
    } else {
      console.error(err);
    }
    throw new Error("Verbinding met MongoDB is mislukt");
  }
}

// Abe: hier word een user test template gemaakt

export function createUserTemplate(
  username: string,
  password: string,
  email: string,
  profile_fig: string
) {
  return {
    username,
    password,
    email,
    profile_fig,
    coins: 0,
    earned_coins: 0,
    spent_coins: 0,
    figs: [
      {
        name: "Batman",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/batman.png?raw=true",
        rarity: "episch",
      },
      {
        name: "Droid",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/droid.png?raw=true",
        rarity: "legendarisch",
      },
      {
        name: "Joker",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/joker.png?raw=true",
        rarity: "episch",
      },
      {
        name: "Jack Sparrow",
        img: "https://raw.githubusercontent.com/Enritix/lego-images/refs/heads/main/jack_sparrow.png",
        rarity: "legendarisch",
      },
      {
        name: "Arctic Guy",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/artic.png?raw=true",
        rarity: "gewoon",
      },
      {
        name: "Peter Parker",
        img: "https://github.com/AbeVerschueren/lego-img/blob/main/peter.png?raw=true",
        rarity: "gewoon",
      },
    ],
    bin: [
      {
        fig: "Pirate",
        reason: "per ongeluk verwijderd",
      },
    ],
    ordenedFigs: [
      // {
      //   fig: "Anakin",
      //   set: "ambush-on-errix",
      //   theme: "theme01",
      // },
      // {
      //   fig: "Chen",
      //   set: "the-joker-steam-roller",
      //   theme: "theme02",
      // },
    ],
    achievements: {
      coins: {
        title: "Muntverzamelaar",
        description: "Verzamel munten om beloningen te verdienen.",
        current: 0,
        goal: 100,
        reward: 200,
        finished: false,
        collected: false,
      },
      login_streak: {
        title: "Dagelijkse login",
        description: "Log dagelijks in voor hogere beloningen.",
        current: 0,
        goal: 1,
        reward: 100,
        finished: false,
        collected: false,
      },
    },
    chests: {
      uncommon: 2,
      epic: 1,
      legendary: 0,
    },
    keys: 5,
    clickerGame: {
      blocks: 150,
      tools: {
        hammer: {
          level: 2,
        },
        saw: {
          level: 1,
        },
        drill: {
          level: 3,
        },
      },
    },
    settings: {
      sound: true,
      music: true,
      filter: "normal",
      language: "nl",
      brightness: 7,
    },
  };
}

export function createUserGameData(playerId: string, totalFigs: number) {
  return {
    playerId,
    figs: [],
    totalFigs,
    gameStatus: "pending",
    createdAt: new Date(),
  };
}
// Abe: test data word toegevoegd
export async function insertTestUser() {
  const db = await connectToMongoDB();
  const gebruiker = createUserTemplate(
    "abe",
    "lego",
    "abe@email.com",
    "https://github.com/AbeVerschueren/lego-img/blob/main/batman.png?raw=true"
  );
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

// Enrico: hier word de user uit de database gehaald met de id
export async function getUserById(userId: string) {
  const db = await connectToMongoDB();
  const gebruiker = await db
    .collection("gebruikers")
    .findOne({ _id: new ObjectId(userId) });
  if (!gebruiker) {
    throw new Error("Gebruiker niet gevonden");
  }
  return gebruiker;
}

// Abe: dit moet  sesie token worden moeten we nog zien op school hoe enwat
export async function updateUserFig(username: string, img: string) {
  console.log("👤 Gebruikersnaam in functie:", username);

  const db = await connectToMongoDB();
  const result = await db
    .collection("gebruikers")
    .updateOne({ username }, { $set: { profile_fig: img } });
}

// Enrico: hier worden de coins van de user uitgelezen
export async function getUserCoins(userId: string) {
  const db = await connectToMongoDB();
  const gebruiker = await db
    .collection("gebruikers")
    .findOne({ _id: new ObjectId(userId) });
  if (!gebruiker) {
    throw new Error("Gebruiker niet gevonden");
  }
  return gebruiker.coins;
}

// Enrico: hier worden de coins van de user geupdate
export async function updateUserCoins(userId: string, addedCoins: number) {
  const db = await connectToMongoDB();

  let update: any = {};
  if (addedCoins > 0) {
    update = {
      $inc: { coins: addedCoins, earned_coins: addedCoins },
    };
  } else if (addedCoins < 0) {
    update = {
      $inc: { coins: addedCoins, spent_coins: Math.abs(addedCoins) },
    };
  } else {
    return;
  }

  const result = await db
    .collection("gebruikers")
    .updateOne({ _id: new ObjectId(userId) }, update);

  if (result.modifiedCount === 0) {
    throw new Error("Geen wijzigingen aangebracht in de gebruiker.");
  }
}

// Enrico: hier worden de achievements van de user uitgelezen
export async function getUserAchievements(userId: string) {
  const db = await connectToMongoDB();
  const gebruiker = await db
    .collection("gebruikers")
    .findOne({ _id: new ObjectId(userId) });
  if (!gebruiker) {
    throw new Error("Gebruiker niet gevonden");
  }
  return gebruiker.achievements;
}

// Enrico: hier worden de achievements van de user geupdate
export async function incrementAchievementProgress(
  userId: string,
  achievementKey: string,
  incrementBy: number
) {
  const db = await connectToMongoDB();

  const gebruiker = await db
    .collection("gebruikers")
    .findOne(
      { _id: new ObjectId(userId) },
      { projection: { [`achievements.${achievementKey}`]: 1 } }
    );

  const achievement = gebruiker?.achievements?.[achievementKey];
  if (!achievement) {
    throw new Error(
      `Achievement '${achievementKey}' niet gevonden voor gebruiker.`
    );
  }

  const newCurrent = achievement.current + incrementBy;
  const isFinished = newCurrent >= achievement.goal;

  const result = await db.collection("gebruikers").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        [`achievements.${achievementKey}.current`]: newCurrent,
        [`achievements.${achievementKey}.finished`]: isFinished,
      },
    }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Geen wijzigingen aangebracht in de gebruiker.");
  }

  return {
    title: achievement.title,
    current: newCurrent,
    goal: achievement.goal,
    finished: isFinished,
  };
}

// Enrico: hier worden de coins van een achievement gecollect en de user zijn coins geupdate
export async function collectAchievementReward(
  userId: string,
  achievementKey: string
) {
  const db = await connectToMongoDB();

  const gebruiker = await db
    .collection("gebruikers")
    .findOne(
      { _id: new ObjectId(userId) },
      { projection: { coins: 1, [`achievements.${achievementKey}`]: 1 } }
    );

  const achievement = gebruiker?.achievements?.[achievementKey];
  if (!achievement) {
    throw new Error(
      `Achievement '${achievementKey}' niet gevonden voor gebruiker.`
    );
  }

  if (!achievement.finished || achievement.collected) {
    throw new Error("Achievement is nog niet voltooid of al opgehaald.");
  }

  const newCoins = gebruiker.coins + achievement.reward;

  const leftoverProgress = achievement.current - achievement.goal;

  const newGoal = achievement.goal * 2;
  const newReward = achievement.reward * 2;

  const newFinished = leftoverProgress >= newGoal;

  const result = await db.collection("gebruikers").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        coins: newCoins,
        [`achievements.${achievementKey}.current`]: leftoverProgress,
        [`achievements.${achievementKey}.goal`]: newGoal,
        [`achievements.${achievementKey}.reward`]: newReward,
        [`achievements.${achievementKey}.finished`]: newFinished,
        [`achievements.${achievementKey}.collected`]: false,
      },
    }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Kon beloning niet verzamelen.");
  }

  return {
    coins: newCoins,
    current: leftoverProgress,
    goal: newGoal,
    reward: newReward,
    finished: newFinished,
  };
}

// Enrico: hier worden de settings van de user uitgelezen
export async function getUserSettings(userId: string) {
  const db = await connectToMongoDB();
  const gebruiker = await db
    .collection("gebruikers")
    .findOne({ _id: new ObjectId(userId) });
  if (!gebruiker) {
    throw new Error("Gebruiker niet gevonden");
  }
  return gebruiker.settings;
}

// Enrico: hier worden de settings van de user geupdate
export async function updateUserSettings(userId: string, newSettings: any) {
  const db = await connectToMongoDB();
  const result = await db
    .collection("gebruikers")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { settings: newSettings } }
    );
  if (result.modifiedCount === 0) {
    throw new Error("Geen wijzigingen aangebracht in de gebruiker.");
  }
}

// Lars: hier wordt de hele vuilbak getoond

export async function getBin(userId: string) {
  const db = await connectToMongoDB();
  const gebruiker = await db
    .collection("gebruikers")
    .findOne({ _id: new ObjectId(userId) });
  if (!gebruiker) {
    throw new Error("Gebruiker niet gevonden");
  }
  return gebruiker.bin;
}

// Lars: hier wordt een minifig verwijderd + voor testen functie toevoegen om fig toe te voegen

export async function deleteMinifigFromBin(userId: string, figName: string) {
  const db = await connectToMongoDB();
  const result = await db
    .collection("gebruikers")
    .updateOne({ _id: new ObjectId(userId) }, {
      $pull: { bin: { fig: figName } },
    } as any);
  if (result.matchedCount === 0) {
    throw new Error("Gebruiker niet gevonden.");
  }
  if (result.modifiedCount === 0) {
    throw new Error("Minifig niet gevonden in de bin of al verwiijderd.");
  }
}

// Lars: in deze functie kan de reden worden aangepast

export async function updateMinifigReason(
  userId: string,
  figName: string,
  newReason: string
) {
  const db = await connectToMongoDB();
  const result = await db.collection("gebruikers").updateOne(
    {
      _id: new ObjectId(userId),
      "bin.fig": figName,
    },
    {
      $set: { "bin.$.reason": newReason },
    } as any
  );

  if (result.matchedCount === 0) {
    throw new Error("Gebruiker of minifig niet gevonden.");
  }
  if (result.modifiedCount === 0) {
    throw new Error("Geen wijzigingen aangebracht.");
  }
}

// Lars: hier wordt een nieuwe user aangemaakt
export async function insertUserGameData(playerId: string, totalFigs: number) {
  const db = await connectToMongoDB();
  const newUserGameData = createUserGameData(playerId, totalFigs);
  return await db.collection("game_data").insertOne(newUserGameData);
}

// Enrico: hier worden het game data bestand van de user uitgelezen
export async function getGameData(playerId: string) {
  const db = await connectToMongoDB();
  const gameData = await db
    .collection("game_data")
    .find({ playerId: playerId })
    .sort({ createdAt: -1 }) // nieuwste eerst
    .limit(1)
    .toArray();
  return gameData[0];
}

// Enrico: TODO: updateGameData
export async function updateGameDataFromFactory(
  playerId: string,
  figs: any[],
  gameStatus: string
) {
  const db = await connectToMongoDB();
  const latestGameData = await getGameData(playerId);

  if (!latestGameData) {
    throw new Error("Game data niet gevonden voor deze speler.");
  }

  const gameDataId = latestGameData._id;

  const result = await db.collection("game_data").updateOne(
    { _id: gameDataId },
    {
      $set: {
        figs,
        gameStatus,
        totalFigs: figs.length,
      },
    }
  );
  if (result.matchedCount === 0) {
    throw new Error("Game data niet gevonden voor deze speler.");
  }
  return await db.collection("game_data").findOne({ _id: gameDataId });
}

// Gentian: hier wordt een nieuwe user aangemaakt
export async function insertUser(
  uname: string,
  hashedPassword: string,
  email: string,
  profileFig: string
) {
  console.log("insertUser wordt aangeroepen");
  const db = await connectToMongoDB();
  const newUser = createUserTemplate(uname, hashedPassword, email, profileFig);
  console.log(newUser);
  return await db.collection("gebruikers").insertOne(newUser);
}

// Gentian: hier wordt de user gevonden met zijn email of username
export async function findUserByEmailOrUsername(
  email: string,
  username: string
): Promise<User | null> {
  const db = await connectToMongoDB();
  return await db.collection<User>("gebruikers").findOne({
    $or: [{ email }, { username }],
  });
}

// Enrico: update het wachtwoord van een gebruiker op basis van gebruikersnaam
export async function updateUserPassword(
  username: string,
  hashedPassword: string
) {
  const db = await connectToMongoDB();
  const result = await db
    .collection("gebruikers")
    .updateOne({ username }, { $set: { password: hashedPassword } });
  if (result.matchedCount === 0) {
    throw new Error("Gebruiker niet gevonden.");
  }
  if (result.modifiedCount === 0) {
    throw new Error("Wachtwoord niet gewijzigd.");
  }
}

export async function updateGameDataFromOrdenen(
  playerId: string,
  status: string,
  gameStatus: string
) {
  const db = await connectToMongoDB();
  const latestGameData = await getGameData(playerId);

  if (!latestGameData) {
    throw new Error("Game data niet gevonden voor deze speler.");
  }

  const gameDataId = latestGameData._id;

  const pendingFigIndex = latestGameData.figs.findIndex(
    (fig: any) => fig.status === "pending"
  );

  if (pendingFigIndex === -1) {
    throw new Error("Geen pending fig gevonden.");
  }

  const updatedFigs = [...latestGameData.figs];
  updatedFigs[pendingFigIndex] = {
    ...updatedFigs[pendingFigIndex],
    status: status,
  };

  const result = await db.collection("game_data").updateOne(
    { _id: gameDataId },
    {
      $set: {
        figs: updatedFigs,
        gameStatus: gameStatus
      },
    }
  );
  if (result.matchedCount === 0) {
    throw new Error("Game data niet gevonden voor deze speler.");
  }
  return await db.collection("game_data").findOne({ _id: gameDataId });
}

//Abe : chest template

type Minifig = {
  name: string;
  img: string;
  rarity: "gewoon" | "episch" | "legendarisch";
};

async function fetchMinifigs(): Promise<Minifig[]> {
  const res = await fetch("https://supabase-api-q362.onrender.com/minifigs");

  if (!res.ok) {
    throw new Error(`Fout bij ophalen minifigs: ${res.status}`);
  }

  const data: Minifig[] = await res.json();
  return data;
}

function getRandomFigs(source: Minifig[], count: number): Minifig[] {
  const copy = [...source];
  const result: Minifig[] = [];

  while (result.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

async function generateChest(type: "common" | "epic" | "legendary") {
  try {
    await client.connect();
    const db = client.db("LegoLads");
    const chests = db.collection("chests");

    const allFigs = await fetchMinifigs();

    const commons = allFigs.filter(fig => fig.rarity === "gewoon");
    const epics = allFigs.filter(fig => fig.rarity === "episch");
    const legendaries = allFigs.filter(fig => fig.rarity === "legendarisch");

    if (commons.length < 5 || epics.length < 3 || legendaries.length < 1) {
      throw new Error("Niet genoeg fig rarity");
    }

    const chestFigs = [
      ...getRandomFigs(commons, 5),
      ...getRandomFigs(epics, 3),
      ...getRandomFigs(legendaries, 1),
    ];

    await chests.insertOne({
      type,
      figs: chestFigs,
      created_at: new Date(),
    });

    console.log(`✅ Chest (${type}) aangemaakt met 9 figuren`);
  } catch (err) {
    console.error("❌ Fout:", err);
  } finally {
    await client.close();
  }
}

 export async function generatecluster() {
  await generateChest("common");
  await generateChest("epic");
  await generateChest("legendary");
}


