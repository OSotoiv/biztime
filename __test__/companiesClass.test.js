process.env.NODE_ENV = "test"
const Company = require('../class/companiesClass')
const ExpressError = require('../expressError');
const db = require('../db');
// NOTE: These test only check the response from the Company Class.
// They do not test what is actually in the database. 
// I can add that feature later. For new I need to move on to the next section. 
describe('Company class instance methods', () => {
    let comp_code = "ccmc";
    let comp_name = "Cook Children's Medical Center"
    let comp_description = "Childrens Hospital"
    test('crate new Company(code,name,description) instance', () => {
        const COMP = new Company(comp_code, comp_name, comp_description);
        expect(COMP).toBeInstanceOf(Company);
        expect(COMP.code).toEqual(comp_code);
        expect(COMP.name).toEqual(comp_name);
        expect(COMP.description).toEqual(comp_description);
    })
    test('Error when Company missing code || name || description', () => {
        expect(() => {
            new Company("", "", "");
        }).toThrow(expect.any(ExpressError))
    })
    test('Company.save()', async () => {
        const COMP = new Company(comp_code, comp_name, comp_description);
        res = await COMP.save();
        expect(res).toEqual({ code: comp_code, name: comp_name, description: comp_description })
    })
    test('Company.update()', async () => {
        const new_name = "Cook Children's Hospital";
        const COMP = await Company.getbyCODE(comp_code);
        const res = await COMP.update("", new_name, "");
        //should default to original properties when not provided.
        expect(res).toEqual({ code: comp_code, name: new_name, description: comp_description });
    })
    test('Company.delete()', async () => {
        const COMP = await Company.getbyCODE(comp_code);
        const res = await COMP.delete();
        expect(res).toEqual({ code: comp_code, name: expect.any(String), description: comp_description })
    })
    afterAll(async () => {
        try {
            await db.query(`DELETE FROM companies WHERE companies.code = $1 RETURNING *`, [comp_code])
        } catch (e) {
            console.log('error')
            await db.end()
        }
        //ERROR: Jest has detected the following 1 open handle potentially keeping Jest from exiting:
        //RUN: jest --detectOpenHandles __test__/companiesClass
        await db.end();
    })
})

