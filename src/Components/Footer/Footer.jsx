'use strict';

import { Button, Col, Container, Form, FormControl, InputGroup, Row, Stack } from "react-bootstrap";
import "./Footer.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faInstagram, faSquareTwitter} from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";


function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

function Footer() {
   
    const [windowSize, setWindowSize] = useState(getWindowSize());
      
    useEffect(() => {

        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
      
        window.addEventListener('resize', handleWindowResize);
      
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
      
    const getColSize = () => {

        if (windowSize.innerWidth >= 900) {
            return 3;
        }else{
            return 12;
        }
    }

    return (
        <>
        <section className="footerSection">
            <Container fluid className="footerContainer">
                <Row>
                    <Col xs={getColSize()+1} className="socialMediaCol">
                        <div className="footerCol">
                            <Stack>
                                <p style={{"marginBottom":"0px"}}>Follow us:</p>
                                <Row className="socialMediaRow">
                                    <Col className="socialMediaCol"><FontAwesomeIcon icon={faSquareFacebook} /></Col>
                                    <Col className="socialMediaCol"><FontAwesomeIcon icon={faInstagram} /></Col>
                                    <Col className="socialMediaCol"><FontAwesomeIcon icon={faSquareTwitter}/></Col>
                                </Row>
                            </Stack>  
                        </div>
                    </Col>
                    <Col xs={getColSize()+3} className="emailCol">
                        <Stack>
                            <div className="footerCol">
                            <p style={{"marginBottom":"10px"}}>Let's stay connected:</p>
                            <p style={{"marginBottom":"10px"}} className="footerNote">Enter your email to receive the latest deals and offers.</p>
                            <InputGroup className="mb-3 emailInput">
                                <Form.Control
                                    placeholder="Enter your email..."
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    />
                                <Button variant="outline-secondary" id="emailButton">
                                    Submit
                                </Button>
                            </InputGroup>
                            </div>
                        </Stack>
                    </Col>
                    
                </Row>
                <div className="copyRightNote">&copy; Copyright 2024, Bestworldwidedeals.com</div>
            </Container>
        </section>
       </>
    );

}

export default Footer;