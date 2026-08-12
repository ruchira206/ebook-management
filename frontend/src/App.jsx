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
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const [authView, setAuthView] = useState('login');

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [fileFormat, setFileFormat] = useState('pdf');
  const [addMessage, setAddMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
      setRegMessage('Account created — you can log in now.');
      setRegEmail('');
      setRegPassword('');
      setAuthView('login');
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
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setRole(data.role);
      localStorage.setItem('role', data.role);
      setLoginEmail('');
      setLoginPassword('');
      setLoginMessage('');
    } catch (err) {
      setLoginMessage('Something went wrong');
    }
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const resetForm = () => {
    setBookName('');
    setAuthor('');
    setCategory('');
    setDescription('');
    setCoverImage('');
    setFileFormat('pdf');
    setEditingId(null);
    setShowForm(false);
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
        body: JSON.stringify({ bookName, author, category, description, coverImage, fileFormat }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAddMessage(data.error || 'Failed to save book');
        return;
      }
      resetForm();
      setAddMessage('');
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
    setShowForm(true);
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--parchment)' }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: 'var(--line)', backgroundColor: 'var(--parchment)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-tight" style={{ color: 'var(--ink)' }}>
              Bibliotheca
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] mt-1" style={{ color: 'var(--leather)' }}>
              E-Book Management
            </p>
          </div>

          {token ? (
            <div className="flex items-center gap-3">
              {role === 'admin' && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium text-white transition"
                  style={{ backgroundColor: 'var(--moss)' }}
                >
                  + Add Book
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-medium border transition"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Auth panel, shown only when logged out */}
        {!token && (
          <div
            className="max-w-md mx-auto mb-14 rounded-2xl border shadow-sm p-8"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--line)' }}
          >
            <div className="flex gap-6 mb-6 border-b" style={{ borderColor: 'var(--line)' }}>
              <button
                onClick={() => setAuthView('login')}
                className="pb-3 font-display text-lg"
                style={{
                  color: authView === 'login' ? 'var(--leather)' : '#9a917d',
                  borderBottom: authView === 'login' ? '2px solid var(--leather)' : 'none',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthView('register')}
                className="pb-3 font-display text-lg"
                style={{
                  color: authView === 'register' ? 'var(--leather)' : '#9a917d',
                  borderBottom: authView === 'register' ? '2px solid var(--leather)' : 'none',
                }}
              >
                Create Account
              </button>
            </div>

            {authView === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ borderColor: 'var(--line)' }}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ borderColor: 'var(--line)' }}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-white font-medium text-sm"
                  style={{ backgroundColor: 'var(--leather)' }}
                >
                  Sign In
                </button>
                {loginMessage && (
                  <p className="text-sm text-center" style={{ color: 'var(--leather)' }}>
                    {loginMessage}
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ borderColor: 'var(--line)' }}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ borderColor: 'var(--line)' }}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-white font-medium text-sm"
                  style={{ backgroundColor: 'var(--moss)' }}
                >
                  Create Account
                </button>
                {regMessage && (
                  <p className="text-sm text-center" style={{ color: 'var(--moss)' }}>
                    {regMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        )}

        {/* Add/Edit form panel — admin only */}
        {role === 'admin' && showForm && (
          <div
            className="max-w-md mx-auto mb-14 rounded-2xl border shadow-sm p-8"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--line)' }}
          >
            <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--ink)' }}>
              {editingId ? 'Edit Book' : 'New Book'}
            </h2>
            <form onSubmit={handleAddOrUpdateBook} className="space-y-3">
              <input
                type="text"
                placeholder="Book name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--line)' }}
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--line)' }}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--line)' }}
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
                style={{ borderColor: 'var(--line)' }}
                rows={3}
                required
              />
              <input
                type="text"
                placeholder="Cover image URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--line)' }}
                required
              />
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--line)' }}
              >
                <option value="pdf">PDF</option>
                <option value="epub">EPUB</option>
              </select>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm"
                  style={{ backgroundColor: 'var(--leather)' }}
                >
                  {editingId ? 'Save Changes' : 'Add Book'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-lg border text-sm font-medium"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  Cancel
                </button>
              </div>
              {addMessage && (
                <p className="text-sm text-center" style={{ color: 'var(--leather)' }}>
                  {addMessage}
                </p>
              )}
            </form>
          </div>
        )}

        {/* Book grid */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>
            The Shelf
          </h2>
          <span className="text-sm" style={{ color: '#9a917d' }}>
            {books.length} {books.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {books.length === 0 ? (
          <p className="text-sm" style={{ color: '#9a917d' }}>
            No books yet — {role === 'admin' ? 'add the first one.' : 'check back soon.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="rounded-xl overflow-hidden border shadow-sm flex flex-col"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--line)' }}
              >
                <div
                  className="h-40 w-full flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: 'var(--line)' }}
                >
                  <img
                    src={book.coverImage}
                    alt={book.bookName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span
                    className="text-[11px] uppercase tracking-wider font-medium mb-1"
                    style={{ color: 'var(--leather)' }}
                  >
                    {book.category} · {book.fileFormat}
                  </span>
                  <h3 className="font-display text-lg leading-snug" style={{ color: 'var(--ink)' }}>
                    {book.bookName}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: '#7a7160' }}>
                    {book.author}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: '#7a7160' }}>
                    {book.description}
                  </p>

                  {role === 'admin' && (
                    <div className="mt-auto flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
                      <button
                        onClick={() => handleEditClick(book)}
                        className="flex-1 text-xs font-medium py-1.5 rounded-md border"
                        style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="flex-1 text-xs font-medium py-1.5 rounded-md text-white"
                        style={{ backgroundColor: 'var(--leather-dark)' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;