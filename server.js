const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/web215', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname)); // serve static files from current dir

app.get('/', (req, res) => {
  res.send('<h1>web215 MERN app is running!</h1>');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

const Book = require('./models/Book');
app.use(express.json());

// CREATE
app.post('/api/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// READ
app.get('/api/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// UPDATE
app.put('/api/books/:id', async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// DELETE
app.delete('/api/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

