const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let users = require("../index.js")
const regd_users = express.Router();
let user;
const isValid = (username)=>{ let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    console.log(Object.values(users))
    let validusers = Object.values(users)[0].filter((user)=>{
        return (user.username === username && user.password === password)
      });
      console.log(validusers)
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
    if(users.length == 0){
        return res.status(208).json({message: "User is not registred!!"});
    }else{
        if (!username || !password) {
            return res.status(404).json({message: "Error logging in"});
        }
        if (authenticatedUser(username,password)) {
          let accessToken = jwt.sign({
            data: password
          }, 'access', { expiresIn: 60*60 });
          req.session.authorization = {
            accessToken,username
        }
        user = username
        return res.status(200).send("User successfully logged in");
        } else {
          return res.status(208).json({message: "Invalid Login. Check username and password"});
        }
    }
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    const review = req.body.review;
    if (books[isbn] != null){
        books[isbn]['reviews'][user] = review
        return res.send(books[isbn]) 
    }else{
        return res.status(300).json({message: "Book with this ISBN: "+isbn+" is not exist!"});
    }
 
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    if (books[isbn] != null){
        books[isbn]['reviews'][user] = ''
        return res.send(books[isbn]) 
    }else{
        return res.status(300).json({message: "Book with this ISBN: "+isbn+" is not exist!"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
