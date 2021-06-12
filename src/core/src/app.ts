import { initializeDatabase } from './database';

export const initializeCore = async(): Promise<void> => {
  await initializeDatabase();
};