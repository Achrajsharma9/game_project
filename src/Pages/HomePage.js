// src/pages/HomePage.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import GameCard from '../components/GameCard';
import Pagination from '../components/Pagination';
import { getGames } from '../redux/slices/gameSlice';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const { games, loading, error, filters, page } = useSelector(state => state.games);

  // Fetch games when page or filters change
  useEffect(() => {
    const params = {
      page_size: 20,
      page: page,
      search: filters.search || undefined,
      genres: filters.genres?.join(',') || undefined,
      tags: filters.tags?.join(',') || undefined,
      dates: filters.dates || undefined,
      ordering: filters.ordering || undefined
    };

    dispatch(getGames(params));
  }, [dispatch, page, filters]);

  return (
    <Container fluid className="home-container">
      <Row>
        {/* Sidebar - Filters */}
        <Col lg={3} md={4} className="sidebar-col">
          <Sidebar />
        </Col>
        
        {/* Main Content */}
        <Col lg={9} md={8} className="main-content">
          <h2 className="section-title">
            {filters.search ? `Search Results: "${filters.search}"` : 'Popular Games'}
          </h2>
          
          {/* Loading state */}
          {loading && (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="alert alert-danger" role="alert">
              Error loading games: {error}
            </div>
          )}
          
          {/* No results */}
          {!loading && games.length === 0 && (
            <div className="no-results">
              <h3>No games found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
          
          {/* Game cards grid */}
          <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
            {games.map(game => (
              <Col key={game.id}>
                <GameCard game={game} />
              </Col>
            ))}
          </Row>
          
          {/* Pagination */}
          <Pagination />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;