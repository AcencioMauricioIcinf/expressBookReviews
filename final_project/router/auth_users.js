const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(user => user.username === username);
    if (user) {
        return user.password === password;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing credentials" });
    }
    if (!isValid(username) || !authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Wrong password or username" });
    }
    const token = jwt.sign({ data: {username, password} }, 'access', { expiresIn: 60 * 60 })
    req.session.authorization = { token, username };
    return res.send(username + " successfully logged in!")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (!isbn || isNaN(isbn)) {
        return res.status(400).json({ message: "You need to provide a valid ISBN" })
    }
    if (!books[isbn]) {
        return res.status(404).json({message: "No book is found for ISBN " + isbn})
    }
    const review = req.query.review;
    books[isbn].reviews[req.user] = review;
    return res.send("Review added successfully")
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (!isbn || isNaN(isbn)) {
        return res.status(400).json({ message: "You need to provide a valid ISBN" })
    }
    if (!books[isbn]) {
        return res.send("This book is already not present")
    }
    books[isbn].reviews[req.user] = undefined;
    return res.send("Review deleted successfully")
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
