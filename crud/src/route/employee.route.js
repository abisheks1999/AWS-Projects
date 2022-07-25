const express = require('express');
const router = express.Router();

const employeeController = require('../controller/employee.controller');

console.log(router);
router.get('/', employeeController.getEmployeeList);
router.get('/:name',employeeController.getEmployeeByID);
router.post('/', employeeController.createNewEmployee);
router.put('/:name', employeeController.updateEmployee);


router.delete('/:name',employeeController.deleteEmployee);
module.exports = router;