import { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:3000/books');
      const data = await response.json();
      setBooks(data);
    };

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
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginMessage('Something went wrong');
    }
  };

  return (
    <div className="p-8">
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
          {token && (
            <p className="mt-2 text-xs break-all text-gray-500">Token: {token}</p>
          )}
        </form>
      </div>

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