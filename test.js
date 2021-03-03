const express = require('express');
const app = express();
const db = require('./config/db');

db.connect();

// importing body-parser
// need to be installed
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// opening cors
// need to be installed
const cors = require('cors');
app.use(cors());

// bisa dipanggil lewat browser atau postman
app.get('/data', function (req, res) {
    var sql = 'SELECT * FROM karyawan';
    db.query(sql, (err, result) => {
        if (err) 
            throw err;
        


        console.log(result);
        res.send(result);
    });
});

// jika kondisinya ada requirement (?)
app.get('/data', function (req, res) {
    var sql = 'SELECT * FROM karyawan';
    if (req.query.no) 
        sql += ` WHERE No = ${
            re.query.no
        }`
    
    db.query(sql, (err, result) => {
        if (err) 
            throw err;
        


        console.log(result);
        res.send(result);
    });
});

// select berdasarkan parameter
app.get('/data/:id', function (req, res) {

    var sql = `SELECT * FROM karyawan WHERE nama =  '${
        req.params.id
    }'`;

    db.query(sql, (err, result) => {
        if (err) 
            throw err;
        

        console.log(result);
        res.send(result);
    });
});

// input data menggunakan form, untuk inser update delete tidak perlu menggunakan result dibagian arrow function
app.post('/input', function (req, res) {
    var data = {
        nama: req.body.nama,
        usia: req.body.usia
    };
    var sql = 'INSERT INTO karyawan SET ?';
    db.query(sql, data, (err, result) => {
        if (err) 
            throw err;
        
        console.log(result);
        res.send('Data sukses diinput!')
    });
});


app.listen(3000, () => {
    console.log('Server @port 3000')
});
