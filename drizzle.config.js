const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts', 
  out: './drizzle',
  dbCredentials: {
    url: 'postgresql://postgres:fatroot@127.0.0.1:5432/Reseau_db',
  },
});