const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

const API = require('../server/api');
const { default: axios } = require('axios');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/travis_ci_test';
const pgp = PgPromise({});
const db = pgp(DATABASE_URL);

API(app, db);

describe('Q-Not API', function () {

    // before(async function () {
    // 	this.timeout(5000);
    // 	await db.none(`delete from users`);
    // 	const commandText = fs.readFileSync(`./sql/users.sql`, 'utf-8');
    // 	await db.none(commandText)
    // });

    // before(async function () {
    // 	this.timeout(5000);
    // 	await db.none(`delete from users`);
    // 	const commandText = fs.readFileSync(`./sql/appointments.sql`, 'utf-8');
    // 	await db.none(commandText)
    // });

    it('should have a test method', async () => {

		const response = await supertest(app)
			.get('/api/test')
			.expect(200);

		assert.deepStrictEqual({ name: 'OwSoto' }, response.body);

	});

    it('should be able to register a new user', async () => {

        await supertest(app).post('/api/signup')
        .send({
            fullname: 'Soki Soto',
            username: 'Soki',
            password: 'soki123',
            role: 'Patient',
            id_number: '0000876567876',
            contact_number: '0723454321'
        });

    	assert.deepStrictEqual({ fullname: fullname, username: username, password: password, role: role, id_number: id_number, contact_number: contact_number }, response.body);

    });

    it('should be able to login registered users', async () => {

        await supertest(app).post('/api/login')
        .send({
            username: 'Soki',
            password: 'soki123'
        });

    	assert.deepStrictEqual({ username: username, password: password }, response.body);

    });

    it('should be able to find all registered users', async () => {
        const response = await supertest(app)
            .get('/api/users')
            .expect(200);

        const users = response.body.data;
        assert.equal(1, users.length);

    })


    after(() => {
        db.$pool.end();
    });
});