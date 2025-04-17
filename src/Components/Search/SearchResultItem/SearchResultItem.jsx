
'use strict';

import { Button, Card, Carousel, Container, Nav } from "react-bootstrap";
import React, { useState } from 'react';
import './SearchResultItem.css'


function SearchResultItem(props){

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const formatDescription = (description) => {
        return description.substring(0, 100)+" ....";
    }

    const carouselItems = [
        {
            itemStyle: { 
                backgroundImage: `url(${require('../../../Images/Dashboard/Carousel/Image1-1.jpg')})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            },
            caption: "First slide label",
            description: "Nulla vitae elit libero, a pharetra augue mollis interdum."
        },
        {
            itemStyle: { 
                backgroundImage: `url(${require('../../../Images/Dashboard/Carousel/Image2.jpg')})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            },
            caption: "Second slide label",
            description: "Nulla vitae elit libero, a pharetra augue mollis interdum."
        }
    ];

    return (
         <Card  className="resultCard">
                <Card.Header>
                    <Carousel activeIndex={index} onSelect={handleSelect} className="itemCarousel" style={{"box-shadow": "none"}}>
                    { props.product["imageLinks"] && props.product["imageLinks"].map( image => {
                            var itemStyle = { 
                                backgroundImage: `url(${image["imageLink"]})`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }
                            return(       
                                    <Carousel.Item className="customItem" style={itemStyle}>
                                    </Carousel.Item>
                            )
                        })
                    }
                    </Carousel>
                </Card.Header>
                <Card.Body className="resultItemCard">
                    <Card.Title className="resultItemTitle">{props.product.title}</Card.Title>
                    <Card.Text className="resultItemText">
                        {props.product.description}
                    </Card.Text>    
                        <Card.Text className="resultItemPrice">
                            <span className="originalPrice">${props.product.price}</span> 
                            {props.product.isOnSale &&  <span className="salePrice">Was ${props.product.salePrice}</span>}
                        </Card.Text> 
                </Card.Body>
                <Button onClick={() => window.open(props.product.affiliateLink, "_blank")} id="dealButton" className="learnMoreButt" variant="primary">Learn More</Button>
        </Card>
    );
}

export default SearchResultItem;