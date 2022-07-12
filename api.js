const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const axios = require('axios');

module.exports = function (app, db) {

    app.get('/api/test', function (req, res) {
        res.json({
            name: "OwSoto"
        })
    })

    app.post('/api/signup', async function (req, res) {
        try {
            const { fullname, username, password, card_number } = req.body;

            console.log({ fullname, username, password, card_number });

            console.log({ username });

            if (username == null) {
                throw new Error("Username should be entered")
            }

            if (password == null) {
                throw new Error("Password should be entered")
            }

            var newUser = await db.oneOrNone("SELECT * FROM patients WHERE username = $1", [username])

            if (newUser !== null) {
                throw new Error('User already exist!')
            }

            const encrypted = await bcrypt.hash(password, 10)

            await db.none(`INSERT INTO patients (fullname, username, password, card_number) VALUES ($1, $2, $3, $4)`, [fullname, username, encrypted, card_number]);
            res.status(200).json({
                message: 'New user successfully registered'
            })

        } catch (e) {
            console.log(e.message)
            res.status(500).json({
                message: e.message
            })
        }
    })


    app.post('/api/login', async function (req, res) {
        try {
            const { username, password } = req.body;

            const user = await db.oneOrNone(`SELECT * FROM patients WHERE username = $1`, [username]);

            if (!user) {
                throw Error('User does not exist! Register new account')
            } else {
                let isValidUser = await bcrypt.compare(password, user.password)
                if (!isValidUser) {
                    throw Error('Wrong password or username')
                }
                jwt.sign({ user }, 'secret', { expiresIn: '24h' }, (err, token) => {
                    return res.json({
                        success: true,
                        access_token: token,
                        user: user
                    });
                })
            }

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                message: error.message
            })
        }
    })

}

