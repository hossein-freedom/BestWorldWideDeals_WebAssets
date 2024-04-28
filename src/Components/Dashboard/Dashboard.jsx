'use strict';

import constants from './DashboardConfig'
import './Dashboard.css'
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';



function Dashboard(){
    const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

    const carouselItems = [
        {
            itemStyle: { 
                backgroundImage: `url(${require('../../Images/Dashboard/Carousel/Image1-1.jpg')})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            },
            caption: "First slide label",
            description: "Nulla vitae elit libero, a pharetra augue mollis interdum."
        },
        {
            itemStyle: { 
                backgroundImage: `url(${require('../../Images/Dashboard/Carousel/Image2.jpg')})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            },
            caption: "Second slide label",
            description: "Nulla vitae elit libero, a pharetra augue mollis interdum."
        }
    ];
   

    return (
        <Container fluid className="carouselWrapper">
                <Carousel activeIndex={index} onSelect={handleSelect} id="myCarousel">
                {  carouselItems.map( carouselItem => { 
                        return(       
                                <Carousel.Item className="customCarouselItem" style={carouselItem.itemStyle}>
                                    <Carousel.Caption className="right-caption">
                                        <h3>{carouselItem.caption}</h3>
                                        <p>{carouselItem.description}</p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                        )
                    })
                }
                </Carousel>
            {/* <div className="dashCont">
            </div> */}
        </Container>
    );
}

export default Dashboard;