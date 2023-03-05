const { Router } = require('express');
const router = Router();
const db = require('../db');
const Company = require('../class/companiesCLS')


router.get('/', async (req, res, next) => {
    const results = await Company.getAll();
    return res.json(results);
});
router.get('/:code', async (req, res, next) => {
    const { code } = req.params;
    const results = await Company.getbyCODE(code);
    return res.json({ company: results });
});
router.post('/', async (req, res, next) => {
    const { code, name, description } = req.body;
    const comp = new Company(code, name, description);
    const results = await comp.save();
    return res.json(results);
});
router.patch('/:code', async (req, res, next) => {
    const { code: o_code } = req.params;
    const { code, name, description } = req.body;
    const comp = await Company.getbyCODE(o_code);
    const results = await comp.update(code, name, description);
    return res.json(results);
})
router.delete('/:code', async (req, res, next) => {
    const { code } = req.params;
    const results = await db.query(`DELETE FROM companies WHERE companies.code = $1 RETURNING *`, [code]);
    return res.json({ deleted: results.rows[0] });
})

module.exports = router