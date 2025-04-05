// src/pages/LibraryPage.js
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { removeGame } from '../redux/slices/librarySlice';
import './LibraryPage.css';

function LibraryPage() {
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
    <Container className="library-container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="library-title">My Game Library</h1>
          {user && (
            <p className="welcome-text">
              Welcome, {user.firstName || user.username}! Here's your collection of saved games.
            </p>
          )}
        </Col>
      </Row>

      {/* Filters section */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Search your library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {uniqueGenres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Display saved games or empty state */}
      {savedGames.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>Your library is empty</Alert.Heading>
          <p>
            Browse games and click "Save" to add them to your library. 
            Your saved games will appear here for easy access.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button as={Link} to="/" variant="outline-primary">
              Browse Games
            </Button>
          </div>
        </Alert>
      ) : filteredGames.length === 0 ? (
        <Alert variant="warning">
          <Alert.Heading>No matches found</Alert.Heading>
          <p>
            No games match your current search or filter. Try adjusting your criteria.
          </p>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setSearchTerm('');
              setFilterGenre('');
            }}
          >
            Clear Filters
          </Button>
        </Alert>
      ) : (
        <>
          <div className="library-stats mb-3">
            <span className="stats-text">
              Showing {filteredGames.length} of {savedGames.length} saved games
            </span>
          </div>
          
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredGames.map(game => (
              <Col key={game.id}>
                <Card className="game-card h-100">
                  <Link to={`/game/${game.id}`} className="game-card-link">
                    <Card.Img 
                      variant="top" 
                      src={game.background_image || '/placeholder-game.jpg'} 
                      alt={game.name} 
                      className="library-card-img"
                    />
                  </Link>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{game.name}</Card.Title>
                    
                    <div className="game-genres mb-2">
                      {game.genres?.slice(0, 3).map(genre => (
                        <Badge 
                          key={genre.id} 
                          bg="secondary" 
                          className="me-1 mb-1"
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                    
                    {game.released && (
                      <small className="text-muted mb-2">
                        Released: {new Date(game.released).toLocaleDateString()}
                      </small>
                    )}
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <Button 
                          as={Link} 
                          to={`/game/${game.id}`} 
                          variant="primary" 
                          size="sm"
                        >
                          Details
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleRemoveGame(game.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default LibraryPage;