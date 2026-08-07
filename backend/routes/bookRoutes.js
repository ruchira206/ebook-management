const express = require('express');

const router = express.Router();
const bookController = require('../controllers/bookController');
router.post('/', bookController.createBook);
router.get('/', bookController.getBooks);
module.exports = router;