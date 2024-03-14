
'use strict';

import { Button, Card, Carousel, Container, Nav } from "react-bootstrap";
import React, { useState } from 'react';
import './SearchResultItem.css'


function SearchResultItem(props){

    const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

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
                <Carousel activeIndex={index} onSelect={handleSelect}>
                {  carouselItems.map( carouselItem => { 
                        return(       
                                <Carousel.Item className="customItem" style={carouselItem.itemStyle}>
                                </Carousel.Item>
                        )
                    })
                }
                </Carousel>
                </Card.Header>
                <Card.Body>
                    <Card.Title>Special title treatment</Card.Title>
                    <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
                </Card>
    );
}

export default SearchResultItem;