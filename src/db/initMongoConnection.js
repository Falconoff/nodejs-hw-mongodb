import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    // const user = process.env.MONGODB_USER;
    // const password = process.env.MONGODB_PASSWORD;
    // const url = process.env.MONGODB_URL;
    // const db = process.env.MONGODB_DB;
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log(`Error connection Mongo ${error.message}`);
    throw error;
  }
};
