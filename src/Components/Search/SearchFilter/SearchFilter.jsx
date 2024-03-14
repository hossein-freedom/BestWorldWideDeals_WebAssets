'use strict';

import  Container  from 'react-bootstrap/Container';
import './SearchFilter.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import api from '../../../Utils/api/api';
import MultiRangeSlider from '../../Custom/multiRangeSelect/MultiRangeSlider'
import { isRejected } from '@reduxjs/toolkit';
import { isUserLoggedIn } from '../../../Utils/CommonUtils';

function SearchFilter(props){

    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(1000);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);

    const searchProps = useSelector((state) => state.searchTerm.value);

    useEffect(()=>{
        if(!props.smallView){
            refereshFilters();
        } else {
            setSelectedCategories(props.categories.selected);
            setSelectedSources(props.sources.selected);
            setFromPrice(props.price.fromPrice);
            setToPrice(props.price.toPrice);
            initiateSelectedSubCategories(props.categories.selected);
        }
    }, [searchProps])
      
    const initiateSelectedSubCategories = (selectedCategories) => {
        var tmpSelectedSubCategories = {};
        selectedCategories.map( category => {
            if(props.subCategories[category]){
                tmpSelectedSubCategories[category] = [];
                props.subCategories[category].forEach(subCategory=>
                    tmpSelectedSubCategories[category].push(subCategory)
                );
            }
        });
        props.updateFunctions.categories(selectedCategories);   
        setSelectedSubCategories(tmpSelectedSubCategories);
        props.updateFunctions.subCategories(tmpSelectedSubCategories);
    }

    const refereshFilters = () => {
        setFromPrice(0);
        setToPrice(1000);
        setSelectedCategories([]);
        setSelectedSources([]);
        setSelectedSubCategories([]);
        setIsRefresh(true);
    }
   
    const updateCategories = (checked, category) => {
        if (checked === true && !selectedCategories.includes(category)){
            selectedCategories.push(category);
            setSelectedCategories(selectedCategories);
            props.updateFunctions.categories(selectedCategories);   
            selectedSubCategories[category] = props.subCategories[category];
            setSelectedSubCategories(selectedSubCategories);
            props.updateFunctions.subCategories(selectedSubCategories);
        }else if (checked === false && selectedCategories.includes(category)){
            setSelectedCategories(selectedCategories.filter( cat => category !== cat ));
            props.updateFunctions.categories(selectedCategories.filter( cat => category !== cat ));
            delete selectedSubCategories[category];
            setSelectedSubCategories(selectedSubCategories);
            props.updateFunctions.subCategories(selectedSubCategories);
        }
        props.refresh.func(!props.refresh.key);
    }

    const updateSelectedSubCategories = (checked, category, subCategory) => {
        if (checked === true){
            if(!selectedCategories.includes(category)){
                selectedCategories.push(category);
                setSelectedCategories(selectedCategories);
                props.updateFunctions.categories(selectedCategories);
                selectedSubCategories[category] = [];
            } 
            selectedSubCategories[category].push(subCategory);
            setSelectedSubCategories(selectedSubCategories);
            props.updateFunctions.subCategories(selectedSubCategories);
        }else if (checked === false){ 
            if (selectedSubCategories[category] && selectedSubCategories[category].length === 1){
                setSelectedCategories(selectedCategories.filter( cat => category !== cat ));
                props.updateFunctions.categories(selectedCategories.filter( cat => category !== cat ));
                delete selectedSubCategories[category];
            }else{
                selectedSubCategories[category] = selectedSubCategories[category].filter(subCat => subCat !== subCategory);
            }
            setSelectedSubCategories(selectedSubCategories);
            props.updateFunctions.subCategories(selectedSubCategories);
        }
        props.refresh.func(!props.refresh.key);
    }

    const updateSource = (checked, selectedSource) => {
        if(checked){
            selectedSources.push(selectedSource);
            setSelectedSources(selectedSources);
            props.updateFunctions.resources(selectedSources);
        }else{
            setSelectedSources(selectedSources.filter( source => 
                source !== selectedSource
                ));
            props.updateFunctions.resources(selectedSources.filter( source => 
                source !== selectedSource
                ));
        }
    }


    const getCategorySection = (checked, category) => {
        return  <>
                {checked && 
                <Form.Check 
                    className="categoryTitle"
                    checked 
                    type="checkbox"
                    label={category}
                    onChange={(event) => updateCategories(event.target.checked, category)}
                />} 
                {!checked && 
                <Form.Check 
                    className="categoryTitle"
                    type="checkbox"
                    label={category}
                    onChange={(event) => updateCategories(event.target.checked, category)}
                />} 
                <div className="subCategroyDiv">
                {props.subCategories[category].map( subCategory => selectedSubCategories[category] && selectedSubCategories[category].includes(subCategory) ? 
                    <Form.Check 
                        checked 
                        type="checkbox"
                        label={subCategory}
                        onChange={(event) => updateSelectedSubCategories(event.target.checked, category, subCategory)}
                        /> :
                    <Form.Check  
                        type="checkbox"
                        label={subCategory}
                        onChange={(event) => updateSelectedSubCategories(event.target.checked, category, subCategory)}
                        />          
                )}
                </div>
                </>
    }

    return (
        <Container fluid className="searchFilterContainer" style={{padding:"0"}}>
            {!isLoading &&
            <Stack>
                <div className="filterGroup">
                    <p className="filterGroupTitle">
                        Filter By:
                    </p>
                </div>
                <div className="filterGroup">
                    <p className="filterGroupTitle">
                        Price Range:
                    </p>
                    <br />
                    <MultiRangeSlider
                        min={0}
                        max={1000}
                        curMin={props.price.fromPrice}
                        curMax={props.price.toPrice}
                        onChange={({ min, max }) => {
                            console.log(`min = ${min}, max = ${max}`)
                            setFromPrice(min);
                            props.updateFunctions.fromPrice(min);
                            setToPrice(max);   
                            props.updateFunctions.toPrice(max);
                        }}
                        isSmallFilterShow={props.smallView}
                        refresh={{
                            val: isRefresh,
                            func: setIsRefresh
                        }}    
                    />
                    <br />    
                </div>
                <div className="filterGroup">
                    <p className="filterGroupTitle">
                        Categories & Subcategories:
                    </p>
                    {
                        props.categories.values && props.categories.values.map( category =>
                            selectedCategories.includes(category) ?  
                                getCategorySection(true ,category)
                                :
                                getCategorySection(false ,category)
                        )
                    }    
                    <br />
                </div>
                <div className="filterGroup">
                    <p className="filterGroupTitle">
                        Source:
                    </p>
                    {props.sources.values.map( source => {
                        return selectedSources.includes(source) ? 
                                <Form.Check 
                                    checked 
                                    type="checkbox"
                                    label={source}
                                    onChange={(event) => updateSource(event.target.checked, source)}
                                    /> :
                                <Form.Check  
                                    type="checkbox"
                                    label={source}
                                    onChange={(event) => updateSource(event.target.checked, source)}
                                    />        
                    })}
                    <br />
                </div>
                {isUserLoggedIn() && 
                <>
                    <div className="filterGroup">
                        <p className="filterGroupTitle">
                            Activation Status:
                        </p>
                        <div key={"active-radio"} className="mb-3">
                            <Form.Check
                                label="Only Active"
                                name="group-1"
                                type="radio"
                                id={"active-radio-1"}
                                onChange={(e) =>  props.updateFunctions.activation(1)}
                            />
                            <Form.Check
                                label="Only Not Active"
                                name="group-1"
                                type="radio"
                                id={"active-radio-2"}
                                onChange={(e) => props.updateFunctions.activation(2)}
                            />
                        </div>
                    </div>
                    <div className="filterGroup">
                        <p className="filterGroupTitle">
                            Expiration Status:
                        </p>
                        <div key={"expired-radio"} className="mb-3">
                            <Form.Check
                                label="Only Expired"
                                name="group-2"
                                type="radio"
                                id={"expired-radio-1"}
                                onChange={(e) => props.updateFunctions.expiry(1)}
                            />
                            <Form.Check
                                label="Only Not Expired"
                                name="group-2"
                                type="radio"
                                id={"expired-radio-2"}
                                onChange={(e) => props.updateFunctions.expiry(2)}
                            />
                        </div>
                    </div>
                    <div className="filterGroup">
                        <Form.Check style={{marginTop: "5px", marginBottom: "15px"}}
                                    type="switch"
                                    label="Only Sale Products"
                                    id="no_radio"
                                    onChange={(e) => props.updateFunctions.sale(e.target.checked)}
                        />
                    </div>
                    </>                
                }
                <Button className="formButton"
                        onClick={()=> props.updateFunctions.search(false)} 
                        variant="primary" 
                        style={{"width":"80%","marginLeft":"auto","marginRight":"auto"}}>
                            Apply
                </Button>
            </Stack>}
        </Container>
    )
}

export default SearchFilter;