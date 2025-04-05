// src/components/Sidebar/Sidebar.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Accordion } from 'react-bootstrap';
import { setFilters } from '../redux/slices/gameSlice';
import axios from 'axios';
import './Sidebar.css';

function Sidebar() {
  const dispatch = useDispatch();
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedOrdering, setSelectedOrdering] = useState('');

  // Fetch genres and tags from API
  useEffect(() => {
    const API_KEY = '96056e531e844d10889d52ccc5b91b91';
    
    // Generate years (last 20 years)
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let i = 0; i < 20; i++) {
      yearsList.push(currentYear - i);
    }
    setYears(yearsList);
    
    // Fetch genres
    axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
      .then(response => setGenres(response.data.results))
      .catch(error => console.error('Error fetching genres:', error));
    
    // Fetch tags (limit to popular ones)
    axios.get(`https://api.rawg.io/api/tags?key=${API_KEY}&page_size=20`)
      .then(response => setTags(response.data.results))
      .catch(error => console.error('Error fetching tags:', error));
  }, []);

  // Apply filters when user clicks the button
  const applyFilters = () => {
    dispatch(setFilters({
      genres: selectedGenres,
      tags: selectedTags,
      dates: selectedYear ? `${selectedYear}-01-01,${selectedYear}-12-31` : null,
      ordering: selectedOrdering
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedTags([]);
    setSelectedYear('');
    setSelectedOrdering('');
    dispatch(setFilters({
      genres: [],
      tags: [],
      dates: null,
      ordering: null
    }));
  };

  // Handle genre selection
  const handleGenreChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedGenres([...selectedGenres, value]);
    } else {
      setSelectedGenres(selectedGenres.filter(genre => genre !== value));
    }
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedTags([...selectedTags, value]);
    } else {
      setSelectedTags(selectedTags.filter(tag => tag !== value));
    }
  };

  return (
    <div className="sidebar-container">
      <h4 className="sidebar-title">Filters</h4>
      
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Genres</Accordion.Header>
          <Accordion.Body className="filters-section">
            {genres.map(genre => (
              <Form.Check 
                key={genre.id}
                type="checkbox"
                id={`genre-${genre.id}`}
                label={genre.name}
                value={genre.id}
                checked={selectedGenres.includes(genre.id.toString())}
                onChange={handleGenreChange}
                className="filter-item"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="1">
          <Accordion.Header>Tags</Accordion.Header>
          <Accordion.Body className="filters-section">
            {tags.map(tag => (
              <Form.Check 
                key={tag.id}
                type="checkbox"
                id={`tag-${tag.id}`}
                label={tag.name}
                value={tag.id}
                checked={selectedTags.includes(tag.id.toString())}
                onChange={handleTagChange}
                className="filter-item"
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="2">
          <Accordion.Header>Release Year</Accordion.Header>
          <Accordion.Body>
            <Form.Select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="mb-3"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="3">
          <Accordion.Header>Sort By</Accordion.Header>
          <Accordion.Body>
            <Form.Select 
              value={selectedOrdering}
              onChange={(e) => setSelectedOrdering(e.target.value)}
            >
              <option value="">Default</option>
              <option value="-rating">Highest Rating</option>
              <option value="rating">Lowest Rating</option>
              <option value="-released">Newest</option>
              <option value="released">Oldest</option>
              <option value="-metacritic">Metacritic (High to Low)</option>
            </Form.Select>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      <div className="filter-buttons">
        <Button variant="primary" onClick={applyFilters} className="w-100 mb-2">
          Apply Filters
        </Button>
        <Button variant="outline-secondary" onClick={resetFilters} className="w-100">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;