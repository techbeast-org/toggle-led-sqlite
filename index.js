var express = require("express");
var app = express();
var gpio = require("rpi-gpio");
var sqlite3 = require("sqlite3");
var database = require("./db.js");
var db = new sqlite3.Database("device_logs.db");


app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static('public'))
var device_name = "MyLED";

gpio.setup(7, gpio.DIR_OUT);

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/led/on", function (req, res) {
  gpio.write(7, true, function (err) {
    if (err) throw err;
    console.log("Written True to pin");
  });
  var name = device_name;
  var status = "on";
  var sql = `insert into logs (name,status)
  VALUES
  (?,?);`;

  var values = [name, status];

  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else { 
        if (req.accepts("html")) {
          res.render("index");
        }else res.sendStatus(200);
      }
    });
  });
console.log("ON status inserted yo your DB")

 });

app.post("/led/off", function (req, res) {
  gpio.write(7, false, function (err) {
    if (err) throw err;
    console.log("Written False to pin");
  });
  var name = device_name;
  var status = "off";
  var sql = `insert into logs (name,status)
  VALUES
  (?,?);`;

  var values = [name, status];

  db.serialize(function () {
    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else { 
        if (req.accepts("html")) {
          res.render("index");
        }else res.sendStatus(200);
      }
    });
  });
  console.log("OFF status inserted yo your DB");
});

app.get("/led/logs", function (req, res) {
  //List Users
  //processData(res, "SELECT * FROM logs ");

  //List Users
  db.serialize(function () {
    db.all("SELECT * FROM logs",function (err, data)  {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else if (data[0]) {
        if (req.accepts("html")) {
          res.render("logs", { title: "Device Logs", DeviceData: data });
        } else res.json(data);
      };
    });
  });
});

app.listen(3000, function () {
  console.log("Simple LED Control Server Started on Port: 3000!");
});


//function processData(res, sql) {
//  db.serialize(function () {
//   db.all(sql, function (err, rows) {
//   if (err) {
//       console.error(err);
//        res.status(500).send(err);
//      } else sendData(res, rows, err);
//    });
//  });
//}

//function sendData(res, data, err) {
  
//  if (data[0])
//res.render("logs", { title: "Device Logs", DeviceData: data });
// else {
//   res.status(404).send("No data Found");
// }
//}

