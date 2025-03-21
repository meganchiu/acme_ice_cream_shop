const pg = require('pg')
const express = require('express')
const morgan = require('morgan');
const cors = require('cors');

const client = new pg.Client(
  process.env.DATABASE_URL || 
  'postgres://megan.chiu:password@localhost:5432/acme_ice_cream_shop'
);

const app = express();
const port = 3000;

app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    app.listen(port, () => console.log(`listening on port ${port}`));
};

// GET /flavors route
app.get("/flavors", async (req, res) => {
  try {
    const SQL = /* sql */ 
    `SELECT * FROM flavors;`;
    const response = await client.query(SQL);
    console.log('response: ', response);
    res.send(response.rows);
  } catch (error) {
    console.error(error);
  }
});

// GET /flavors/:id route
app.get("/flavors/:id", async (req, res) => {
    const { id } = req.params;
    const SQL = `SELECT * FROM flavors WHERE id = $1;`;
    const response = await client.query(SQL, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Flavor not found" });
    }

    res.json(response.rows[0]);
});


init();
