import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// Import the logo. The '../' steps out of the components folder to find the assets folder.
import logoImage from '../assets/logo.png';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#040404',
            borderTop: '1px solid #1a1a1a',
            padding: '60px 0 30px 0',
            marginTop: '80px',
            color: '#888',
            fontFamily: '"Courier New", monospace'
        }}>
            <Container>
                <Row className="gy-4">
                    <Col md={6}>
                        <img
                            src={logoImage}
                            alt="BVLTRA Logo"
                            style={{
                                height: '24px', // You can tweak this to make it bigger or smaller
                                marginBottom: '15px',
                                display: 'block'
                            }}
                        />
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '300px' }}>
                            Advanced nutritional telemetry and metabolic tracking. Built for high-performance biological rendering.
                        </p>
                    </Col>

                    <Col md={3}>
                        <h6 style={{ color: '#00ffcc', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontSize: '0.8rem' }}>
                            Systems Core
                        </h6>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', lineHeight: '2' }}>
                            <li style={{ cursor: 'pointer' }}>Compare Engine</li>
                            <li style={{ cursor: 'pointer' }}>Telemetry Stream</li>
                        </ul>
                    </Col>

                    <Col md={3}>
                        <h6 style={{ color: '#00ffcc', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', fontSize: '0.8rem' }}>
                            Documentation
                        </h6>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', lineHeight: '2' }}>
                            <li>
                                <a
                                    href="https://platform.fatsecret.com/api/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s ease' }}
                                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                                    onMouseLeave={(e) => e.target.style.color = '#888'}
                                >
                                    FatSecret API
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://react-bootstrap.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s ease' }}
                                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                                    onMouseLeave={(e) => e.target.style.color = '#888'}
                                >
                                    React Bootstrap
                                </a>
                            </li>
                        </ul>
                    </Col>

                </Row>

                <hr style={{ borderColor: '#1a1a1a', margin: '40px 0 20px 0', opacity: 1 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#444', flexWrap: 'wrap', gap: '15px' }}>
                    <span>&copy; {new Date().getFullYear()} BVLTRA. All Rights Reserved</span>

                    <span>BVLTRA Metrics is an educational interactive project. Nutritional data provided by the FatSecret API.</span>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;