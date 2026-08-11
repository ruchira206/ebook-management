const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, isAdmin, bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', protect, isAdmin, bookController.updateBook);
router.delete('/:id', protect, isAdmin, bookController.deleteBook);

module.exports = router;