'use strict';

import  Container  from 'react-bootstrap/Container';
import './SearchFilter.css';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';

import { Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import api from '../../../Utils/api/api';
import MultiRangeSlider from '../../Custom/multiRangeSelect/MultiRangeSlider'

function SearchFilter(props){

    const [fromPrice, setFromPrice] = useState(0);
    const [toPrice, setToPrice] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState(props.categories.selected);
    const [subCategories, setSubCategories] = useState(props.subCategories);
    const [selectedSubCategories, setSelectedSubCategories] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        initiateSelectedSubCategories(selectedCategories);
    },[])

    useEffect(()=>{
        props.refresh.func(!props.refresh.key);
    },[selectedCategories, selectedSubCategories])

    const initiateSelectedSubCategories = (categories) => {
        categories.map( category => {
                selectedSubCategories[category] = [];
                subCategories[category].forEach(subCategory=>
                    selectedSubCategories[category].push(subCategory)
                );
        });
        setSelectedSubCategories(selectedSubCategories);
    }
   
    const updateCategories = (checked, category) => {
        if (checked === true && !selectedCategories.includes(category)){
            selectedCategories.push(category);
            setSelectedCategories(selectedCategories);   
            selectedSubCategories[category] = subCategories[category];
            setSelectedSubCategories(selectedSubCategories);
        }else if (checked === false && selectedCategories.includes(category)){
            setSelectedCategories(selectedCategories.filter( cat => category !== cat ));
            delete selectedSubCategories[category];
            setSelectedSubCategories(selectedSubCategories);
        }
        props.refresh.func(!props.refresh.key);
    }

    const updateSelectedSubCategories = (checked, category, subCategory) => {
        if (checked === true){
            if(!selectedCategories.includes(category)){
                selectedCategories.push(category);
                selectedSubCategories[category] = [];
            } 
            selectedSubCategories[category].push(subCategory);
        }else if (checked === false){ 
            if (selectedSubCategories[category] && selectedSubCategories[category].length === 1){
                setSelectedCategories(selectedCategories.filter( cat => category !== cat ));
                delete selectedSubCategories[category];
            }else{
                selectedSubCategories[category] = selectedSubCategories[category].filter(subCat => subCat !== subCategory);
            }
            setSelectedSubCategories(selectedSubCategories);
        }
        props.refresh.func(!props.refresh.key);
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
                {subCategories[category].map( subCategory => selectedSubCategories[category] && selectedSubCategories[category].includes(subCategory) ? 
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
                        onChange={({ min, max }) => {
                            console.log(`min = ${min}, max = ${max}`)
                            setFromPrice(min);
                            setToPrice(max);   
                        }}
                        />
                    <br />    
                </div>
                <div className="filterGroup">
                    <p className="filterGroupTitle">
                        Categories & Subcategories:
                    </p>
                    {
                        props.categories.values.map( category =>
                            selectedCategories.includes(category) ?  
                                getCategorySection(true ,category)
                                :
                                getCategorySection(false ,category)
                        )
                    }    
                    <br />
                </div>
            </Stack>}
        </Container>
    )
}

export default SearchFilter;