import mongoose from "mongoose";
import { Config } from "./types";
import logger from "../../utils/logger";

const dbConfig: Config = {
  development: {
    url: process.env.MONGODB_URL as string,
  },
  test: {
    url: process.env.MONGODB_TEST_URL as string,
  },
  production: {
    url: process.env.MONGODB_PROD_URL as string,
  },
};

const environment: keyof Config =
  (process.env.NODE_ENV as keyof Config) || "development";
const config = dbConfig[environment];

async function connectDb(): Promise<void> {
  try {
    logger.info(`Current environment ::: ${environment}`);
    const connectedInstance = await mongoose.connect(config.url);
    logger.info(
      `MongoDB connected ::: DB HOST ::: ${connectedInstance.connection.host}`
    );
  } catch (error) {
    logger.error("Error while connecting to MongoDB ::: ", error);
    process.exit(1);
  }
}

// shutdown handling
async function disconnectDb(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB connection closed.");
  } catch (error) {
    logger.error("Error while disconnecting MongoDB ::: ", error);
  }
}

// termination signals
process.on("SIGINT", async () => {
  logger.warn("Received SIGINT. Closing MongoDB connection...");
  await disconnectDb();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.warn("Received SIGTERM. Closing MongoDB connection...");
  await disconnectDb();
  process.exit(0);
});

export default connectDb; 
