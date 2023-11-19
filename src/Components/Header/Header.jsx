'use strict';

import React, { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from './Logo'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "./Header.css"
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const menuData = [
  {
    item:"All",
    link:"",
    children:[]       
  },
  {
    item:"Health",
    link:"",
    children:[]       
  },
  {
    item:"Fitness",
    link:"",
    children:[]       
  },
  {
    item:"More",
    link:"",
    children:[
      {
        item:"Home",
        link:""       
      },
      {
        item:"Garden",
        link:"",      
      }       
    ]
  }
]

const searchData = [
  {
    label: 'Alabama',
    population: 4780127,
    capital: 'Montgomery',
    region: 'South',
  },
  { label: 'Alaska', population: 710249, capital: 'Juneau', region: 'West' },
  { label: 'Arizona', population: 6392307, capital: 'Phoenix', region: 'West' },
  {
    label: 'Arkansas',
    population: 2915958,
    capital: 'Little Rock',
    region: 'South',
  },
  {
    label: 'California',
    population: 37254503,
    capital: 'Sacramento',
    region: 'West',
  },
  { label: 'Colorado', population: 5029324, capital: 'Denver', region: 'West' },
  {
    label: 'Connecticut',
    population: 3574118,
    capital: 'Hartford',
    region: 'Northeast',
  },
  { label: 'Delaware', population: 897936, capital: 'Dover', region: 'South' },
  {
    label: 'Florida',
    population: 18804623,
    capital: 'Tallahassee',
    region: 'South',
  },
  {
    label: 'Georgia',
    population: 9688681,
    capital: 'Atlanta',
    region: 'South',
  },
  { label: 'Hawaii', population: 1360301, capital: 'Honolulu', region: 'West' },
  { label: 'Idaho', population: 1567652, capital: 'Boise', region: 'West' },
  {
    label: 'Illinois',
    population: 12831549,
    capital: 'Springfield',
    region: 'Midwest',
  },
  {
    label: 'Indiana',
    population: 6484229,
    capital: 'Indianapolis',
    region: 'Midwest',
  },
  {
    label: 'Iowa',
    population: 3046869,
    capital: 'Des Moines',
    region: 'Midwest',
  },
  {
    label: 'Kansas',
    population: 2853132,
    capital: 'Topeka',
    region: 'Midwest',
  },
  {
    label: 'Kentucky',
    population: 4339349,
    capital: 'Frankfort',
    region: 'South',
  },
  {
    label: 'Louisiana',
    population: 4533479,
    capital: 'Baton Rouge',
    region: 'South',
  },
  {
    label: 'Maine',
    population: 1328361,
    capital: 'Augusta',
    region: 'Northeast',
  },
  {
    label: 'Maryland',
    population: 5773785,
    capital: 'Annapolis',
    region: 'South',
  },
  {
    label: 'Massachusetts',
    population: 6547817,
    capital: 'Boston',
    region: 'Northeast',
  },
  {
    label: 'Michigan',
    population: 9884129,
    capital: 'Lansing',
    region: 'Midwest',
  },
  {
    label: 'Minnesota',
    population: 5303925,
    capital: 'Saint Paul',
    region: 'Midwest',
  },
  {
    label: 'Mississippi',
    population: 2968103,
    capital: 'Jackson',
    region: 'South',
  },
  {
    label: 'Missouri',
    population: 5988927,
    capital: 'Jefferson City',
    region: 'Midwest',
  },
  { label: 'Montana', population: 989417, capital: 'Alberta', region: 'West' },
  {
    label: 'Nebraska',
    population: 1826341,
    capital: 'Lincoln',
    region: 'Midwest',
  },
  {
    label: 'Nevada',
    population: 2700691,
    capital: 'Carson City',
    region: 'West',
  },
  {
    label: 'New Hampshire',
    population: 1316466,
    capital: 'Concord',
    region: 'Northeast',
  },
  {
    label: 'New Jersey',
    population: 8791936,
    capital: 'Trenton',
    region: 'Northeast',
  },
  {
    label: 'New Mexico',
    population: 2059192,
    capital: 'Santa Fe',
    region: 'West',
  },
  {
    label: 'New York',
    population: 19378087,
    capital: 'Albany',
    region: 'Northeast',
  },
  {
    label: 'North Carolina',
    population: 9535692,
    capital: 'Raleigh',
    region: 'South',
  },
  {
    label: 'North Dakota',
    population: 672591,
    capital: 'Bismarck',
    region: 'Midwest',
  },
  {
    label: 'Ohio',
    population: 11536725,
    capital: 'Columbus',
    region: 'Midwest',
  },
  {
    label: 'Oklahoma',
    population: 3751616,
    capital: 'Oklahoma City',
    region: 'South',
  },
  { label: 'Oregon', population: 3831073, capital: 'Salem', region: 'West' },
  {
    label: 'Pennsylvania',
    population: 12702887,
    capital: 'Harrisburg',
    region: 'Northeast',
  },
  {
    label: 'Rhode Island',
    population: 1052931,
    capital: 'Providence',
    region: 'Northeast',
  },
  {
    label: 'South Carolina',
    population: 4625401,
    capital: 'Columbia',
    region: 'South',
  },
  {
    label: 'South Dakota',
    population: 814191,
    capital: 'Pierre',
    region: 'Midwest',
  },
  {
    label: 'Tennessee',
    population: 6346275,
    capital: 'Nashville',
    region: 'South',
  },
  { label: 'Texas', population: 25146105, capital: 'Austin', region: 'South' },
  {
    label: 'Utah',
    population: 2763888,
    capital: 'Salt Lake City',
    region: 'West',
  },
  {
    label: 'Vermont',
    population: 625745,
    capital: 'Montpelier',
    region: 'Northeast',
  },
  {
    label: 'Virginia',
    population: 8001045,
    capital: 'Richmond',
    region: 'South',
  },
  {
    label: 'Washington',
    population: 6724543,
    capital: 'Olympia',
    region: 'West',
  },
  {
    label: 'West Virginia',
    population: 1853011,
    capital: 'Charleston',
    region: 'South',
  },
  {
    label: 'Wisconsin',
    population: 5687289,
    capital: 'Madison',
    region: 'West',
  },
  { label: 'Wyoming', population: 563767, capital: 'Cheyenne', region: 'West' },
];

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

function Header() {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const search = () => {console.log(selected)}
  return (
    windowSize.innerWidth >= 992 ? 
              <>
              <section style={{"position":"fixed", "width":"100%", "top":"0", "z-index":"10000"}}>
                <Navbar bg="white" expand="lg">
                  <Container fluid>
                    <Navbar.Brand href="#">
                      <Logo/>
                    </Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
                    <Typeahead
                      id="search-bar"
                      options={searchData}
                      placeholder="Choose a state..."
                      onChange={setSelected}
                      selected={selected}
                    >
                      <div className="rbt-aux">
                          <button className="close" aria-label="Clear" onClick={search} type="button">
                            <FontAwesomeIcon icon={faSearch}/>
                          </button>
                      </div>
                    </Typeahead>
                    <Button className="favouriteButt">
                      <span>0</span>
                    </Button>
                  </Container>
                </Navbar>
                <Navbar bg="hossein" expand="lg" className="menuNavbar">
                  <Container fluid>
                    <Nav
                        className="menubar"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    > 
                      {menuData.map(item =>  item.children == 0 ?   
                                  <Nav.Link href={item.link}>{item.item}</Nav.Link> :
                                  <NavDropdown title={item.item} id="basic-nav-dropdown">
                                      {item.children.map( child => 
                                                    <NavDropdown.Item href={child.link}>{child.item}</NavDropdown.Item>)}
                                  </NavDropdown>)}
                      
                    </Nav> 
                  </Container>
                </Navbar>
                </section>
              </> :
              <>
                <Navbar bg="white" expand="lg">
                  <Container fluid>
                    <Navbar.Brand href="#">
                      <Logo/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="`offcanvasNavbar-expand" />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand`}
                        aria-labelledby="offcanvasNavbarLabel-expand"
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title id={`offcanvasNavbarLabel-expand`}>
                            <Button className="smallFavouriteButt">
                              <span>0</span>
                            </Button> 
                          </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <Nav
                              className="smallMenubar"
                              style={{ maxHeight: '100px' }}
                          > 
                            {menuData.map(item =>  item.children == 0 ?   
                                        <Nav.Link href={item.link}>{item.item}</Nav.Link> :
                                        <NavDropdown title={item.item} id="basic-nav-dropdown">
                                            {item.children.map( child => 
                                                          <NavDropdown.Item href={child.link}>{child.item}</NavDropdown.Item>)}
                                        </NavDropdown>)}
                            
                          </Nav>
                        </Offcanvas.Body>  
                    </Navbar.Offcanvas>
                  </Container>
                </Navbar>
                <Navbar bg="hossein" expand="lg" className="menuNavbar">
                  <Container fluid>
                    <Typeahead
                        id="small-search-bar"
                        options={searchData}
                        placeholder="Choose a state..."
                        onChange={setSelected}
                        selected={selected}
                    >
                      <div className="rbt-aux">
                          <button className="close" aria-label="Clear" onClick={search} type="button">
                            <FontAwesomeIcon icon={faSearch}/>
                          </button>
                      </div>
                    </Typeahead>
                  </Container>
                </Navbar>
              </>
  );
}

export default Header;