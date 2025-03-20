const pg = require('pg')
const express = require('express')

const client = new pg.Client(
  process.env.DATABASE_URL || 
  'postgres://megan.chiu:password@localhost:5432/acme_ice_cream_shop'
);
const app = express();

const init = async () => {
  await client.connect();
    console.log('Connected to database.');

    const createTableSQL = `
      DROP TABLE IF EXISTS flavors;
      CREATE TABLE flavors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `;

    await client.query(createTableSQL);
    console.log('Table created.');

    const seedSQL = `
      INSERT INTO flavors (name, is_favorite) VALUES
      ('Vanilla', TRUE),
      ('Chocolate', TRUE),
      ('Strawberry', FALSE),
      ('Mint Chocolate Chip', TRUE),
      ('Cookies and Cream', TRUE),
      ('Rocky Road', FALSE),
      ('Pistachio', FALSE),
      ('Mango', FALSE);
    `;

    await client.query(seedSQL);
    console.log('Data seeded.');
};

init();
