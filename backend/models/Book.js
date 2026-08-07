const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
        bookName: {
         type: String,
         required: true
        },
        author: {
         type: String,
         required: true
        },
        category: {
         type: String,
         required: true
        },
        description: {
         type: String,
         required: true
        },
        coverImage: {
         type: String,
         required: true
        },
        fileFormat: {
         type: String,
         required: true,
         enum: ['pdf', 'epub']
        }
        
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;