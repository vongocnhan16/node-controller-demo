const Product = require('../models/Product');

const listProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, brand, model, condition, price } = req.body;
    const product = await Product.create({ 
      name, brand, model, condition, price, user_id: req.user.user_id 
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    await Product.delete(product_id);
    res.json({ message: `Product ${product_id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listUserProducts = async (req, res) => {
  try {
    const products = await Product.getByUser(req.user.user_id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listProducts, addProduct, deleteProduct, listUserProducts };
