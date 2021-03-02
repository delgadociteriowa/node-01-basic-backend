'use strict'

const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');


const app = express();
const port = process.env.PORT || 5000; 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/product', (req, res) => {
  Product.find({}, (err, products) => {
    if (err) return res.status(500).send({ message: `Request error: ${err}`});
    if (!products) return res.status(404).send({message: 'There are no existances'});

    res.status(200).send({ products })
  })
});

app.get('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({ message: `Request error: ${err}`});
    if (!product) return res.status(404).send({message: `Product doesn't exist`});

    res.status(200).send({ product });
  });
});

app.post('/api/product', (req, res) => {
  console.log('POST api/product');
  console.log(req.body);

  let product = new Product();
  product.name = req.body.name;
  product.picture = req.body.picture;
  product.price = req.body.price;
  product.category = req.body.category;
  product.description = req.body.description;

  product.save((err, productStored) => {
    if(err) res.status(500).send({message: `Error when saving ${err}`});

    res.status(200).send({product: productStored});
  })
});

app.put('/api/product/:productId', (req, res) => {
  let productId = req.params.productId; 
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) => {
    if (err) res.status(500).send({ message: `Product update error: ${err}`});

    res.status(200).send({ product: productUpdated }); 
  })
});

app.delete('/api/product/:productId', (req, res) => {
  let productId = req.params.productId;
  
  Product.findById(productId, (err, product) => {
    if (err) res.status(500).send({ message: `Product delete error: ${err}`});

    product.remove(err => {
      if (err) res.status(500).send({ message: `Product delete error: ${err}`});
      res.status(200).send({message: 'Product has been deleted'});
    })    
  })
});

mongoose.connect('mongodb://localhost:27017/shop', (err, res) => {
  if (err) {
    return console.log('DB connection error: ', err)
  }
  console.log('DB Connected');
  app.listen(5000, () => {
    console.log(`API Running in localhost ${port}`);
  })
})

