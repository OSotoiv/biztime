process.env.NODE_ENV = "test"
const db = require('../db');
const Company = require('../class/companiesClass')
const ExpressError = require('../expressError');
const request = require("supertest")

test('none yet', async () => {
    expect(1).toEqual(1);
    await db.end();
})