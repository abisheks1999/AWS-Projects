var dbConn = require('../../config/db.config');

var Employee = function(employee){
    this.name = employee.name;
    this.phone=employee.phone;
    this.salary = employee.salary;
}
Employee.getAllEmployees = (result) =>{
    dbConn.query('SELECT * FROM employees', (err, res)=>{
        if(err){
            console.log('Error while fetching employess', err);
            result(null,err);
        }else{
            console.log('Employees fetched successfully');
            result(null,res);
        }
    })
}
Employee.getEmployeeByID = (name, result)=>{
    dbConn.query('SELECT * FROM employees WHERE name=?', name, (err, res)=>{
        if(err){
            console.log('Error while fetching employee by name', err);
            result(null, err);
        }else{
            result(null, res);
        }
    })
}

Employee.createEmployee = (employeeReqData, result) =>{
    dbConn.query('INSERT INTO employees SET ? ', employeeReqData, (err, res)=>{
        if(err){
            console.log('Error while inserting data');
            result(null, err);
        }else{
            console.log('Employee created successfully');
            result(null, res)
        }
    })
}
Employee.updateEmployee = (name, employeeReqData, result)=>{
    dbConn.query("UPDATE employees SET name=?,phone=?,salary=? WHERE name = ?", [employeeReqData.name,employeeReqData.phone,employeeReqData.salary, name], (err, res)=>{
        if(err){
            console.log('Error while updating the employee');
            result(null, err);
        }else{
            console.log("Employee updated successfully");
            result(null, res);
        }
    });
}

// delete employee
Employee.deleteEmployee = (name, result)=>{
   
    dbConn.query("DELETE FROM employees  WHERE name = ?",name, (err, res)=>{
        if(err){
            console.log('Error while deleting the employee');
            result(null, err);
        }else{
            console.log("Employee deleted successfully");
            result(null, res);
        }
    });
}


module.exports = Employee;

