const db = require('../db');
const ExpressError = require('../expressError')

class Company {
    constructor(code, name, description) {
        if (!code.trim() || !name.trim() || !description.trim()) {
            throw new ExpressError("code,name,description are required", 400)
        }
        this.code = code;
        this.name = name;
        this.description = description;
    }
    async save() {
        try {
            const results = await db.query(`INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING *`, [this.code, this.name, this.description]);
            if (results) {
                return results.rows[0];
            }
        } catch (e) {
            throw new ExpressError(`${e.detail}`, 400);
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
            return results.rows[0];
        }
        throw new ExpressError(`Error while updating ${this.code}`, 500);
    }
    async delete() {
        const results = await db.query(`DELETE FROM companies WHERE companies.code = $1 RETURNING *`, [this.code]);
        if (results.rows[0]) {
            return results.rows[0];
        }
        throw new ExpressError(`Error While Deleting ${this.code}`, 500)
    }
    static async getAll() {
        const results = await db.query(`SELECT * FROM companies`);
        if (results.rows[0]) {
            return results.rows;
        } else {
            return 'No Companies Found';
        }

    }
    static async getbyCODE(code) {
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        if (results.rows[0]) {
            const { code, name, description } = results.rows[0];
            return new Company(code, name, description);
        }
        throw new ExpressError(`No Company matching ${code}`, 404)
    }
    //ask about how to exit the datbase
    async close() {
        await db.end();
    }
}
module.exports = Company;

