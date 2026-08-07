const Book = require('../models/Book');

const createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
    try{
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }       
        res.status(200).json(updatedBook);
    }catch (err) {
    res.status(500).json({ error: err.message });  
    }  

}


const deleteBook = async (req, res) => {
    try{
        const deletedBook = await Book.findByIdAndDelete(req.params.id)
        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook };