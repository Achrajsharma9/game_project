// src/components/GameCard/GameCard.js
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from 'react-bootstrap';
import { useUser } from '@clerk/clerk-react';
import { addGame, removeGame } from '../redux/slices/librarySlice';
import './GameCard.css';

function GameCard({ game }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const savedGames = useSelector(state => state.library.savedGames);
  const isSaved = savedGames.some(savedGame => savedGame.id === game.id);

  const handleCardClick = () => {
    navigate(`/game/${game.id}`);
  };

  const handleSaveClick = (e) => {
    // Prevent navigation to the game details page
    e.stopPropagation();
    
    if (!isSignedIn) {
      alert('Please sign in to save games to your library');
      return;
    }
    
    if (isSaved) {
      dispatch(removeGame(game.id));
    } else {
      dispatch(addGame(game));
    }
  };

  return (
    <Card className="game-card" onClick={handleCardClick}>
      <div className="card-img-container">
        <Card.Img 
          variant="top" 
          src={game.background_image || '/placeholder-game.jpg'} 
          alt={game.name} 
        />
        <div className="rating-badge">
          {game.rating > 0 && (
            <span>{game.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
      
      <Card.Body>
        <Card.Title>{game.name}</Card.Title>
        
        <div className="game-info">
          <div className="game-tags">
            {game.genres?.slice(0, 2).map((genre) => (
              <Badge key={genre.id} bg="secondary" className="me-1">
                {genre.name}
              </Badge>
            ))}
          </div>
          
          <div className="release-year">
            {game.released && new Date(game.released).getFullYear()}
          </div>
        </div>
        
        <Button 
          variant={isSaved ? "danger" : "primary"}
          size="sm"
          className="save-button"
          onClick={handleSaveClick}
        >
          {isSaved ? "Remove" : "Save"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default GameCard;