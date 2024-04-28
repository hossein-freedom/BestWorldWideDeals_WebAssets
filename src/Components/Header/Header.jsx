'use strict';

import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { updateSearchTerm } from '../Reducers/SearchReducer'
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
import { faSearch, faSliders} from "@fortawesome/free-solid-svg-icons";
import API from '../../Utils/api/api'; 
import { SEARCH_TERM } from '../../Utils/Constants';
import { useDispatch } from 'react-redux';


function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}

function Header() {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [selected, setSelected] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const currentUrl = window.location.href;

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    getMenuData();
  }, []);

  const getMenuData = () => {
    API.getData({
      url: "/getallproductsubcategories",
      params: {}
  }).then((response)=>{
      const data = response.data.data;
      const menuList = [
        {
          item:"Home",
          link:"/",
          children:[]       
        },
        {
          item:"All Products",
          link:"/search/category/All",
          children:[]       
        }
      ];
      const categories = Object.keys(data);
      const menuItems = 1;
      var moreItems = undefined; 
      for(let i=0 ; i<categories.length ; i++){
          if(i >= menuItems){
                if(moreItems===undefined){
                  moreItems = {
                    item:"More",
                    link:"",
                    children:[]
                  };
                }
                moreItems.children.push(
                    {
                      item:categories[i],
                      link:`/search/category/${categories[i]}`
                    }
                );
          }else{
            menuList.push(
              {
                item:categories[i],
                link:`/search/category/${categories[i]}`,
                children:[]
              }
            );
          }
      }
      if(moreItems){
        menuList.push(moreItems);
      }
      setMenuData(menuList);
    });
  }

  const search = () => {
    if(selected.length == 0 && searchInput.length == 0 ){
        return;
    }
    if(selected.length > 0){
      dispatch(updateSearchTerm({searchType:"exact",searchValue:selected[0]}));
    }else if(searchInput.length > 0){
      dispatch(updateSearchTerm({searchType:"partial",searchValue:searchInput}));
    }
    navigate("/search");
  }

  const updateSearchItems = (text) => {
      setSearchInput(text);
      const searchFilter = {
        page: {
          pageNumber: 0,
          pageSize: 500
        },
        predicateNode: {
          leftFilterNode: {
            filters: [
              {
                fieldName: "title",
                fieldValue: `%${text}%`,
                isNegate: false,
                operator: "LIKE"
              },
              {
                fieldName: "title",
                fieldValue: `${text}%`,
                isNegate: false,
                operator: "LIKE"
              },
              {
                fieldName: "title",
                fieldValue: `%${text}`,
                isNegate: false,
                operator: "LIKE"
              },
              {
                fieldName: "title",
                fieldValue: `${text}`,
                isNegate: false,
                operator: "LIKE"
              }
            ],
            operand: "OR"
          },
          operand: "AND",
          rightFilterNode: null
        },
        searchType:"FILTERED",
        sort: {
          fieldName: "title",
          isAsc: true
        }
      };

      API.postData({
          url: "/getproducts",
          params: searchFilter,
          contentType: "application/json"
      }).then((response)=>{
          const items = new Set();
          const data = response.data.data.products;
          data.forEach(item => items.add(item.title));
          setSearchData([...items]);
      }).catch((error) => {
          console.log(error);
      });
  }

  return (
    windowSize.innerWidth >= 992 ? 
              <>
              <section style={{"position":"fixed", "width":"100%", "top":"0", "z-index":"10000"}}>
                <Navbar bg="white" expand="lg">
                  <Container fluid className="headerContainer">
                    <Navbar.Brand href="#">
                      <Logo/>
                    </Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
                    <Typeahead
                      id="search-bar"
                      options={searchData}
                      placeholder="Choose a state..."
                      onChange={setSelected}
                      onInputChange={text => {updateSearchItems(text)}}
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
                  <Container fluid className="headerContainer">
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
                <section style={{"position":"fixed", "width":"100%", "top":"0", "z-index":"10000"}}>
                  <Navbar bg="white" expand="lg">
                    <Container fluid className="headerContainer">
                      <Navbar.Brand href="#">
                        <Logo/>
                      </Navbar.Brand>
                      <Navbar.Toggle aria-controls="`offcanvasNavbar-expand" />
                      <Navbar.Offcanvas
                          id={`offcanvasNavbar-expand`}
                          aria-labelledby="offcanvasNavbarLabel-expand"
                          placement="end"
                          style={{"z-index":"12000"}}
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
                          onInputChange={text => {updateSearchItems(text)}}
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
                </section>
              </>
  );
}

export default Header;