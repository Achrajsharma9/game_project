// src/components/Header/Header.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { setFilters } from '../redux/slices/gameSlice';
import './Header.css';
import logo from '../logo.jpg'; // adjust the path based on where your Navbar component is



function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce this in a real application
    dispatch(setFilters({ search: value }));
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header-nav">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src={logo}
            width="40" 
            height="40" 
            className="d-inline-block align-top" 
            alt="Game Library Logo" 
          />
             Game Zone
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex mx-auto search-form">
            <FormControl
              type="search"
              placeholder="Search games..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form>
          
          <Nav className="ms-auto">
            {isSignedIn ? (
              <>
                <Nav.Link as={Link} to="/library">My Library</Nav.Link>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline-light" className="me-2">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="primary">Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;