const express = require('express');
const bodyParser = require('body-parser');

const aws =require('aws-sdk');
const employeeController = require('../crud/src/controller/employee.controller');

const app = express();

const port = process.env.PORT || 5000;
app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.listen(port, ()=>{
    console.log(`Express is running at port ${port}`);
});


app.use(bodyParser.json());
//exports.handler = async function(event) {
    app.get('/', employeeController.getEmployeeList);
    //return rsponse;
//}