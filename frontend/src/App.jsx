import { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:3000/books');
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      {books.map((book) => (
        <div key={book._id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-bold">{book.bookName}</h2>
          <p className="text-gray-600">{book.author}</p>
        </div>
      ))}
    </div>
  );
}

export default App;