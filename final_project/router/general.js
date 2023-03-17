const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username required" });
    } else if (!password) {
        return res.status(400).json({ message: "Password required" });
    }
    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists!" });
    }
    users.push({username, password});
    return res.send("User registered successfully! You may now login");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!isbn || isNaN(isbn)) {
        return res.status(400).json({ message: "You need to provide a valid ISBN" })
    }
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "No book is found for ISBN " + isbn})
    }
    return res.send(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    if (!author) {
        return res.status(400).json({ message: "No author name was supplied" });
    }
    return res.send(Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    ));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    if (!title) {
        return res.status(400).json({ message: "No title name was supplied" });
    }
    return res.send(Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    ));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!isbn || isNaN(isbn)) {
        return res.status(400).json({ message: "You need to provide a valid ISBN" })
    }
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({message: "No book is found for ISBN " + isbn})
    }
    return res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
