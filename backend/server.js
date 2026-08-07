require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

app.get('/', (req, res) => {
  res.send('E-book Management API running');
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection failed', err);
  });
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})