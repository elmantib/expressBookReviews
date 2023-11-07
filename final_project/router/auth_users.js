const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
 let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the route parameters
    const review = req.body.review;
    const username = req.session.authorization.username; // Get the username from the session
 
    if (!isbn || !review || !username) {
        return res.status(400).json({ message: 'Invalid request. Please provide ISBN, review, and make sure you are logged in.' });
    }

    // Check if the book with the given ISBN exists in your books object
    if (books[isbn]) {
        // Check if the user has already posted a review for this book
        if (books[isbn].reviews[username]) {
            // Modify the existing review for the user
            books[isbn].reviews[username] = review;
            res.json({ message: 'Review modified successfully.' });
        } else {
            // Add a new review for the user
            books[isbn].reviews[username] = review;
            res.json({ message: 'Review added successfully.' });
        }
    } else {
        res.status(404).json({ message: 'Book not found with the given ISBN.' });
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Get the ISBN from the route parameters
    const username = req.session.authorization.username; // Get the username from the session

    if (!isbn || !username) {
        return res.status(400).json({ message: 'Invalid request. Please provide ISBN and make sure you are logged in.' });
    }

    // Check if the book with the given ISBN exists in your books object
    if (books[isbn]) {
        // Check if the user has posted a review for this book
        if (books[isbn].reviews[username]) {
            // Delete the user's review for this book
            delete books[isbn].reviews[username];
            res.json({ message: 'Review deleted successfully.' });
        } else {
            res.status(404).json({ message: 'User has not posted a review for this book.' });
        }
    } else {
        res.status(404).json({ message: 'Book not found with the given ISBN.' });
    }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
