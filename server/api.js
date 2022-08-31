const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

module.exports = function (app, db) {

    app.get('/api/test', function (req, res) {
        res.json({
            name: "OwSoto"
        })
    })

    // All (Patient & Admin) 

    app.post('/api/register', async function (req, res) {
        try {
            const { fullname, username, password, role, id_number, contact_number } = req.body

            if (await username == null) {
                throw new Error("Username should be entered")
            }

            if (await password == null) {
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

    function convert(str) {
        var date = new Date(str)
            mnth = ("0" + (date.getMonth() + 1)).slice(-2)
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    // end 

    // Cindy (Patient) 

    app.post('/api/book/:bookByDay', async function (req, res) {
        try {
            const { username } = req.body;

            const { bookByDay } = req.params;
            console.log("bookByDay", bookByDay)

            const description = req.body;

            const user = await db.oneOrNone(`SELECT * FROM users WHERE username = $1`, [username])

            if (!user) {
                throw Error('No user')
            } else {
                const existAppointment = await db.manyOrNone(`SELECT * FROM appointments`)
                console.log("existAppointment", existAppointment)

                for (let item of existAppointment) {
                    if (item["slot"] == bookByDay && item["status"] == "Approved" && item["description"] == description.appoReason) {
                        throw Error('Appointment with the time picked already exists! Please book another slot')
                    }
                }


                await db.none(`INSERT INTO appointments (slot, users_id, description) VALUES ($1, $2, $3)`, [bookByDay, user.id, description.appoReason])

                console.log(slot)
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

    // Anele (Admin)

    app.get('/api/booking', async function (req, res) {
        try {

            const bookingBy = await db.manyOrNone(`SELECT appointments.id as id, slot, role, users_id, id_number, status, description, fullname, username FROM appointments join users on appointments.users_id = users.id`);

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

            await db.none(`UPDATE appointments SET status = 'Approved' WHERE id = $1`, [id])

            const currentUpdate = await db.manyOrNone(`SELECT * FROM appointments WHERE id = $1`, [id])
            console.log("currentUpdate", currentUpdate)

            for (let item of currentUpdate) {
                await db.none(`UPDATE appointments SET status = 'Rejected' WHERE slot = $1 AND status = 'Pending...' AND description= $2`, [item["slot"], item["description"]])
            }

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

    app.post('/api/cancels/:id', async function (req, res) {
        try {

            const { id } = req.params;

            await db.none(`UPDATE appointments SET status = 'Cancelled' WHERE id = $1 AND status = 'Approved'`, [id])

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
            const bookingBy = await db.manyOrNone(`SELECT appointments.id as id, slot, role, users_id, status, description, fullname, id_number, username FROM appointments join users on appointments.users_id = users.id WHERE status = 'Approved'`);

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

    app.get('/api/to/:to/from/:from', async function (req, res) {
        try {
            var newData = [];
            const { from, to } = req.params;
            if (to == null && from == null) {
                throw Error('To or From Date not provided')
            } else {
                const schedule = await db.manyOrNone(`SELECT appointments.id as id, slot, role, users_id, status, description, fullname, id_number, username FROM appointments join users on appointments.users_id = users.id`);
                console.log(schedule)
                for (var i = 0; i <= schedule.length; i++) {
                    var mySchedule = schedule[i];
                    if (new Date(convert(2)))
                        console.log(mySchedule)
                    console.log(newData)
                }
                res.json({
                    data: schedule
                })
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                error: error.message
            })
        }
    })

    app.get('/api/week', async function (req, res) {
        try {

            const weekBookings = await db.manyOrNone(`SELECT * FROM appointments`);
            console.log("weekBookings", weekBookings)
            var newweekBookings = []
            for (let item of weekBookings) {
                let slot = convert(item["slot"])
                let today = convert(new Date())
                console.log("iteam", slot);
                console.log("Now date:     ", today);
                if(slot == today){
                    console.log(true)
                    newweekBookings.push(item)
                }
            }
            res.json({
                data: newweekBookings,
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                error: e.message
            })
        }
    })
}