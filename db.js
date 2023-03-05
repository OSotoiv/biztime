/** Database setup for BizTime. */
require('dotenv').config();
const { Client } = require("pg");

let DB_URI = {
    user: process.env.DB_USER,
    host: 'localhost',
    database: '',
    password: process.env.DB_PASSWORD
}

if (process.env.NODE_ENV === "test") {
    DB_URI.database = "biztime_test";
} else {
    DB_URI.database = "biztime";
}

let db = new Client(DB_URI);

db.connect();

module.exports = db;

