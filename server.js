// Load dependencies
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import models
const Cake = require(`./models/cake.js`);

// Create express app
const app = express();

// Set view engine
app.set('view engine','ejs')

// app.use is for using middleware
app.use(express.static(path.join(__dirname, 'public')));

// Connect to DB
mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', function(error){
  console.log(`Connection Error: ${error.message}`)
});

db.once('open', function() {
  console.log('Connected to DB...');
});

// Return index page
app.get('/', function(req, res) {
  res.send("<h1>Welcome to my CAKE STORE</h1><p>Enter this -- '/api/v0/cakes' to go to the cakeS endpoint </p><p>Enter this -- '/api/v0/cakes/:id' to go to the specific cake endpoint </p>");
})

// Return a JSON array
app.get('/api/v0/cakes', (req, res) => {
  Cake.find({}, (err, data) => {
    if (err) {
      res.send('Where is cake?')
    }
    else {
      res.json(data);
    }
  });
});

// Return JSON object based on the :id specified in the request URL.
app.get('/api/v0/cakes/:id',(req,res) => {
  let cakeId = req.params.id;
  Cake.findOne({id: cakeId}, (err, data) => {
    if (err || data===null) {
      res.send('No such cakes in my store');
      console.log(err);
    }
    else {
      res.json(data);
    }
  });
});

// Add more middleware
app.use(function(req, res, next) {
  res.status(404);
  res.send('404: File Not Found');
});

// Set port preferrence with default
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});
