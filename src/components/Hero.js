import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import './hero.css';

//Note: Images imposted because react apparently doesn't like it when you use the files in the public folder for some reason. 
//To do: Learn more about how react handles static assets and see if there's a way to use the public folder instead of importing every image as a module.
import bgImage from '../assets/hero-bg2.jpg';
import logoImage from '../assets/hero-logo.png';
function Hero() {
    const navigate = useNavigate(); 

    return (
        //Left to right gradient overlay with the background image underneath. 
        //Gradient steps from light to dark to light again because NOBODY decided it'd be a good idea to creat "to center" or "to middle" gradient directions in CSS!!!
        <div
            className="hero-engine"
            style={{
                backgroundImage: `linear-gradient(to right, 
        rgba(0, 0, 0, 0.9) 0%,    /* 1. Left edge: Heavy shadow for your text/logo */
        rgba(0, 0, 0, 0) 40%,     /* 2. Middle-left: The shadow completely dissolves */
        rgba(0, 0, 0, 0) 60%,     /* 3. Middle-right: Stays completely invisible across the center */
        rgba(0, 0, 0, 0.8) 100%   /* 4. Right edge: Fades back into shadow */), url(${bgImage})`
            }}
        >
            <Container className="h-100">
                <Row className="h-100 align-items-center">
                    <Col md={8} lg={6}>
                        <img
                            src={logoImage}
                            alt="BVLTRA Metrics Logo"
                            className="blend-logo"
                        />

                        {/* <p className="lead mt-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.5rem' }}> */}
                        <p className="lead mt-4 hero-description" style={{ paddingLeft: '10px', paddingRight: '40px' }}>
                            {/*AI generated placeholder text*/}
                            A refined nutritional index dedicated to the deconstruction of food into precise, quantitative data. {/* By stripping away marketing labels to reveal the underlying chemical and caloric structures, it provides a high-fidelity mirror for those seeking radical clarity in their consumption. It is less about dietary advice and more about the raw anatomy of what we ingest.*/}
                        </p>
                        {/* NEW: Added onClick routing to the button */}
                        <button onClick={() => navigate('/compare')} className="btn btn-light rounded-pill px-4 py-2 mt-4 fw-bold shadow-sm">
                            Explore the Data {/* PLACE HOLDER, DECIDE ON FUNTIONALITY */}
                        </button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Hero;