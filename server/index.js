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

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 app.use(cors(corsOptions)) // Use this after the variable declaration

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE')
// header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization')

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
    console.log(`App started on port ${'*'}`);
});