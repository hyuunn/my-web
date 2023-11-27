var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lemon3104',
    database: 'database',
    multipleStatements: true,
    charset: 'utf8mb4'
  });
  db.connect();

  module.exports = db;