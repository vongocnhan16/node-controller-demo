const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",        
  host: "localhost",     
  database: "test_database",      
  password: "steve123",
  port: 5433,            
});

module.exports = pool;
