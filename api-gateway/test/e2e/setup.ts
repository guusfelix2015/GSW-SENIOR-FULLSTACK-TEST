import * as dotenv from 'dotenv';

dotenv.config();


export async function startApp() {
  return {
    getHttpServer: () => 'http://localhost:3000',
  };
}

export async function stopApp() {
  // App is already running, don't stop it
}

export function getApp() {
  return {
    getHttpServer: () => 'http://localhost:3000',
  };
}

