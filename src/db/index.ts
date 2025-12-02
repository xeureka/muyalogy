import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });


// lets get done with all the corea features 

// and after that what am gonna do is that

// add the auth using better auth

// then gonna host it on nvercel the wroking thing

// and fix the repo like the readme mnamin

// then send it to the giys beka 
