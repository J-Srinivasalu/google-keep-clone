import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_USER = process.env.MONGO_DB_USER ?? "";
const NODE_ENV = process.env.NODE_ENV ?? "";
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD ?? "";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME ?? "";
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@freecodepracproj.hkrmbys.mongodb.net/${MONGO_DB_NAME}`;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URL_LOCAL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@freecodepracproj.hkrmbys.mongodb.net/${MONGO_DB_NAME}`;

const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};

if (NODE_ENV === "online") {
  config.mongo.url = MONGO_URL;
  config.server.port = SERVER_PORT;
} else if (NODE_ENV === "local") {
  config.mongo.url = MONGO_URL_LOCAL;
  config.server.port = SERVER_PORT;
}

export default config;
