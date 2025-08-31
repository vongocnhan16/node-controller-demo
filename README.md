I. Project Structure
node-controller-demo/
│── controllers/
    |── auth_controller.js
    |── product_controller.js
    |── upload_controller.js
│── middleware/
    |── auth_middleware.js
│── models/
    |── product.js
    |── user.js
│── db/                
│── index.js           
│── package.json

II. Installation
1. Clone the repository:
   git clone https://github.com/vongocnhan16/node-controller-demo.git
cd node-controller-demo
2. Install dependencies:
   npm install
3. Database Setup:
   CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    condition VARCHAR(20) CHECK (condition IN ('New', 'Used', 'Refurbished')) DEFAULT 'Used',
    price NUMERIC(10,2) NOT NULL,
    user_id INT REFERENCES users(user_id), 
    created_at TIMESTAMP DEFAULT NOW()
);

4. Configure database connection in db.js:
   const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "your_db_name",
  password: "your_password",
  port: 5433,
});

module.exports = pool;
5. Run server:
  node index.js

