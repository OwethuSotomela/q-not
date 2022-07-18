const PgPromise = require("pg-promise")
const express = require('express');
const cors = require('cors');

require('dotenv').config()

const API = require('./api');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))

// const cors = require('cors');
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://q-not-360-degrees.herokuapp.com/");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
// app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://owethusotomela:owethusotomela@localhost:5432/noQueue';
const pgp = PgPromise({});

const config = {
    connectionString: DATABASE_URL
};

if (process.env.DATABASE_URL) {
    config.ssl = { rejectUnauthorized: false };
}

const db = pgp(config);

API(app, db);

const PORT = process.env.PORT || 5050;
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`);
});;