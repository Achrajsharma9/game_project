// src/pages/GameDetailPage.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Badge, Spinner, Carousel } from 'react-bootstrap';
import { useUser } from '@clerk/clerk-react';
import { fetchGameDetails, fetchGameScreenshots } from '../services/api';
import { addGame, removeGame } from '../redux/slices/librarySlice';
import './GameDetailPage.css';

function GameDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const savedGames = useSelector(state => state.library.savedGames);
  const isSaved = savedGames.some(savedGame => savedGame.id === parseInt(id));

  // Fetch game details and screenshots
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gameData = await fetchGameDetails(id);
        setGame(gameData);
        
        const screenshotsData = await fetchGameScreenshots(id);
        setScreenshots(screenshotsData.results);
      } catch (err) {
        setError('Failed to load game details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handle save/remove from library
  const handleSaveGame = () => {
    if (!isSignedIn) {
      alert('Please sign in to save games to your library');
      return;
    }
    
    if (isSaved) {
      dispatch(removeGame(parseInt(id)));
    } else {
      dispatch(addGame(game));
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !game) {
    return (
      <Container className="text-center my-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Game not found'}
        </div>
      </Container>
    );
  }

  return (
    <Container className="game-detail-container">
      <Row className="mb-4">
        <Col>
          <h1 className="game-title">{game.name}</h1>
          <div className="game-meta">
            {game.released && (
              <span className="release-date">
                Released: {new Date(game.released).toLocaleDateString()}
              </span>
            )}
            
            {game.rating > 0 && (
              <span className="rating">
                Rating: {game.rating.toFixed(1)}/5
              </span>
            )}
          </div>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={8}>
          {/* Screenshots carousel */}
          {screenshots.length > 0 ? (
            <Carousel className="screenshots-carousel">
              {screenshots.map(screenshot => (
                <Carousel.Item key={screenshot.id}>
                  <img
                    className="d-block w-100"
                    src={screenshot.image}
                    alt={`Screenshot of ${game.name}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="placeholder-image">
              <img 
                src={game.background_image || '/placeholder-game.jpg'}
                alt={game.name}
                className="w-100"
              />
            </div>
          )}
        </Col>
        
        <Col md={4}>
          <div className="game-info-sidebar">
            {/* Genres */}
            <div className="info-section">
              <h5>Genres</h5>
              <div>
                {game.genres?.map(genre => (
                  <Badge key={genre.id} bg="secondary" className="me-1 mb-1">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Platforms */}
            <div className="info-section">
              <h5>Platforms</h5>
              <div>
                {game.platforms?.map(platform => (
                  <Badge key={platform.platform.id} bg="dark" className="me-1 mb-1">
                    {platform.platform.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div className="info-section">
              <h5>Tags</h5>
              <div>
                {game.tags?.slice(0, 8).map(tag => (
                  <Badge key={tag.id} bg="info" className="me-1 mb-1">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Save button */}
            <Button 
              variant={isSaved ? "danger" : "primary"}
              className="w-100 mt-3"
              onClick={handleSaveGame}
            >
              {isSaved ? "Remove from Library" : "Add to Library"}
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* Game description */}
      <Row>
        <Col>
          <div className="description-section">
            <h3>About</h3>
            <div 
              dangerouslySetInnerHTML={{ __html: game.description }} 
              className="game-description"
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default GameDetailPage;