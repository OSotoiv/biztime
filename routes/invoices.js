const { Router } = require('express');
const router = Router();
const Invoice = require('../class/invoiceClass')
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try {
        const results = await Invoice.getAll();
        return res.json({ invoices: results });
    } catch (e) {
        next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const invoice = new Invoice(comp_code, amt);
        const results = await invoice.save();
        return res.status(201).json({ new_invoice: results });
    } catch (e) {
        next(e)
    }
})
// router.get('/:id', async (req,res, next)=>{
//     try{

//     }catch(e){
//         next(e)
//     }
// })
// router.patch('/:id', async (req,res, next)=>{
//     try{

//     }catch(e){
//         next(e)
//     }
// })
// router.delete('/:id', async (req,res, next)=>{
//     try{

//     }catch(e){
//         next(e)
//     }
// })
//this error is for routes that start with /invoices but doesnt match any other part of the request
router.use((req, res, next) => {
    return next(new ExpressError('I dont know that Invoice Route', 404))
})
module.exports = router