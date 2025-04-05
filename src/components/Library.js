// src/components/Library/Library.js
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { removeGame } from '../redux/slices/librarySlice';
import './Library.css';

function Library() {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { savedGames } = useSelector(state => state.library);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  // Get unique list of genres from saved games
  const uniqueGenres = [...new Set(
    savedGames.flatMap(game => game.genres?.map(genre => genre.name) || [])
  )].sort();

  // Filter games based on search term and genre filter
  const filteredGames = savedGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === '' || 
      game.genres?.some(genre => genre.name === filterGenre);
    return matchesSearch && matchesGenre;
  });

  // Remove game from library
  const handleRemoveGame = (gameId) => {
    dispatch(removeGame(gameId));
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">My Game Library</h1>
        {user && (
          <p className="welcome-text">
            Welcome, {user.firstName || user.username}! Here's your collection of saved games.
          </p>
        )}
      </div>

      {/* Filters section */}
      <div className="library-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="genre-filter-container">
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="genre-select"
          >
            <option value="">All Genres</option>
            {uniqueGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Display saved games or empty state */}
      {savedGames.length === 0 ? (
        <div className="empty-library-alert">
          <h3>Your library is empty</h3>
          <p>
            Browse games and click "Save" to add them to your library. 
            Your saved games will appear here for easy access.
          </p>
          <div className="alert-actions">
            <Link to="/" className="browse-button">
              Browse Games
            </Link>
          </div>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="no-matches-alert">
          <h3>No matches found</h3>
          <p>
            No games match your current search or filter. Try adjusting your criteria.
          </p>
          <button 
            className="clear-filters-button"
            onClick={() => {
              setSearchTerm('');
              setFilterGenre('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="library-stats">
            <span className="stats-text">
              Showing {filteredGames.length} of {savedGames.length} saved games
            </span>
          </div>
          
          <div className="library-grid">
            {filteredGames.map(game => (
              <div key={game.id} className="library-card">
                <Link to={`/game/${game.id}`} className="game-card-link">
                  <div className="card-image-container">
                    <img 
                      src={game.background_image || '/placeholder-game.jpg'} 
                      alt={game.name} 
                      className="card-image"
                    />
                  </div>
                </Link>
                <div className="card-content">
                  <h3 className="card-title">{game.name}</h3>
                  
                  <div className="game-genres">
                    {game.genres?.slice(0, 3).map(genre => (
                      <span 
                        key={genre.id} 
                        className="genre-badge"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                  
                  {game.released && (
                    <small className="release-date">
                      Released: {new Date(game.released).toLocaleDateString()}
                    </small>
                  )}
                  
                  <div className="card-actions">
                    <Link 
                      to={`/game/${game.id}`} 
                      className="details-button"
                    >
                      Details
                    </Link>
                    <button 
                      className="remove-button" 
                      onClick={() => handleRemoveGame(game.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Library;