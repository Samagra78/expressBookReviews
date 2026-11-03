const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = decodeURIComponent(req.params.author).toLowerCase();
  const matches = Object.keys(books).reduce((result, isbn) => {
    if (books[isbn].author.toLowerCase().includes(author)) result[isbn] = books[isbn];
    return result;
  }, {});
  return res.status(200).json(matches);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = decodeURIComponent(req.params.title).toLowerCase();
  const matches = Object.keys(books).reduce((result, isbn) => {
    if (books[isbn].title.toLowerCase().includes(title)) result[isbn] = books[isbn];
    return result;
  }, {});
  return res.status(200).json(matches);
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
