const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

module.exports = function (app, db) {

    app.get('/api/test', function (req, res) {
        res.json({
            name: "OwSoto"
        })
    })

    app.post('/api/signup', async function (req, res) {
        try {
            const { fullname, username, password, role, id_number, contact_number } = req.body

            console.log({ fullname, username, password, role, id_number, contact_number })

            console.log({ username });

            if (username == null) {
                throw new Error("Username should be entered")
            }

            if (password == null) {
                throw new Error("Password should be entered")
            }

            var newUser = await db.oneOrNone("SELECT * FROM users WHERE username = $1", [username])

            if (newUser !== null) {
                throw new Error('User already exist!')
            }

            const encrypted = await bcrypt.hash(password, 10)

            await db.none(`INSERT INTO users (fullname, username, password, role, id_number, contact_number) VALUES ($1, $2, $3, $4, $5, $6)`, [fullname, username, encrypted, role, id_number, contact_number]);
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

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username]);
            console.log(user)

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
                        user: user,
                        message: 'Login successfull'
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

    // here 

    function verifyToken(req, res, next) {
        const bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.key = bearerToken;
            jwt.verify(req.key, "secretkey", (err, token) => {
                alert(token)
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.json({
                        post: "Post created...",
                        authData,
                        token
                    });
                }
            });
            next();
        } else {
            res.sendStatus(403);
        }
    }
    // end 

    app.post('/api/book/:bookByDay', async function (req, res) {
        try {
            const { username } = req.body;
            console.log({ username })

            const { bookByDay } = req.params;
            console.log(bookByDay)

            const description = req.body;
            console.log(description)

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username])
            console.log({ user })
            if (!user) {
                throw Error('No user')
            } else {

                await db.none(`INSERT INTO appointments (slot, users_id, description) VALUES ($1, $2, $3)`, [bookByDay, user.id, description.appoReason])

                res.status(200).json({
                    message: 'A booking has been made',
                    user
                })
            }

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })

    app.get('/api/booking/:username', async function (req, res) {
        try {

            const { username } = req.params

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username])

            if (!user) {
                console.log('No user here')
            }

            const bookingByIds = await db.manyOrNone(`SELECT * FROM appointments WHERE users_id = $1`, [user.id]);
            console.log(bookingByIds)

            res.json({
                user: user,
                data: bookingByIds,
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                error: e.message
            })
        }
    })

    app.delete('/api/cancel/:id', async function (req, res) {

        try {
            const { id } = req.params;
            await db.none(`DELETE FROM appointments WHERE id = $1`, [id])

            res.json({
                status: 'Appointment Cancelled',
            })
        } catch (err) {
            console.log(err)
            res.json({
                status: 'Failed to cancel appointment',
                error: err.stack
            })
        }
    })

    // sun 

    app.post('/api/reschedule/:id', async function (req, res) {
        try {
            const { id } = req.params;

            await db.none(`UPDATE appointments SET slot = slot + 1 WHERE id = $1`, [id])

            res.status(200).json({
                message: 'Successful',
            })

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })
    // sun end 

    // Anele 

    app.get('/api/booking', async function (req, res) {
        try {

            const bookingBy = await db.manyOrNone(`SELECT appointments.id as id, slot, role, users_id, id_number, confirmed, description, fullname, username FROM appointments join users on appointments.users_id = users.id`);

            res.json({
                data: bookingBy,
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                error: e.message
            })
        }
    })

    app.post('/api/confirm/:id', async function (req, res) {
        try {

            const { id } = req.params;

            await db.none(`UPDATE appointments SET confirmed = confirmed WHERE id = $1`, [id])

            res.status(200).json({
                message: 'Successful',
            })

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })

    app.get('/api/list', async function (req, res) {
        try {
            const bookingBy = await db.manyOrNone(`SELECT appointments.id as id, slot, role, users_id, confirmed, description, fullname, id_number, username FROM appointments join users on appointments.users_id = users.id WHERE confirmed = true`);

            res.json({
                data: bookingBy,
            })

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })

    app.delete('/api/remove/:id', async function (req, res) {

        try {
            const { id } = req.params;
            await db.none(`DELETE FROM appointments WHERE id = $1`, [id])

            res.json({
                status: 'Appointment Cancelled',
            })
        } catch (err) {
            console.log(err)
            res.json({
                status: 'Failed to cancel appointment',
                error: err.stack
            })
        }
    })

    // scheduler 

    app.get('/api/schedule', async function (req, res) {

        try {
            const schedule = await db.manyOrNone(`SELECT * FROM events`);
            // console.log({ schedule })
            res.json({
                data: schedule
            })

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })

    app.post('/api/event/:id', async function (req, res) {
        try {
            const { id } = req.params;

            await db.none(`INSERT INTO events (event_id) VALUES ($1)`, [id])

            res.status(200).json({
                message: 'An event has been created!',
                user
            })

        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })

}

