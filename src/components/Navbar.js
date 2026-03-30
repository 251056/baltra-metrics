import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './navbar.css';

function NavigationBar() {
  const [expanded, setExpanded] = useState(false);
  // Tracks what you type
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate(); 
  const location = useLocation();

  // When you hit Enter or click the magnifying glass
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Stops the browser from reloading the page

    if (searchQuery.trim()) {
      // Encodes the word (turns spaces into %20) and sends it into the URL
      navigate(`/compare?search=${encodeURIComponent(searchQuery)}`);

      setSearchQuery(''); // Clears the input field// Closes the mobile menu shut, previous issue
    }
  };

  // The Navbar component from React Bootstrap, with some custom classes and styles.
  return (
    <Navbar expand="lg" className="glass-nav position-fixed" expanded={expanded} onToggle={(isExpanded) => setExpanded(isExpanded)}>
      <Container fluid>
        <Navbar.Brand href="#" style={{ marginLeft: '15px', marginTop: '5px' }}>
          <img src="/icon.png" alt="Logo" width="24" height="24" className="d-inline-block align-top" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" className="circle-toggle" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 gap-0 align-items-center" style={{ maxHeight: '200px' }} navbarScroll>
            <Nav.Link as={NavLink} to="/" className="nav-item-custom" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/compare" className="nav-item-custom" onClick={() => setExpanded(false)}>Compare</Nav.Link>
            <Nav.Link as={NavLink} to="/timeline" className="nav-item-custom" onClick={() => setExpanded(false)}>Timeline</Nav.Link>
          </Nav>

          {/* If the path is NOT '/compare', keep the search bar. Otherwise, don't. */}
          {location.pathname !== '/compare' && (
            <Form className="d-flex gap-2 align-items-center" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search database..."
                className="glass-input"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="outline-light" className="circle-search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </Button>
            </Form>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;