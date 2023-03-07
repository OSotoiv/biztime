const { parse } = require('dotenv');
const { Router } = require('express');
const router = Router();
const Invoice = require('../class/invoiceClass')
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try {//get wides view of invoics grouped by company
        if (req.query.code) {
            return next();
        } else {
            const results = await Invoice.getAll();
            return res.json({ type: "Invoices Grouped by Company", invoices: results });
        }

    } catch (e) {
        next(e);
    }
})

router.get('/', async (req, res, next) => {
    try {//narrow on one companies invoices
        const { code } = req.query;
        const results = await Invoice.getbyCODE(code);
        return res.json({ company: code, invoices: results })
    } catch (e) {
        next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const invoice = await Invoice.validate(comp_code, amt);
        const results = await invoice.save();
        return res.status(201).json({ new_invoice: results });
    } catch (e) {
        next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (parseInt(id) > 0) {
            const results = await Invoice.getbyID(id);
            return res.json({ invoice: results });
        } return next();
    } catch (e) {
        next(e)
    }
})
router.patch('/:id', async (req, res, next) => {
    try {//can only update Invoice.amt
        const { id } = req.params;
        const { amt } = req.body;
        const invoice = await Invoice.getbyID(id);
        const results = await invoice.update(amt);
        return res.json({ updated: results });
    } catch (e) {
        next(e)
    }
})
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (parseInt(id) > 0) {
            const invoice = await Invoice.getbyID(id);
            const results = await invoice.delete();
            return res.json({ deleted: results })
        } return next()
    } catch (e) {
        next(e)
    }
})
//this error is for routes that start with /invoices but doesnt match any other part of the request
router.use((req, res, next) => {
    return next(new ExpressError('I dont know that Invoice Route', 404))
})
module.exports = router