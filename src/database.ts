import { MongoClient, Db, ObjectId } from "mongodb";
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
  email: string
) {
  return {
    username,
    password,
    email,
    profile_fig:
      "https://github.com/AbeVerschueren/lego-img/blob/main/batman.png?raw=true",
    coins: 500,
    earned_coins: 800,
    spent_coins: 300,
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
    ],
    bin: [
      {
        fig: "Pirate",
        reason: "per ongeluk verwijderd",
      },
    ],
    ordenedFigs: [
      {
        fig: "Anakin",
        set: "ambush-on-errix",
        theme: "theme01",
      },
      {
        fig: "Chen",
        set: "the-joker-steam-roller",
        theme: "theme02",
      },
    ],
    achievements: {
      coins: {
        title: "Muntverzamelaar",
        description: "Verzamel munten om beloningen te verdienen.",
        current: 55,
        goal: 100,
        reward: 200,
        finished: false,
        collected: false,
      },
      login_streak: {
        title: "Dagelijkse login",
        description: "Log dagelijks in voor hogere beloningen.",
        current: 1,
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
// Abe: test data word toegevoegd
export async function insertTestUser() {
  const db = await connectToMongoDB();
  const gebruiker = createUserTemplate("abe", "lego", "abe@email.com");
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
  const result = await db
    .collection("gebruikers")
    .updateOne({ _id: new ObjectId(userId) }, { $inc: { coins: addedCoins } });
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

// Lars: hier wordt een minifig verwijderd + voo testen functie toevoegen om fig toe te voegen

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
