var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("device_logs.db");

// create things table
db.run(
  `CREATE TABLE IF NOT EXISTS 'logs' (
    'id'	INTEGER PRIMARY KEY AUTOINCREMENT,
      'timestamp' DATETIME DEFAULT CURRENT_TIMESTAMP,
      'name' TEXT,
      'status' TEXT );`,
  function (err) {
    if (err) {
      return console.log(err.message);
    }
    console.log("Database is created for your device logs");
  }
);
