import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
import { uri } from "./database";
import { User } from "./interfaces";

const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: uri,
    collection: "sessions",
    databaseName: "LegoLads",
});

declare module 'express-session' {
    export interface SessionData {
        user?: User;
    }
}

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});

export default sessionMiddleware;