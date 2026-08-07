
const Book = require('../models/Book');

const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = createBook;