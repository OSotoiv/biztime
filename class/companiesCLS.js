const db = require('../db');

class Company {
    constructor(code, name, description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }
    async save() {
        const results = await db.query(`INSERT INTO companies (code, name, description)
        VALUES ($1, $2, $3)
        RETURNING *`, [this.code, this.name, this.description]);
        if (results.rows[0]) {
            return { created: results.rows[0] }
        } else {
            return { error: "Error Saving User" }
        }
    }
    async update(code, name, description) {
        code = code.trim() ? code : this.code;
        name = name.trim() ? name : this.name;
        description = description.trim() ? description : this.description;
        const results = await db.query(`UPDATE companies SET 
            code = $1,
            name = $2,
            description = $3
            WHERE companies.code = $4 RETURNING *;`,
            [code, name, description, this.code]);
        if (results.rows[0]) {
            return { updated: results.rows[0] }
        } else {
            return { error: `Error while updating ${this.code}` }
        }
    }
    static async getAll() {
        const results = await db.query(`SELECT * FROM companies`);
        if (results.rows[0]) {
            return { companies: results.rows };
        } else {
            return { error: 'No Companies Found' }
        }

    }
    static async getbyCODE(code) {
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if (results.rows[0]) {
            const { code, name, description } = results.rows[0];
            return new Company(code, name, description);
        } else {
            return { error: `No Company matching ${code}` }
        }
    }
}
module.exports = Company;

