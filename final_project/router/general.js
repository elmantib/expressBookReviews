const axios = require('axios').default;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});
// Define the API endpoint where the list of books is available


// Example route to fetch and return the list of books
public_users.get('/', async (req, res) => {
  
   let myPromises =new Promise((resolve,reject)=>{
       setTimeout(()=>{
           resolve('promise resolved');
           res.send(JSON.stringify(books,null,4));


       },1000)
   })
   myPromises.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

     let myPromises =new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('promise resolved');
            const isbn =req.params.isbn;
            res.send(books[isbn]);
 
 
        },1000)
    })
    myPromises.then((successMessage) => {
     console.log("From Callback " + successMessage)
   })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromises =new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('promise resolved');
            const author = req.params.author;
     // Replace with the actual way you retrieve request parameters

     const booksByAuthor = [];
     
     // Iterate through the books object and filter books by author
     for (const bookId in books) {
       if (books.hasOwnProperty(bookId)) {
         const book = books[bookId];
         if (book.author === author) {
           booksByAuthor.push(book);
         }
       }
     }
     res.send(booksByAuthor);
 
 
        },1000)
    })
    myPromises.then((successMessage) => {
     console.log("From Callback " + successMessage)
   })
     
     
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromises =new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('promise resolved');
            const title=req.params.title;
            const booksByTitle=[];
            for (const bookId in books){
                if(books.hasOwnProperty(bookId)){
                    const book=books[bookId];
                    if(book.title===title){
                        booksByTitle.push(book);
                    }
                }
            }
            res.send(booksByTitle);
 
 
        },1000)
    })
    myPromises.then((successMessage) => {
     console.log("From Callback " + successMessage)
   })
     
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
   let titleBooks=books[isbn].reviews;
   res.send(titleBooks);
   
});

module.exports.general = public_users;
