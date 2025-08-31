console.log('Starting server...');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'temp/' });

console.log('Loading auth_controller...');
const { signup, signin } = require('./controllers/auth_controller');
console.log('auth_controller loaded');

console.log('Loading upload_controller...');
const { index, create, destroy } = require('./controllers/upload_controller');
console.log('upload_controller loaded');

console.log('Loading product_controller...');
const { listProducts, addProduct, deleteProduct, listUserProducts } = require('./controllers/product_controller');
console.log('product_controller loaded');

console.log('Loading authorize middleware...');
const authorize = require('./middleware/auth_middleware');
console.log('authorize loaded');

const app = express();
app.use(bodyParser.json());

// Auth routes
app.post('/signup', signup);
app.post('/signin', signin);

// Upload routes
app.get('/uploads', authorize, index);
app.post('/uploads', authorize, uploadMiddleware.single('file'), create);
app.delete('/uploads/:filename', authorize, destroy);

// Product routes
app.get('/products', listProducts);
app.get('/products/me', authorize, listUserProducts);
app.post('/products', authorize, addProduct);
app.delete('/products/:product_id', authorize, deleteProduct);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
