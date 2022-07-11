const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const axios = require('axios');

module.exports = function (app, db) {

    app.get('/api/test', function (req, res) {
        res.json({
            name: "OwSoto"
        })
    })

}

