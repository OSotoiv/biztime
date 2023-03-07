const db = require('../db');
const ExpressError = require('../expressError')

class Invoice {
    constructor(comp_code, amt, paid, add_date, paid_date, id) {
        // CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
        this.comp_code = comp_code;
        this.amt = amt;
        this.paid = paid || false;
        this.add_date = add_date || new Date();
        this.paid_date = paid_date || null;
        this.id = id || null
    }
    async save() {
        try {
            const results = await db.query(`INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING *`, [this.comp_code, this.amt]);
            if (results) {
                return results.rows[0];
            }
        } catch (e) {
            throw new ExpressError(`${e.detail}`, 400);
        }
    }
    async update(amt) {
        const results = await db.query(`UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING *;`, [parseFloat(amt), this.id]);
        if (results.rows[0]) {
            return results.rows[0];
        }
        throw new ExpressError(`Error while updating Invoice ${this.id}`, 500);
    }
    async delete() {
        const results = await db.query(`DELETE FROM invoices WHERE invoices.id = $1 RETURNING *`, [this.id]);
        if (results.rows[0]) {
            return results.rows[0];
        }
        throw new ExpressError(`Error While Deleting ${this.code}`, 500)
    }
    static async getbyCODE(code) {
        //get all invoices for a company by company.code http://localhost:3000/invoices?comp_code=apple
        const results = await db.query(`SELECT * FROM invoices WHERE invoices.comp_code = $1`, [code]);
        if (results.rows[0]) {
            return results.rows;
        }
        return `No Invoices found for ${code}`
    }
    static async getbyID(id) {
        //get a single invoice by invoice.id
        const results = await db.query(`SELECT * FROM invoices WHERE invoices.id = $1`, [id]);
        if (results.rows[0]) {
            const { comp_code, amt, paid, add_date, paid_date } = results.rows[0];
            return new Invoice(comp_code, amt, paid, add_date, paid_date, id);
        }
        throw new ExpressError(`No Invoices found for ID of ${id}`, 400)
    }

    static async getAll() {
        //widest view of all invoices for all companies
        const results = await db.query(`SELECT
        companies.code,
        companies.name,
        COUNT(DISTINCT CASE WHEN invoices.paid = false THEN invoices.id END) AS unpaid_invoices_count,
        SUM(CASE WHEN invoices.paid = false THEN invoices.amt END) AS unpaid_invoices_total,
        ARRAY_AGG(DISTINCT CASE WHEN invoices.paid = false THEN invoices.id END) AS unpaid_invoice_ids,
        COUNT(DISTINCT CASE WHEN invoices.paid = true THEN invoices.id END) AS paid_invoices_count,
        SUM(CASE WHEN invoices.paid = true THEN invoices.amt END) AS paid_invoices_total,
        ARRAY_AGG(DISTINCT CASE WHEN invoices.paid = true THEN invoices.id END) AS paid_invoice_ids
        FROM companies
        LEFT JOIN invoices ON invoices.comp_code = companies.code
        GROUP BY companies.code;
      `);
        if (results.rows[0]) {
            return results.rows;
        } else {
            return 'No Invoices Found';
        }
    }
    static async validate(comp_code, amt, paid, add_date, paid_date, id) {
        if (!comp_code.trim() || !parseFloat(amt)) {
            throw new ExpressError('Company code and Invoice amount are required', 400)
        }
        const res = await db.query(`SELECT name FROM companies WHERE code = $1;`, [comp_code])
        if (res.rows[0]) {
            return new Invoice(comp_code, amt, paid, add_date, paid_date, id)
        }
        throw new ExpressError('Please provide a valid Company Code', 400)
    }
}

module.exports = Invoice


