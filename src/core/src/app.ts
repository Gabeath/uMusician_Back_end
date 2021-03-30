import { initializeDatabase } from './database';

export const initializeCore = async() => {
  await initializeDatabase();
};