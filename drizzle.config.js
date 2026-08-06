require('dotenv').config({ path: '.env.local' }); // Force la lecture du fichier .env.local
const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts', 
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL, // 👈 Lit l'URL Neon depuis .env.local
  },
});