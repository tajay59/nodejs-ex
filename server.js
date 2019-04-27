const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});  // create database called test
//var request = require('request');
//var express = require('express');
const path = require("path");
var bodyParser = require('body-parser');
var fs = require('fs');

var rpm = require("./Records.js");
var csv =  require('fast-csv');
var ws = fs.createWriteStream('datalog.csv');
var temp = 0;
var orient = "none"
var bpms = 0;
//var app = express();
//app.use(express.static(path.join(__dirname,"./client")));

//app.use(bodyParser.urlencoded({ extended: false }));
var bp = bodyParser.urlencoded({ extended: false });
//=======================================================================================

//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '8080',
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    // col.insert({
    //    name:"real",
    // temperature:32,
    // bpm:67,
    // orientation:"On Back",      } ,console.log("Done Updating"));

    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

//=================  MY CODE ==========================

function createData(req,res){
  var col1 = db.collection('data');
  //Create a document with request IP and current time of request
  col1.insert({
     name:"real",
  temperature:32,
  bpm:67,
  orientation:"On Back",      } ,console.log("Done Updating"));

}

function checkData(req,res){
  var col3 = db.collection('data');
  //Create a document with request IP and current time of request

  //col3.findOne({name:"real"},function(err,docs){    res.json(docs); docs.temperature = 3200; docs.bpm = 5700;   docs.orientation = "Leftside"; docs.save(); }); //}); )
//   col3.findOneAndUpdate(
//     { "name" : "real" },
//     { $inc: { "temperature" : "3200", "orientation" : "On Leftside", "bpm" : "1500" } }
//  )

 col3.findOneAndUpdate({name:"real"},{$set:{"temperature":90,"bpm":620085969,"orientation":"Leftside"}})
 //db.data.findOneAndUpdate({name:"real"},{$set:{"temperature":1600,"bpm":156,"orientation":"Rightside"}})
}

function espPost(req, res)  //make them write most of this
{

  console.log(req.body);


// request.post({
//   headers: {'content-type' : 'application/x-www-form-urlencoded'},
//   url:     'http://nodejs-mongo-persistent-rpm.1d35.starter-us-east-1.openshiftapps.com/espPost',
//   body:    "name=real&temperature="+req.body.temperature+"&bpm="+req.body.bpm+"&orientation="+req.body.orientation
// }, function(error, response, body){
//   console.log(body);
// });





  var successMessage = {
    success:true
  };
  
  var col2 = db.collection('data');

  

  //console.log(req.body);
  //fs.writeFile('./client/log.txt','\n' +"Temperature :"+ req.body.temperature +"  Heartrate : "+ req.body.bpm + " Orientation : "+ req.body.orientation + "  Date/Time :"+ new Date().toISOString(),{flag:'a'},(err)=> {if(err){console.log(" Log file  updated"); } else{console.log("  updated")};});
  //csv.writeToStream(fs.createWriteStream("datalog.csv"),[ [req.body.temperature, req.body.bpm,req.body.orientation,new ] ],{headers:true}).pipe(ws);
  col2.findOneAndUpdate({name:"real"},{$set:{temperature:req.body.temperature,bpm:req.body.bpm,orientation:req.body.orientation}})
  //col2.findOne({name:"real"},function(err,docs){    res.json(docs); docs.temperature = req.body.temperature; docs.bpm = req.body.bpm;   docs.orientation = req.body.orientation; docs.save(); }); //}); )
    //.then(r => res.send("Message received"));
    //console.log(values);
    
}

app.get('/tajay/all', function(req, res){
  var col4 = db.collection('data');
  col4.findOne({name:"real"},function(err,docs){   res.json(docs);}); //res.send('new hello world');
});  

app.get('/values', function(req, res){
  rpm.findOne({name:"real"},function(err,docs){   res.json(docs.temperature);});} );//res.send('new hello world');


app.post("/espPost",bp,espPost);
app.get("/try",checkData);
app.get("/create",createData);


// ====================================================================================



app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
