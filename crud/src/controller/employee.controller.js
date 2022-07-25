const EmployeeModel = require('../model/employee.model');
exports.getEmployeeList = (req, res)=> {
    
    EmployeeModel.getAllEmployees((err, employees) =>{
        
        if(err)
        res.send(err);
        
        res.send(employees)
    })
}

exports.getEmployeeByID = (req, res)=>{
   
    EmployeeModel.getEmployeeByID(req.params.name, (err, employee)=>{
        if(err)
        res.send(err);
       
        res.send(employee);
    })
}

exports.createNewEmployee = (req, res) =>{
    const employeeReqData = new EmployeeModel(req.body);
    console.log('employeeReqData', employeeReqData);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({success: false, message: 'Please fill all fields'});
    }else{
        EmployeeModel.createEmployee(employeeReqData, (err, employee)=>{
            if(err)
            res.send(err);
            res.json({status: true, message: 'Employee Created Successfully', data: employee.insertId})
        })
    }
}
exports.updateEmployee = (req, res)=>{
    const employeeReqData = new EmployeeModel(req.body);
    console.log('employeeReqData update', employeeReqData);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({success: false, message: 'Please fill all fields'});
    }else{
        EmployeeModel.updateEmployee(req.params.name, employeeReqData, (err, employee)=>{
            if(err)
            res.send(err);
            res.json({status: true, message: 'Employee updated Successfully'})
        })
    }
}

// delete employee
exports.deleteEmployee = (req, res)=>{
    EmployeeModel.deleteEmployee(req.params.name, (err, employee)=>{
        if(err)
        res.send(err);
        res.json({success:true, message: 'Employee deleted successully!'});
    })
}