import { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [fileFormat, setFileFormat] = useState('pdf');
  const [addMessage, setAddMessage] = useState('');

  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    const response = await fetch('http://localhost:3000/books');
    const data = await response.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail, password: regPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setRegMessage(data.error || 'Registration failed');
        return;
      }

      setRegMessage(data.message);
      setRegEmail('');
      setRegPassword('');
    } catch (err) {
      setRegMessage('Something went wrong');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setLoginMessage(data.error || 'Login failed');
        return;
      }

      setLoginMessage('Login successful');
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginMessage('Something went wrong');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const resetForm = () => {
    setBookName('');
    setAuthor('');
    setCategory('');
    setDescription('');
    setCoverImage('');
    setFileFormat('pdf');
    setEditingId(null);
  };

  const handleAddOrUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:3000/books/${editingId}`
        : 'http://localhost:3000/books';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookName,
          author,
          category,
          description,
          coverImage,
          fileFormat,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAddMessage(data.error || 'Failed to save book');
        return;
      }

      setAddMessage(editingId ? 'Book updated successfully' : 'Book added successfully');
      resetForm();
      fetchBooks();
    } catch (err) {
      setAddMessage('Something went wrong');
    }
  };

  const handleEditClick = (book) => {
    setEditingId(book._id);
    setBookName(book.bookName);
    setAuthor(book.author);
    setCategory(book.category);
    setDescription(book.description);
    setCoverImage(book.coverImage);
    setFileFormat(book.fileFormat);
    setAddMessage('');
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete');
        return;
      }

      if (editingId === id) resetForm();
      fetchBooks();
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <div className="p-8">
      {!token ? (
        <div className="flex gap-8 mb-8">
          <form onSubmit={handleRegister} className="max-w-sm">
            <h2 className="text-xl font-bold mb-2">Register</h2>
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Register
            </button>
            {regMessage && <p className="mt-2 text-sm">{regMessage}</p>}
          </form>

          <form onSubmit={handleLogin} className="max-w-sm">
            <h2 className="text-xl font-bold mb-2">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Login
            </button>
            {loginMessage && <p className="mt-2 text-sm">{loginMessage}</p>}
          </form>
        </div>
      ) : (
        <div className="mb-8">
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            Logout
          </button>

          <form onSubmit={handleAddOrUpdateBook} className="max-w-sm">
            <h2 className="text-xl font-bold mb-2">
              {editingId ? 'Edit Book' : 'Add Book'}
            </h2>
            <input
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="border p-2 w-full mb-2"
              required
            />
            <select
              value={fileFormat}
              onChange={(e) => setFileFormat(e.target.value)}
              className="border p-2 w-full mb-2"
            >
              <option value="pdf">pdf</option>
              <option value="epub">epub</option>
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingId ? 'Update Book' : 'Add Book'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
            {addMessage && <p className="mt-2 text-sm">{addMessage}</p>}
          </form>
        </div>
      )}

      {books.map((book) => (
        <div key={book._id} className="mb-4 p-4 border rounded flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{book.bookName}</h2>
            <p className="text-gray-600">{book.author}</p>
          </div>
          {token && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(book)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(book._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;