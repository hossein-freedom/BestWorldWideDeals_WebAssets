'use strict';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SearchResult.css';
import SearchFilter from './SearchFilter/SearchFilter';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../Utils/api/api';


function SearchResult(props){
    
    const searchProps = useSelector((state) => state.searchTerm.value);
    const [key, setKey] = useState(true);
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        getSearchResults();
    },[searchProps]);
    
    const prepareSearchFilter = () => {
            if(searchProps.searchType == "exact"){
                return  {
                            page: {
                            pageNumber: 0,
                            pageSize: 500
                            },
                            predicateNode: {
                            leftFilterNode: {
                                filters: [
                                {
                                    fieldName: "title",
                                    fieldValue: `${searchProps.searchValue}`,
                                    isNegate: false,
                                    operator: "EQUAL"
                                }
                                ],
                                operand: "OR"
                            },
                            operand: "AND",
                            rightFilterNode: null
                            },
                            sort: {
                            fieldName: "title",
                            isAsc: true
                            }
                        };
            }
    };

    const getSearchResults = () => {
        const searchFilter = prepareSearchFilter();
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

    return (
        <Container fluid className="searcResultContainer">
            <Row>
                <Col>
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
                        />
                    </div>
                </Col>
                <Col lg={10}>
                    <div className='searchResults'>
                          <h1>{searchProps.searchValue}</h1>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default SearchResult;