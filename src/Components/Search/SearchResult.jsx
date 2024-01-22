'use strict';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SearchResult.css';
import SearchFilter from './SearchFilter/SearchFilter';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../Utils/api/api';
import {prepareSearchFilter} from './SearchUtils';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders} from "@fortawesome/free-solid-svg-icons";

function SearchResult(props){

    const [show, setShow] = useState(false);
    const [key, setKey] = useState(true);
    const [searchData, setSearchData] = useState([]);
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(1000);
    const [resources, setResources] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    const [categories, setCatgories] = useState([]);
    const [selectedCategories, setSelectedCatgories] = useState([]);
    const [subCategories, setSubCatgories] = useState({});
    const [selectedSubCategories, setSelectedSubCatgories] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const searchProps = useSelector((state) => state.searchTerm.value);
    const isFilterOpen = useSelector((state) => state.searchTerm.filterOpen);
    
    const isSearch = () =>{
        return window.location.href.includes("admin");
    }
    
    useEffect(() => {
        function handleWindowResize() {
          setWindowSize(getWindowSize());
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }
  
    useEffect(() => {
        getSearchResults();
    },[searchProps]);


    const getSearchResults = () => {
        setShow(false); // close the small filter menu
        if(!searchProps.searchType || !searchProps.searchValue){
            return;
        }
        const searchFilter = prepareSearchFilter(searchProps.searchType, 
                                                 searchProps.searchValue,
                                                 selectedCategories,
                                                 selectedSubCategories,
                                                 toPrice,
                                                 fromPrice,
                                                 selectedResources);
        console.log("Searching for New Results");
        api.postData({
            url: "/getproductsbyfilter",
            params: searchFilter,
            contentType: "application/json"
        }).then((response)=>{
            const items = response.data.data;
            setSearchData([...items]);
        }).catch((error) => {
            console.log(error);
        });
    };

    const getResultsByFilters = (textFilter, page) => {

    };

    return (
        <>
        { windowSize.innerWidth < 992 && 
            <section style={{"position":"relative", "top":"0","width":"100%"}}>
                <Navbar bg="small-extra-nav" expand="lg" className="smallExtraNavbar">
                    <Container fluid>
                        <Navbar.Toggle 
                            aria-controls={`offcanvasNavbar-expand`} 
                            className="filterIcon"
                            onClick={handleShow}
                        >
                            <div class="filterIcon">
                                <FontAwesomeIcon icon={faSliders} /> Filters
                            </div>
                        </Navbar.Toggle>
                        <Navbar.Offcanvas
                            show={show}
                            onHide={handleClose}
                            id={`offcanvasNavbar-expand`}
                            aria-labelledby={`offcanvasNavbarLabel-expand`}
                            placement="end"
                            style={{"z-index":"12000"}}
                        >
                            <Offcanvas.Header closeButton>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div>
                                    <SearchFilter
                                        categories={{
                                            values:["test3","test777"],
                                            selected:["test3"]
                                        }}
                                        subCategories={{
                                            test3:["test1","test2","test3","test4"],
                                            test777:["test71","test72","test73"]
                                        }}
                                        sources={["Amazon","ClickBank"]}
                                        refresh={{key:key, func: setKey}}
                                        updateFunctions={{  categories: setSelectedCatgories,
                                                            subCategories: setSelectedSubCatgories,
                                                            toPrice: setToPrice,
                                                            fromPrice: setFromPrice,
                                                            resources: setSelectedResources,
                                                            search: getSearchResults  
                                                        }}
                                        />
                                </div>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            </section>
        }

        { windowSize.innerWidth >= 992 && 
        <Container fluid className="searcResultContainer">
            <Row>
                    <div className='searchResultsFilter'>
                        <SearchFilter
                          categories={{
                            values:["test3","test777"],
                            selected:["test3"]
                          }}
                          subCategories={{
                            test3:["test1","test2","test3","test4"],
                            test777:["test71","test72","test73"]
                          }}
                          sources={["Amazon","ClickBank"]}
                          refresh={{key:key, func: setKey}}
                          updateFunctions={{  categories: setSelectedCatgories,
                                              subCategories: setSelectedSubCatgories,
                                              toPrice: setToPrice,
                                              fromPrice: setFromPrice,
                                              resources: setSelectedResources,
                                              search: getSearchResults    
                                            }}
                        />
                    </div>
                    <div className='searchResults'>
                        <h1>{searchProps.searchValue}</h1>
                    </div>
            </Row>
        </Container>
        }
        </>
    )
}

export default SearchResult;