// importing express
// need to be installed
let express = require('express');
let app = express();

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

let products = [];

// --------------------
// Reading product
// --------------------
app.get('/products', function(req, res){
    // testing method works properly
    console.log("it is working");

    res.json({products})
})

// --------------------
// Reading product by id
// --------------------
app.get('/products/:product_id', function(req,res){
    // testing method works properly
    console.log("it is working");

    let productById = {};

    for (var i = 0; i < products.length; i ++){
        if (products[i].id == req.params.product_id) productById = products[i]
    }

    res.json({productById})
})

// --------------------
// Create products
// --------------------
app.post('/products/new/add', function(req, res){
    // testing method works properly
    console.log("it is working");
    let productId;
    if (products.length > 0) productId = products[products.length - 1].id + 1;
    else productId = 1;

    let dataProduct = {
        id: productId,
        name: req.body.name,
        price: parseInt(req.body.price),
        description: req.body.description
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

    products.push(dataProduct);

    res.json({success: true, products});
})

// --------------------
// Update products
// --------------------
app.patch('/products/update/:product_id', function(req, res){
    // testing method works properly
    console.log("it is working");
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

    for (var i = 0; i < products.length; i++){
        if (products[i].id == req.params.product_id){
            products[i].name = req.body.name;
            products[i].price = req.body.price;
            products[i].description = req.body.description;
            if(image_filename) {
                fs.unlinkSync(`./assets/images/${products[i].image_filename}`);
                products[i].image_filename = image_filename
            }
            
            res.json({
                success: true,
                products})
        }
    }
})

// --------------------
// delete products
// --------------------
app.delete('/products/delete/:product_id', function(req, res){
    // testing method works properly
    console.log("it is working");

    for (var i = 0; i < products.length; i++){
        if(products[i].id == req.params.product_id) {
            fs.unlinkSync(`./assets/images/${products[i].image_filename}`);
            products.splice(i, 1)
        }
    }

    res.json({
        success: true,
        products})
})

app.listen(3003);