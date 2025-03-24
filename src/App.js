import React, { useState, useEffect } from 'react';

function App() {
  const [genre, setGenre] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [useCount, setUseCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('useCount')) || 0;
    setUseCount(storedCount);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limit free usage
    if (useCount >= 2) {
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('https://book-bot-backend.onrender.com/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre }),
      });

      const data = await response.json();
      setRecommendations(data.recommendations);

      const newCount = useCount + 1;
      setUseCount(newCount);
      localStorage.setItem('useCount', newCount);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('https://book-bot-backend.onrender.com/save-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, genre }),
      });

      alert("Thanks! You're now signed up.");
      setShowModal(false);
      localStorage.setItem('useCount', 0); // Reset usage count after signup
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📚Book Recommendation Bot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          What genre do you like?
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            style={{ marginLeft: '1rem' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '1rem' }}>Get Recommendations</button>
      </form>

      {recommendations && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Your Book Picks:</h3>
          <pre>{recommendations}</pre>
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '10px',
            width: '300px', textAlign: 'center'
          }}>
            <h2>You're on a roll!</h2>
            <p>Enter your email to keep getting amazing book picks.</p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
              />
              <button type="submit">Continue</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
