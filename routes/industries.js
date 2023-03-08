const { Router } = require('express');
const router = Router();
const Industry = require('../class/industriesClass')
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try {//get all industires
        const results = await Industry.getAll();
        return res.json({ industries: results });
    } catch (e) {
        next(e)
    }
});
router.get('/:code', async (req, res, next) => {
    try {//get industires by id and show all [companies.codes]
        const { code } = req.params;
        const results = await Industry.getbyCODE(code);
        res.json({ industry: results });
    } catch (e) {
        next(e)
    }
});

// router.post('/', (req, res, next) => {
//     try {
//         //make new industry
//     } catch (e) {
//         next(e)
//     }
// });
router.post('/company_industry', async (req, res, next) => {
    try {
        //associate industry with company
        const { company_code, industry_code } = req.body;
        const results = await Industry.companyIndustry(company_code, industry_code);
        res.json({ association: results });
    } catch (e) {
        next(e)
    }
});
// router.delete('/', (req, res, next) => {
//     //remove association
// })

//this error is for routes that start with /industries but doesnt match any other part of the request
router.use((req, res, next) => {
    return next(new ExpressError('I dont know that Industry', 404))
})

module.exports = router