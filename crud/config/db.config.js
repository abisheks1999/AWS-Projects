const mysql = require('mysql');

// create here mysql connection

const dbConn = mysql.createConnection({
    host: 'database-1.ca4luohrsgcw.ap-south-1.rds.amazonaws.com',
    port:"3306",
    user: 'admin',
   
    password: 'theabisheks',
    database: 'node',
});

dbConn.connect(function(error){
    if(error) throw error;
    console.log('Database Connected Successfully!!!');
})

module.exports = dbConn;