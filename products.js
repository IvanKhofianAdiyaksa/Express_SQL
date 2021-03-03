// importing express
// need to be installed
let express = require('express');
let app = express();

// connecting to database
const db = require('./config/db');
db.connect();

// importing ejs
app.set('view engine', 'ejs');

// reading images
app.use('/assets', express.static('assets'));

// importing file upload
// need to be installed
const upload = require('express-fileupload');
app.use(upload());

// import uniqid library
// need to be installed
const uniqid = require('uniqid');

// importing body-parser
// need to be installed
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// opening cors
// need to be installed
const cors = require('cors');
app.use(cors());

// import unlink file
const fs = require('fs')


// ####################
// Products Object
// ####################

// let products = [];

// --------------------
// Reading product
// --------------------
app.get('/products', function(req, res){
    // testing method works properly
    console.log("it is working");
    let sql = 'SELECT* FROM products';
    db.query(sql, (err, result) => {
        if (err)
        throw err;
        console.log(result);
        res.json({success: true, result})
    })
})

// --------------------
// Reading product by id
// --------------------
app.get('/products/:product_id?', function(req,res){
    // testing method works properly
    console.log("it is working");

    let readId = `SELECT name, price, description, image_filename FROM products WHERE id = ${req.params.product_id}`;
    db.query(readId, (err, result) => {
        if (err)
        throw err;
        console.log(result);
        res.json({success: true, result})
    })
})

// --------------------
// Create products
// --------------------
app.post('/products/new/add', function(req, res){
    // testing method works properly
    console.log("it is working");
    let dataProduct = {
        name: req.body.name,
        price: parseInt(req.body.price),
        description: req.body.description,
    }

    if(req.files){
        // checking file uploaded
        console.log(req.files.image_filename.name);

        let file = req.files.image_filename;
        let extension = file.name.split('.');
        extension = extension[extension.length - 1];
        let filename = `${uniqid()}.${extension}`;

        file.mv(`./assets/images/${filename}`, function(err){
            if (err) console.log(err);
        })

        dataProduct.image_filename = filename;
    }
    // products.push(dataProduct);
    let sql = 'INSERT INTO products SET ?';
    db.query(sql, dataProduct, (err) => {
        if (err) throw err;
        let read = 'SELECT* FROM products';
        db.query(read, (err, result) => {
            if (err) throw err;
            res.json({success: true, result})
        })
    });
})

// --------------------
// Update products
// --------------------
app.patch('/products/update/:product_id', function(req, res){
    // testing method works properly
    console.log("it is working");
    
    let updateProduct = {
        name: req.body.name,
        price: parseInt(req.body.price),
        description: req.body.description,
        }
    let image_filename;
    if(req.files){
        // checking file uploaded
        console.log(req.files);

        let file = req.files.image_filename;
        let extension = file.name.split('.');
        extension = extension[extension.length - 1];
        let filename = `${uniqid()}.${extension}`;

        file.mv(`./assets/images/${filename}`, function(err){
            if (err) console.log(err);
        })

        image_filename = filename;
    }

        let image = `SELECT image_filename FROM products WHERE id = ${req.params.product_id}`;
        db.query(image, (err,result) => {
            if (err) throw err;
            console.log(result[0].image_filename);
            fs.unlinkSync(`./assets/images/${result[0].image_filename}`);
            
            let update = `UPDATE products SET name = '${updateProduct.name}', price = ${updateProduct.price}, description = '${updateProduct.description}', image_filename = '${image_filename}' WHERE id = ${req.params.product_id}`;
            db.query(update, (err) => {
                if (err) throw err;
                let read = 'SELECT* FROM products';
                db.query(read, (err, result) => {
                    if (err) throw err;
                    res.json({success: true, result})
                })
            })
        })
})

// --------------------
// delete products
// --------------------
app.delete('/products/delete/:product_id', function(req, res){
    // testing method works properly
    console.log("it is working");
    
    let image = `SELECT image_filename FROM products WHERE id = ${req.params.product_id}`;
        db.query(image, (err,result) => {
            if (err) throw err;
            console.log(result[0].image_filename);
            fs.unlinkSync(`./assets/images/${result[0].image_filename}`);
            
            let del = `DELETE FROM products WHERE id = ${req.params.product_id}`;
            db.query(del, (err) => {
                if (err) throw err;
                let read = 'SELECT* FROM products';
                db.query(read, (err, result) => {
                    if (err) throw err;
                    res.json({success: true, result})
                })
            })
        })
})

app.listen(3004, () => {
    console.log("server @port 3004");
});