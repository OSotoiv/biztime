const db = require('../db');
const ExpressError = require('../expressError');
const slugify = require('slugify');

class Company {
    constructor(code, name, description) {
        const slug = { remove: /[*+~.()'"!:@]/g, replacement: '_', lower: true, trim: true }
        if (!code.trim() || !name.trim() || !description.trim()) {
            throw new ExpressError("code,name,description are required", 400)
        }
        this.code = slugify(code, slug);
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
    async update(name, description) {
        name = name.trim() ? name : this.name;
        description = description.trim() ? description : this.description;
        if (name === this.name && description === this.description) {
            return "Company code cannot be updated. only name and description";
        }
        const results = await db.query(`UPDATE companies SET 
            name = $1,
            description = $2
            WHERE companies.code = $3 RETURNING *;`,
            [name, description, this.code]);
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
        const companies = db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        const invoices = db.query(`SELECT * FROM invoices WHERE comp_code = $1`, [code]);
        const res = await Promise.all([companies, invoices]);
        if (res[0].rows[0]) {
            const { code, name, description } = res[0].rows[0];
            const COMP = new Company(code, name, description);
            COMP.invoices = res[1].rows.map(invoice => {
                invoice.get = `http://localhost:3000/invoices/${invoice.id}`;
                return invoice;
            })
            return COMP;
        }
        throw new ExpressError(`No Company matching ${code}`, 404)
    }
    //ask about how to exit the datbase
    async close() {
        await db.end();
    }
}
module.exports = Company;

