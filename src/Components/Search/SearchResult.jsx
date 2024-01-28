'use strict';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SearchResult.css';
import SearchFilter from './SearchFilter/SearchFilter';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../Utils/api/api';
import {prepareSearchFilter} from './SearchUtils';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";

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
        API.getData({
            url: "/getallproductsubcategories",
            params: {}
        }).then((response)=>{
            const data = response.data.data;
            setSubCatgories(data);
            setCatgories(Object.keys(data));
        });

        API.getData({
            url: "/getallproductsources",
            params: {}
        }).then((response)=>{
            const data = response.data.data;
            setResources(data);
        });
    },[]);


    useEffect(() => {
        setSelectedCatgories([]);
        setSelectedSubCatgories([]);
        setSelectedResources([]);
        setToPrice(1000);
        setFromPrice(0);
    },[searchProps]);

    useEffect(() => {
        getSearchResults(true);
    },[searchProps]);

    const getSearchResults = (isFreshSearch) => {
        setKey(!key);
        setShow(false); // close the small filter menu
        if(!searchProps.searchType || !searchProps.searchValue){
            return;
        }
        const searchFilter = isFreshSearch === true ? 
                                            prepareSearchFilter(searchProps.searchType, 
                                                searchProps.searchValue,
                                                [],
                                                {},
                                                1000,
                                                0,
                                                []
                                                )
                                            :
                                            prepareSearchFilter(searchProps.searchType, 
                                                searchProps.searchValue,
                                                selectedCategories,
                                                selectedSubCategories,
                                                toPrice,
                                                fromPrice,
                                                selectedResources);     
        console.log("Searching for New Results");
        API.postData({
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
        {searchData.length == 0 && 
            <Container fluid className="searcResultContainer">
                <div className="searchNotFoundDiv">
                    <p className="notFoundTitle">
                      Hmmm.....
                    </p>
                    <p className="notFoundText">
                       Looks like we don't have any matches for <b>"{searchProps.searchValue}"</b> 
                    </p>
                    <p>
                        Please check the spelling, try a more general term or check specific product category page.   
                    </p>
                </div>
                {/* To Do : Add list of close products or some other suggestions here.*/}
            </Container>
        }
        { windowSize.innerWidth < 992 && searchData.length > 0 && 
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
                                            values: categories,
                                            selected:selectedCategories
                                        }}
                                        subCategories={subCategories}
                                        sources={{
                                            values:resources,
                                            selected: selectedResources
                                        }}
                                        price={{
                                            fromPrice: fromPrice,
                                            toPrice: toPrice
                                        }}
                                        smallView={true}
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

        { windowSize.innerWidth >= 992 && searchData.length > 0 &&  
        <Container fluid className="searcResultContainer">
            <Row>
                    <div className='searchResultsFilter'>
                        <SearchFilter
                          categories={{
                            values: categories,
                            selected:selectedCategories
                          }}
                          subCategories={subCategories}
                          sources={{
                            values:resources,
                            selected: selectedResources
                          }}
                          price={{
                            fromPrice: fromPrice,
                            toPrice: toPrice
                          }}
                          smallView={false}
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