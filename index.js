require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const conDB = require('./config/db');
const jwt = require("jsonwebtoken");
const userModel = require('./userModel');


const app = express();
const port = process.env.PORT || 5000;

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Coonect to the database
conDB();


// router handlers 
app.get('/home', (req, res) => {
  res.status(200).json('You are welcome');
})

// Define a route that registers users to the databse
app.post('/register', async(req, res) => {
  const {fullname, email, password} = req.body 

  // hash the password 
  const hashedpassword = await bcrypt.hash(password, 10); 
  
  const newUser =  new userModel({
    fullname,
    email,
    password: hashedpassword
  })

  const userCreated = await newUser.save()
  if(!userCreated) {
    console.log("user cannot be created");
    return res.status(500).send("user cannot be created")
  } else {
    console.log("user has been created to the database");
    return res.status(200).send("user has been created to the database")
  }

});


// This route handles user login by authenticating the user's email and password
// and generates a JSON Web Token (JWT) for subsequent authentication of protected routes
app.post('/login', async(req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await userModel.findOne({ email });

  if (!user) {
    // If the user doesn't exist, return an error
    return res.status(401).send('Invalid email or password');
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    // If the password is incorrect, return an error
    return res.status(401).send('Invalid email or password');
  }

  // If the email and password are correct, create a JWT token
  const token = jwt.sign({ id: user._id }, 'mysecretkey', { expiresIn: '1h' });

  // Send the token back to the client
  res.status(200).json({
    msg: "User has been created",
    token: token
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});