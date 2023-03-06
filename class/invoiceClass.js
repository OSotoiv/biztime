const db = require('../db');
const ExpressError = require('../expressError')

class Invoice {
    constructor(comp_code, amt) {
        // CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
        this.comp_code = comp_code;
        this.amt = amt;
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
    // async update()
    // async delete()
    static async getbyCODE() {
        //get all invoices for a company by company.code http://localhost:3000/invoices?comp_code=apple
        const results = await db.query(``)
    }
    static async getbyID() {
        //get a single invoice by id
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
}

module.exports = Invoice


