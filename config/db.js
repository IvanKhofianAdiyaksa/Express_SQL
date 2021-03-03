const mysql = require('mysql');
const db = mysql.createConnection({  
    host : 'localhost',
    user : 'root',
    password : 'usbw',
    database : 'toko',
    port: 3307
});

module.exports = db;

