const PgPromise = require("pg-promise")
const express = require('express');
const cors = require('cors');

require('dotenv').config()

const API = require('./api');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))

app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/noQueue';
const pgp = PgPromise({});

const config = {
    connectionString: DATABASE_URL
};

if (process.env.DATABASE_URL) {
    config.ssl = { rejectUnauthorized: false };
}

const db = pgp(config);

console.log("URL DB:", DATABASE_URL)

API(app, db);

const PORT = process.env.PORT || 5050;
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`);
});