const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');
router.post('/', bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);
module.exports = router;