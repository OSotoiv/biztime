const { Router } = require('express');
const router = Router();
// const db = require('../db');
const Company = require('../class/companiesClass')
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try {
        const results = await Company.getAll();
        return res.json({ companies: results });
    } catch (e) {
        next(e)
    }
});


router.get('/:code', async (req, res, next) => {
    try {//is this ok to rely on the Company Class to be sent as json?
        const { code } = req.params;
        const results = await Company.getbyCODE(code);
        return res.json({ company: results });
        //does a rejected promis trigure an error?
    } catch (e) {
        next(e);
    }
});


router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const comp = new Company(code, name, description);
        const results = await comp.save();
        return res.status(201).json({ new_company: results });
    } catch (e) {
        next(e);
    }
});


router.patch('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name = "", description = "" } = req.body;
        const comp = await Company.getbyCODE(code);
        const results = await comp.update(name, description);
        return res.json({ updated: results });
    } catch (e) {
        next(e);
    }
});


router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const comp = await Company.getbyCODE(code);
        const results = await comp.delete();
        return res.json({ deleted: results });
    } catch (e) {
        next(e)
    }
});
//this error is for routes that start with /companies but doesnt match any other part of the request
router.use((req, res, next) => {
    return next(new ExpressError('I dont know that Company', 404))
})

module.exports = router