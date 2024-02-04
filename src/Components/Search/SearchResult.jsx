'use strict';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SearchResult.css';
import SearchFilter from './SearchFilter/SearchFilter';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../Utils/api/api';
import {prepareSearchFilter, prepareSearchFilterForAll} from './SearchUtils';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import { CATEGORY_SEARCH, QUERY_SEARCH, SEARCH_TERM, TERM_SEARCH } from '../../Utils/Constants';
import { useParams } from 'react-router-dom';



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
    const [queryCategories, setQueryCatgories] = useState([]);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const searchProps = useSelector((state) => state.searchTerm.value);
    const isFilterOpen = useSelector((state) => state.searchTerm.filterOpen);

    const { categoryName } = useParams();
    const { query } = useParams();
    
    const typeOfSearch = () =>{
        if (categoryName && window.location.href.includes("search")){
            return CATEGORY_SEARCH;
        }

        if (query && window.location.href.includes("search")){
            return QUERY_SEARCH;
        }

        if (window.location.href.includes("search")){
            return TERM_SEARCH;
        }
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

    // useEffect(() => {
    //     API.getData({
    //         url: "/getallproductsubcategories",
    //         params: {}
    //     }).then((response)=>{
    //         const data = response.data.data;
    //         setSubCatgories(data);
    //         setCatgories(Object.keys(data));
    //     });

    //     API.getData({
    //         url: "/getallproductsources",
    //         params: {}
    //     }).then((response)=>{
    //         const data = response.data.data;
    //         setResources(data);
    //     });
    // },[]);


    const getSearchFilterData = (isAll, searchFilter) => {
        if (isAll) {
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
        } else {
            API.postData({
                url: "/getcategorysubcategorybyFilter",
                params: searchFilter,
                contentType: "application/json"
            }).then((response)=>{
                const data = response.data.data;
                setSubCatgories(data);
                setCatgories(Object.keys(data));
            }).catch((error) => {
                console.log(error);
            });

            API.postData({
                url: "/getallproductsourcesbyfilter",
                params: searchFilter,
                contentType: "application/json"
            }).then((response)=>{
                const data = response.data.data;
                setResources(data);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

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


    const getSearchFilterFilter = () => {
        if (typeOfSearch() === TERM_SEARCH) { // if the search is test search, initiated from search bar.
            return  prepareSearchFilter(searchProps.searchType, 
                        searchProps.searchValue,
                        [],
                        {},
                        1000,
                        0,
                        []
                    )
        }
        if (typeOfSearch() === CATEGORY_SEARCH) { // if the search is category search, initiated from user clicking on menu item.
            return  prepareSearchFilter("", 
                        "",
                        [categoryName],
                        [],
                        {},
                        1000,
                        0,
                        []
                    );
        }

    }

    const getSearchFilter = (isFreshSearch) => {
        if (typeOfSearch() === TERM_SEARCH) { // if the search is test search, initiated from search bar.
            return  isFreshSearch === true ? 
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

        }
        if (typeOfSearch() === CATEGORY_SEARCH) { // if the search is category search, initiated from user clicking on menu item.
            return  prepareSearchFilter(searchProps.searchType, 
                        searchProps.searchValue,
                        [categoryName],
                        selectedSubCategories,
                        toPrice,
                        fromPrice,
                        selectedResources);

        }

    }

    const getSearchResults = (isFreshSearch) => {
        setKey(!key);
        setShow(false); // close the small filter menu
        var searchType = typeOfSearch();

        if(searchType === TERM_SEARCH && (!searchProps.searchType || !searchProps.searchValue)){
            return;
        }
        var searchFilter;
        if(categoryName === "All"){
            getSearchFilterData(true, {});   
            searchFilter = prepareSearchFilterForAll();
            //To Do: get all products with page number  
        }else{
            searchFilter = getSearchFilter(isFreshSearch);
            getSearchFilterData(false, getSearchFilterFilter());    
        }
        API.postData({
            url: "/getproducts",
            params: searchFilter,
            contentType: "application/json"
        }).then((response)=>{
            const items = response.data.data.products;
            setSearchData([...items]);
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <>
        {searchData.length === 0 && categories.length === 0 && Object.keys(subCategories).length === 0 &&  
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
        { windowSize.innerWidth < 992 && (searchData.length > 0 || categories.length > 0) &&  
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
                <Container fluid className="smallSearchResult">
                    {searchData.length === 0 && categories.length > 0 && 
                        <div className="searchNotFoundDiv">
                            <p className="notFoundTitle">
                            Hmmm.....
                            </p>
                            <p className="notFoundText">
                            Looks like we don't have any matches with selected filters. 
                            </p>
                            <p>
                                Please change some of the filters and try again.   
                            </p>
                        </div>
                    }  
                    {searchData.length > 0 && categories.length > 0 && 
                        <div className='searchResults'>
                            <h1>Found Result</h1>
                        </div>
                    }                        
                </Container>
            </section>
        }

        { windowSize.innerWidth >= 992 && (searchData.length > 0 || categories.length > 0) &&  
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
                    {searchData.length === 0 && categories.length > 0 && 
                        <div className='searchResults'>
                           <p className="notFoundTitle">
                            Hmmm.....
                            </p>
                            <p className="notFoundText">
                            Looks like we don't have any matches with selected filters. 
                            </p>
                            <p>
                                Please change some of the filters and try again.   
                            </p>
                        </div>
                    }  
                    {searchData.length > 0 && categories.length > 0 && 
                        <div className='searchResults'>
                            <h1>{searchProps.searchValue}</h1>
                        </div>
                    }
            </Row>
        </Container>
        }
        </>
    )
}

export default SearchResult;