// export interface Achievement {

import { ObjectId } from "mongodb";

// }

export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
  email: string;
  profile_fig: string;
  coins: number;
  earned_coins: number;
  spent_coins: number;
  figs: {
    name: string;
    img: string;
    rarity: string;
  }[];
  bin: {
    fig: string;
    reason: string;
  }[];
  ordenedFigs: {
    fig: string;
    set: string;
    theme: string;
  }[];
  achievements: {
    coins: {
      title: string;
      description: string;
      current: number;
      goal: number;
      reward: number;
      finished: boolean;
      collected: boolean;
    };
    login_streak: {
      title: string;
      description: string;
      current: number;
      goal: number;
      reward: number;
      finished: boolean;
      collected: boolean;
    };
  };
  chests: {
    uncommon: number;
    epic: number;
    legendary: number;
  };
  keys: number;
  clickerGame: {
    blocks: number;
    tools: {
      hammer: {
        level: number;
      };
      saw: {
        level: number;
      };
      drill: {
        level: number;
      };
    };
  };
  settings: {
    sound: boolean;
    music: boolean;
    filter: string;
    language: string;
    brightness: number;
  };
}

export interface Minifig {
  id: number;
  name: string;
  rarity: string;
  img: string;
  set?: number | null;
}

export interface binElement {
  fig: string;
  reason: string;
}

export interface TempUser {
  uname: string;
  email: string;
  password: string;
  profile_fig: string;
  code: string;
}
