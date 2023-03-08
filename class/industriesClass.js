const db = require('../db');
const ExpressError = require('../expressError');
const slugify = require('slugify');

class Industry {
    constructor(id, name) {
        if (!id.trim() || !name.trim()) {
            throw new ExpressError("id and name are required", 400)
        }
        const slug = { remove: /[*+~.()'"!:@]/g, replacement: '_', lower: true, trim: true }
        this.id = slugify(id, slug);
        this.name = name;
    }
    async save() {
        console.log('')
        //make new industry for companis to associate with
    }
    async delete() {
        console.log('')
        //remove industry and associations
    }
    static async getAll() {
        //all industris
        const results = await db.query(`SELECT * FROM industries;`);
        if (results.rows[0]) {
            return results.rows.map(row => {
                row.get = `http://localhost:3000/industries/${row.code}`
                return row;
            });
        } return 'No Industries Found'
    }
    static async getbyCODE(code) {
        const results = await db.query(`SELECT
        industries.code,
        industries.name,
        COUNT(company_industry.company_code) AS company_count,
        ARRAY_AGG(company_industry.company_code) AS company_codes
        FROM industries
        LEFT JOIN company_industry ON industries.code = company_industry.industry_code
        WHERE industries.code = $1
        GROUP BY industries.code`, [code])
        return results.rows
        //all companies associated with industry.id
    }
    static async companyIndustry(company_code, industry_code) {
        //you dont need to check that company/industry is valid. SQL will not allow invalid associations
        const results = await db.query(`INSERT INTO company_industry
        VALUES ($1,$2)
        RETURNING *;`, [company_code, industry_code]);
        if (results.rows[0]) {
            return results.rows[0];
        }
        throw new ExpressError('Error while associating Company with Industry')
    }
}
module.exports = Industry;