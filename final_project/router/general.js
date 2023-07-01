const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let booksListPromise = new Promise((resolve,reject) => {
          resolve("Getting books list opration done!")
        })
    booksListPromise.then((successMessage) => {
        console.log(successMessage)
        return res.send({message: successMessage,books:books});
      })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if (books[isbn] != null){
        return res.send(books[isbn]);
    }else{
        return res.status(300).json({message: "Book with this ISBN: "+isbn+" is not exist!"});
    }
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let book   = null
  for (let [key, value] of Object.entries(books)) {
        if (value["author"] == author){
            book = value
            break;
        }
    }
  if (book != null){
    return res.send(book);
  }else{
    return res.status(300).json({message: "Book with this AUTHOR: "+author+" is not exist!"});
  }  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    let book   = null
    for (let [key, value] of Object.entries(books)) {
          if (value["title"] == title){
              book = value
              break;
          }
      }
    if (book != null){
      return res.send(book);
    }else{
      return res.status(300).json({message: "Book with this TITLE: "+title+" is not exist!"});
    } 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    if (books[isbn] != null){
        return res.send(books[isbn]["reviews"]);
    }else{
        return res.status(300).json({message: "Book with this ISBN: "+isbn+" is not exist!"});
    }
});



module.exports.general = public_users;
