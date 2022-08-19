const PgPromise = require("pg-promise")
const express = require('express');
const cors = require('cors');

require('dotenv').config()

const API = require('./api');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));

const corsConfig = {
    credentials: true,
    origin: true,
};
 app.use(cors(corsConfig)) // Use this after the variable declaration

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE')
// header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization')

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://owethusotomela.github.io');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
});