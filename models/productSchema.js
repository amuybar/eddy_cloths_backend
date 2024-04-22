const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  category: {
    type: [String], 
    required: true,
  },
  size: {
    type: String, 
  },
  brand: {
    type: String,
    
  },
  color: {
    type: String,
  },
  images: {
    type: [String],
    
  },
});

module.exports = mongoose.model('Product', productSchema);
