'use strict';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SearchResult.css';
import SearchFilter from './SearchFilter/SearchFilter';
import React, { useEffect, useState } from 'react';


function SearchResult(){

    const [key, setKey] = useState(true);

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
                          refresh={{key:key, func: setKey}}
                        />
                    </div>
                </Col>
                <Col lg={10}>
                    <div className='searchResults'>

                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default SearchResult;