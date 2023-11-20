'use strict';

import './AdminProduct.css'
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { PRODUCT_SOURCES } from '../../../Utils/Constants';
import * as formik from 'formik';
import * as yup from 'yup';
import { useRef } from "react";
import { CloseButton, ListGroup } from 'react-bootstrap';
import API from '../../../Utils/api/api'; 


function AdminProduct(){

    const [categories, setCategories] = useState([]);
    const [isCategoryInputActive, setIsCategoryInputActive] = useState(false);
    const [isSubCategoryInputActive, setIsSubCategoryInputActive] = useState(false);
    const [subCategories, setSubCategories] = useState([]);


    useEffect(() => {
        API.getData({
            url: "/getproductcategories",
            params: {}
        }).then((response)=>{
            setCategories(response.data.data);
        })
    },[])

    const fileRef = useRef();

    const getSubCategories = (category) => {
        API.getData({
            url: `/getproductsubcategories/${category}`,
            params: {}
        }).then((response)=>{
            setSubCategories(response.data.data);
        })
    } 

    const handleSubmit = (values) => {
        console.log(values);
    }
  
    const { Formik } = formik;

    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
        category: yup.string().required().matches(/^((?!none).)*$/gm),
        othercategory: yup.string().when('category',{
              is: (value) => ["Other"].includes(value),
              then: () => yup.string().required(),
              otherwise: () => yup.string(),
        }),
        subcategory: yup.string().required().matches(/^((?!none).)*$/gm),
        othersubcategory: yup.string().when('subcategory',{
              is: (value) => ["Other"].includes(value),
              then: () => yup.string().required(),
              otherwise: () => yup.string(),    
        }),
        email: yup.string().required().email("Invalid Email"),
        websitelink: yup.string(),
        affiliatelink: yup.string().required(),
        expirydate: yup.string().required(),
        source: yup.string().required().matches(/^((?!none).)*$/gm),
        isactive: yup.bool(),
        price: yup.number(),
        isonsale: yup.bool(),
        saleprice: yup.number(),
        hasbannercode: yup.bool(),
        bannercode: yup.string(),
        files: yup.mixed()
                .test("files_length", "You can only select up to 5 files", 
                        function(value) {
                            if(value.length > 5){
                                return false;
                            }else{
                                return true;
                            }
                        })
                .test("files_type", "You can only select image files", 
                        function(value) {
                            if(Object.values(value).filter((file)=>{
                                            return ["image/jpeg","image/png","image/jpg","image/gif"].includes(file.type);         
                                }).length < value.length){
                                return false;
                            }else{
                                return true;
                            }
                        })        
                .required()        

    });

    return (
        <Container fluid className="adminProduct">
            <div className='productDiv'>
            <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                    title: '',
                    description: '',
                    category: '',
                    othercategory: '',
                    subcategory: '',
                    othersubcategory: '',
                    email: '',
                    websitelink: '',
                    affiliatelink: '',
                    expirydate: '',
                    source:'',
                    isactive: false,
                    price: 0.0,
                    isonsale: false,
                    saleprice: 0.0,
                    hasbannercode: false,
                    bannercode: '',
                    files: []
                }}
                >
                {({ handleSubmit, handleChange,  setFieldValue, values, touched, errors }) => (
                <Form className='form' noValidate onSubmit={handleSubmit}>
                    <Form.Group lassName="mb-3" controlId="validationFormik03">
                        <Form.Label className='formLabel'>Title</Form.Label>
                        <Form.Control
                            className='formControl' 
                            type="text"
                            placeholder="Enter Title"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            isInvalid={touched.title && !!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="validationFormik04">
                        <Form.Label className='formLabel'>Description</Form.Label>
                        <Form.Control className='formControl' 
                                      as="textarea"
                                      row={4}
                                      placeholder="Enter description" 
                                      name="description"
                                      value={values.description}
                                      onChange={handleChange}
                                      isInvalid={touched.description && !!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" ontrolId="validationFormik05">
                            <Form.Label className='formLabel'>Category</Form.Label>
                            <Form.Select className='formControl'
                                        name="category"
                                        value={values.category}   
                                        onChange = {(e) => { 
                                                         handleChange(e);   
                                                         if(e.currentTarget.value === "Other"){
                                                            setIsCategoryInputActive(true);
                                                         }else{
                                                            getSubCategories(e.currentTarget.value);
                                                            setIsCategoryInputActive(false);
                                                            setFieldValue("othercategory",'');
                                                         }
                                                        }
                                                    }
                                        isInvalid={touched.category && !!errors.category} >
                                <option selected value="none">Select a category</option>                        
                                {categories.map((s)=> <option value={s}>{s}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                You must select a category
                            </Form.Control.Feedback>
                            { isCategoryInputActive && 
                                <Form.Control className='formControl'
                                            name="othercategory"
                                            value={values.othercategory} 
                                            onChange={handleChange}
                                            style={{marginTop:"20px"}} 
                                            type="text" 
                                            placeholder="Enter new category"
                                            isInvalid={touched.othercategory && !!errors.othercategory}
                                            />
                            }
                            { isCategoryInputActive &&
                                <Form.Control.Feedback type="invalid">
                                    This field is required if you select other as Category
                                </Form.Control.Feedback> }
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Sub Category</Form.Label>
                            <Form.Select className='formControl'
                                        name="subcategory"
                                        value={values.subcategory}   
                                        onChange = {(e) => { 
                                                        handleChange(e);
                                                         if(e.currentTarget.value === "Other"){
                                                             setIsSubCategoryInputActive(true);
                                                         }else{
                                                             setIsSubCategoryInputActive(false);
                                                             setFieldValue("othersubcategory",'');
                                                         }
                                                        }
                                                    }
                                        isInvalid={touched.subcategory && !!errors.subcategory}>
                                <option value="none">Select a Sub Category</option>                        
                                {subCategories.map(s=> <option value={s}>{s}</option>)}
                                <option value="Other">Other</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                You must select a subcategory
                            </Form.Control.Feedback>
                            {isSubCategoryInputActive && 
                                <Form.Control className='formControl'
                                        name="othersubcategory"
                                        value={values.othersubcategory} 
                                        onChange={handleChange}
                                        style={{marginTop:"20px"}} 
                                        type="text" 
                                        placeholder="Enter new Sub Category"
                                        isInvalid={touched.othersubcategory && !!errors.othersubcategory}/>
                            }
                            {isSubCategoryInputActive && 
                                    <Form.Control.Feedback type="invalid">
                                        This field is required if you select other as subcategory
                                    </Form.Control.Feedback>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Email address</Form.Label>
                        <Form.Control   className='formControl' 
                                        name="email"
                                        value={values.email} 
                                        onChange={handleChange}
                                        type="email" 
                                        placeholder="Enter email" 
                                        isInvalid={touched.email && !!errors.email}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>                
                                        
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Website Link</Form.Label>
                        <Form.Control   className='formControl' 
                                        name="websitelink"
                                        value={values.websitelink} 
                                        onChange={handleChange}
                                        type="text" 
                                        placeholder="Enter website link" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Affiliate Link</Form.Label>
                        <Form.Control   className='formControl' 
                                        name="affiliatelink"
                                        value={values.affiliatelink} 
                                        onChange={handleChange}
                                        type="text" 
                                        placeholder="Enter email" 
                                        isInvalid={touched.affiliatelink && !!errors.affiliatelink}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.affiliatelink}
                        </Form.Control.Feedback>      
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Expiry Date</Form.Label>
                        <Form.Control   className='formControl' 
                                        name="expirydate"
                                        value={values.expirydate} 
                                        type="date" 
                                        placeholder="dd/mm/yyyy" 
                                        onChange= {handleChange}
                                        isInvalid={touched.expirydate && !!errors.expirydate}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.expirydate}
                        </Form.Control.Feedback>  
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Source</Form.Label>
                        <Form.Select    className='formControl'
                                        name="source"
                                        value={values.source}  
                                        onChange= {handleChange}
                                        isInvalid={touched.source && !!errors.source}>
                            <option selected value="none">Select a source</option>
                            {PRODUCT_SOURCES.map(s=> <option value={s.value}>{s.name}</option>)}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.source}
                        </Form.Control.Feedback>  
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check style={{color: "#adb5bd", marginTop: "30px"}}
                            name="isactive"
                            type="switch"
                            label="Is Product Active?"
                            id="no_radio"
                            onChange={(e) => { setFieldValue("isActive",!values.isActive);}}
                        /> 
                    </Form.Group> 
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Price</Form.Label>
                        <Form.Control   className='formControl' 
                                        name="price"
                                        value={values.price} 
                                        onChange={handleChange}
                                        type="number" 
                                        placeholder="Enter price"/> 
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check style={{color: "#adb5bd", marginTop: "30px"}}
                            name="isonsale"
                            type="switch"
                            label="Is Product isonsale?"
                            id="no_radio"
                            onChange={(e) => { 
                                    handleChange(e);
                                    setFieldValue("saleprice",0.0); 
                                    setFieldValue("isonsale",!values.isonsale);}}
                        /> 
                    </Form.Group> 
                    {values.isonsale && 
                        <Form.Group className="mb-3">
                            <Form.Label className='formLabel'>Sale Price</Form.Label>
                            <Form.Control   className='formControl' 
                                            name="saleprice"
                                            value={values.saleprice} 
                                            onChange={handleChange}
                                            type="number" 
                                            placeholder="Enter sale price"/> 
                        </Form.Group>}
                    <Form.Group className="mb-3">
                        <Form.Check style={{color: "#adb5bd", marginTop: "30px"}}
                            name="hasbannercode"
                            type="switch"
                            label="Is there a banner code?"
                            id="no_radio"
                            onChange={(e) => { 
                                    handleChange(e);
                                    setFieldValue("bannercode",''); 
                                    setFieldValue("hasbannercode",!values.hasbannercode);
                                }}
                        /> 
                    </Form.Group> 
                    { values.hasbannercode && 
                        <Form.Group className="mb-3" controlId="validationFormik04">
                            <Form.Label className='formLabel'>bannercode</Form.Label>
                            <Form.Control className='formControl' 
                                        as="textarea"
                                        row={4}
                                        placeholder="Enter Banner Code" 
                                        name="bannercode"
                                        value={values.bannercode}
                                        onChange={handleChange}
                            />
                        </Form.Group>}
                        <Form.Group className="mb-3" controlId="validationFormik10">
                            <Form.Label className='formLabel'>File</Form.Label>
                            <Form.Control className='formControl'
                                        ref={fileRef}
                                        type="file"
                                        name="files"
                                        value={undefined}
                                        onChange={(e)=>{
                                            setFieldValue("files",fileRef.current.files)  
                                        }}
                                        multiple
                                        isInvalid={!!errors.files}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.files}
                            </Form.Control.Feedback>
                            <ListGroup className="fineNameDiv" as="ol">
                            {values.files.length > 0 && 
                                Object.values(values.files).map((file,index)=><ListGroup.Item className="fileNames" as="li">{file.name}
                                            <CloseButton onClick={(e)=>{
                                                setFieldValue("files",
                                                    Object.values(values.files).toSpliced(index,1));
                                            }} className="fileRemove"/></ListGroup.Item>)
                            }
                            </ListGroup>
                        </Form.Group>
                    <Button className="formButton" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                )}
                </Formik>
            </div>
        </Container>
    );
}

export default AdminProduct;