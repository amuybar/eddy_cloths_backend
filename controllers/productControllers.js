const express = require('express');
const Product = require('../models/productSchema');
const upload= require('../middleware/multer_config')
const router = express.Router();



// **GET all products**
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting products' });
  }
});

// **GET a specific product by ID**
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting product' });
  }
});

// **CREATE a new product**
router.post('/products', upload.array('images'), async (req, res) => {
  try {
    console.log('Received POST request to create a new product.');

    const { title, description, price, quantity, availability, category, size, brand, color } = req.body;

    const images = req.files.map((file) => file.path); // Extract image paths from uploaded files
    console.log('Uploaded images:', images);
    const newProduct = new Product({ title, description, price, quantity, availability, category, size, brand, color, images });

    await newProduct.save();

    console.log('Product saved successfully:', newProduct);

    res.status(201).json({ message: 'Product created successfully!' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

rsrs
// **UPDATE a product by ID** (assuming you want to update all fields)
router.put('/products/:id', async (req, res) => {
  try {
    const { title, description, price, quantity, availability, category, size, brand, color, imagePath } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, quantity, availability, category, size, brand, color, imagePath },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// **DELETE a product by ID**
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});


module.exports = router;
