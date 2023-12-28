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
import { Breadcrumb, CloseButton, Image, ListGroup } from 'react-bootstrap';
import API from '../../../Utils/api/api'; 
import { useParams } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';


function AdminProduct(){

    const { actionType } = useParams();

    const isEdit = ["delete","update"].includes(actionType);
    const isDelete = ["delete"].includes(actionType);
    const isUpdate = ["update"].includes(actionType);
    const isAdd = ["add"].includes(actionType);
    const resetFormInitValues = () => {
        return {
            title: '',
            description: '',
            category: '',
            otherCategory: '',
            subCategory: '',
            otherSubCategory: '',
            email: '',
            sellerWebsite: '',
            affiliateLink: '',
            expiryDate:  "yyyy-mm-dd",
            source:'',
            isActive: false,
            price: 0.0,
            isOnSale: false,
            salePrice: 0.0,
            hasBannerCode: false,
            bannerCode: '',
            files: []
        }
    }


    const [formInitialValues, setFormInitialValues] = useState(resetFormInitValues());
    const [categories, setCategories] = useState([]);
    const [isCategoryInputActive, setIsCategoryInputActive] = useState(false);
    const [isSubCategoryInputActive, setIsSubCategoryInputActive] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [productInfo, setProductInfo]= useState({});
    const [productIdForSearch, setProductIdForSearch] = useState(0);
    const [searchedProductId, setSearchedProductId] = useState(0);
    const [isDate, setIsDate] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [modelShow,setModelShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [imagesForUpdate, setImagesForUpdate] = useState([]);

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
    
    const getProductData = () => {
        setIsFormVisible(false);
        API.getData({
            url: `/getproduct/${productIdForSearch}`,
            params: {}
        }).then((response)=>{
            const product = response.data.data;
            setSearchedProductId(productIdForSearch);
            //setProductInfo(product);
            setIsFormVisible(true);
            getSubCategories(product.category);
            const mill = product.endDate;
            delete product.endDate;
            const date = new Date(mill);
            setFormInitialValues({...product,expiryDate: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),files:[],otherSubCategory:'',otherCategory:''})
            API.getData({
                url: `/getimagesforproduct/${product.id}`,
                params: {}
            }).then((response)=>{
                setImagesForUpdate(response.data.data);
                console.log(response);
            })
        }).catch((error)=>{
            setModalMessage("We encountered an error processing your request. Please try again later");
            setModelShow(true);
        })
    }

    const deleteProductData = () => {
        API.deleteData({
            url: `/deleteproduct/${searchedProductId}`,
            params: {}
        }).then((response)=>{
            setModalMessage("Product was successfully Deleted.");
            setModelShow(true);
            setIsFormVisible(false);
            setFormInitialValues(resetFormInitValues());
        }).catch((error)=>{
            setModalMessage("We encountered an error processing your request. Please try again later");
            setModelShow(true);
        })
    }

    const getTime = (date) => { return new Date(date).valueOf(); };

    const deleteProductImage = (image) => {
        const idList = [image.id]
        API.deleteData({
            url: `/deleteimages`,
            params: {"ids": idList},
            contentType: "application/json"
        }).then((response)=>{
            console.log(response);
            setModalMessage("Image was successfully Deleted.");
            setModelShow(true);
            setImagesForUpdate(imagesForUpdate.filter( img => image.id !== img.id));
        }).catch((error)=>{
            setModalMessage("We encountered an error processing your request. Please try again later");
            setModelShow(true);
        })
    }

    const handleSubmit = (values, resetForm) => {
        const prodData = {
            "title": values.title,
            "description": values.description,
            "category": values.category === "Other" ? values.otherCategory : values.category,
            "subCategory": values.subCategory === "Other" ? values.otherSubCategory : values.subCategory,
            "email": values.email,
            "sellerWebsite": values.sellerWebsite,
            "affiliateLink": values.affiliateLink,
            "endDate": getTime(values.expiryDate),
            "source": values.source,
            "isActive": values.isActive,
            "price": values.price,
            "isOnSale": values.isOnSale,
            "salePrice": values.salePrice,
            "bannerCode": values.bannerCode

        }
        API.postData({
            url: "/saveproduct",
            params: prodData,
            contentType: "application/json"
        }).then((response)=>{
            if(values.files.length > 0 ){
                const prodId = response.data.data.productId;
                const formData = new FormData();
                Object.values(values.files).forEach((element,index) => {
                    formData.append("images",element);
                });
                API.postData({
                    url: `/uploadimages/${prodId}`,
                    params: formData,
                    contentType: "multipart/form-data"
                }).then((response)=>{
                    setFormInitialValues(resetFormInitValues());
                    setModalMessage("Product was successfully Saved.");
                    setModelShow(true);
                    resetForm();
                }).catch((error)=>{
                    setModalMessage("We encountered an error processing your request. Please try again later");
                    setModelShow(true);
                });
            }else{
                setFormInitialValues(resetFormInitValues());
                setModalMessage("Product was successfully Saved.");
                setModelShow(true);
                resetForm();
            }
        }).catch((error)=>{
            setModalMessage("We encountered an error processing your request. Please try again later");
            setModelShow(true);
        });

    }

    const updateProductData = (values, resetForm) => {
        const prodData = {
            "id": searchedProductId, 
            "title": values.title,
            "description": values.description,
            "category": values.category === "Other" ? values.otherCategory : values.category,
            "subCategory": values.subCategory === "Other" ? values.otherSubCategory : values.subCategory,
            "email": values.email,
            "sellerWebsite": values.sellerWebsite,
            "affiliateLink": values.affiliateLink,
            "endDate": getTime(values.expiryDate),
            "source": values.source,
            "isActive": values.isActive,
            "price": values.price,
            "isOnSale": values.isOnSale,
            "salePrice": values.salePrice,
            "bannerCode": values.bannerCode

        }
        API.updateData({
            url: `/updateproduct`,
            params: prodData,
            contentType: "application/json"
        }).then((response)=>{
            if(values.files.length > 0 ){
                const prodId = searchedProductId;
                const formData = new FormData();
                Object.values(values.files).forEach((element,index) => {
                    formData.append("images",element);
                });
                API.postData({
                    url: `/uploadimages/${prodId}`,
                    params: formData,
                    contentType: "multipart/form-data"
                }).then((response)=>{
                    setFormInitialValues(resetFormInitValues());
                    setModalMessage("Product was successfully Saved.");
                    setModelShow(true);
                    resetForm();
                    setIsFormVisible(false);
                }).catch((error)=>{
                    setModalMessage("We encountered an error processing your request. Please try again later");
                    setModelShow(true);
                });
            }else{
                setModalMessage("Product was successfully Updated.");
                setModelShow(true);
                setIsFormVisible(false);
                setFormInitialValues(resetFormInitValues());
            }
        }).catch((error)=>{
            setModalMessage("We encountered an error processing your request. Please try again later");
            setModelShow(true);
        })
    }
  
    const handleData = (values, resetForm) => {
            if(isAdd == true){
                handleSubmit(values, resetForm)
            }else if(isUpdate == true){
                updateProductData(values, resetForm)
            }
    }

    const getDateFormat = (dateStr) => {
        const dateToks = dateStr.split("-");
        //return date.toLocaleDateString("en-GB");
        return dateToks[2]+'/'+dateToks[1]+'/'+dateToks[0];
    }
    const handleClose = () => {setModelShow(false);};
    const { Formik } = formik;

    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
        category: yup.string().required().matches(/^((?!none).)*$/gm),
        otherCategory: yup.string().when('category',{
              is: (value) => ["Other"].includes(value),
              then: () => yup.string().required(),
              otherwise: () => yup.string(),
        }),
        subCategory: yup.string().required().matches(/^((?!none).)*$/gm),
        otherSubCategory: yup.string().when('subCategory',{
              is: (value) => ["Other"].includes(value),
              then: () => yup.string().required(),
              otherwise: () => yup.string(),    
        }),
        email: yup.string().required().email("Invalid Email"),
        sellerWebsite: yup.string(),
        affiliateLink: yup.string().required(),
        expiryDate: yup.string().required(),
        source: yup.string().required().matches(/^((?!none).)*$/gm),
        isActive: yup.bool(),
        price: yup.number(),
        isOnSale: yup.bool(),
        salePrice: yup.number(),
        hasBannerCode: yup.bool(),
        bannerCode: yup.string(),
        files: yup.mixed()
                .test("files_length", "You can only select up to 5 files", 
                        function(value) {
                            if(value.length > 5){
                                return false;
                            }else{
                                return true;
                            }
                        })
                .test("files_length", "You need to upload at-least 1 file.", 
                        function(value) {
                            if(value.length == 0){
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
        <>
        <Modal  class="customModal"
                size="sm"
                show={modelShow}
                centered
                onHide={() => setModelShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
                style={{"z-index":"20000"}}
        >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
                Notification
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
                Ok
            </Button>
            </Modal.Footer>
        </Modal>    
        <Container fluid className="adminProduct">
        <Breadcrumb>
            <Breadcrumb.Item href="http://localhost:3000/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="http://localhost:3000/admin/">Admin Dashboard</Breadcrumb.Item>
            {isAdd &&
             <Breadcrumb.Item active>Add Product</Breadcrumb.Item>
            }
            {isDelete &&
             <Breadcrumb.Item active>Delete Product</Breadcrumb.Item>
            }
            {isUpdate &&
             <Breadcrumb.Item active>Update Product</Breadcrumb.Item>
            }
        </Breadcrumb>
            {isEdit && 
            <div className='productSearchDiv'>
                <Form className='form'>
                    <Form.Group className="mb-3">
                        <Form.Label className='formLabel'>Product ID:</Form.Label>
                        <Form.Control
                            className='formControl' 
                            type="number"
                            placeholder="Enter enter product ID"
                            onBlur={(e) => setProductIdForSearch(e.currentTarget.value)}
                        />
                    </Form.Group>
                    <Button className="formButton" onClick={getProductData} variant="primary" type="button">
                        Search for product
                    </Button>
                </Form>
            </div>
            }
            {((isFormVisible && isEdit) || (!isEdit)) && 
                <div className='productDiv'>
                <Formik
                    validationSchema={schema}
                    enableReinitialize={true} 
                    onSubmit={(values, {resetForm}) => { 
                        handleData(values, resetForm);}}    
                    initialValues={formInitialValues}
                    >
                    {({ handleSubmit, handleChange,  resetForm, setFieldValue, values, touched, errors }) => (
                    <Form className='form' noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="validationFormik03">
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
                                                                setFieldValue("otherCategory",'');
                                                            }
                                                            }
                                                        }
                                            isInvalid={touched.category && !!errors.category} >
                                    <option selected value="none">Select a category</option>                        
                                    {categories.map((s)=> <option value={s}>{s}</option>)}
                                    <option value="Other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    You must select a category
                                </Form.Control.Feedback>
                                { isCategoryInputActive && 
                                    <Form.Control className='formControl'
                                                name="otherCategory"
                                                value={values.otherCategory} 
                                                onChange={handleChange}
                                                style={{marginTop:"20px"}} 
                                                type="text" 
                                                placeholder="Enter new category"
                                                isInvalid={touched.otherCategory && !!errors.otherCategory}
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
                                            name="subCategory"
                                            value={values.subCategory}   
                                            onChange = {(e) => { 
                                                            handleChange(e);
                                                            if(e.currentTarget.value === "Other"){
                                                                setIsSubCategoryInputActive(true);
                                                            }else{
                                                                setIsSubCategoryInputActive(false);
                                                                setFieldValue("otherSubCategory",'');
                                                            }
                                                            }
                                                        }
                                            isInvalid={touched.subCategory && !!errors.subCategory}>
                                    <option value="none">Select a Sub Category</option>                        
                                    {subCategories.map(s=> <option value={s}>{s}</option>)}
                                    <option value="Other">Other</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    You must select a subcategory
                                </Form.Control.Feedback>
                                {isSubCategoryInputActive && 
                                    <Form.Control className='formControl'
                                            name="otherSubCategory"
                                            value={values.otherSubCategory} 
                                            onChange={handleChange}
                                            style={{marginTop:"20px"}} 
                                            type="text" 
                                            placeholder="Enter new Sub Category"
                                            isInvalid={touched.otherSubCategory && !!errors.otherSubCategory}/>
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
                                            name="sellerWebsite"
                                            value={values.sellerWebsite} 
                                            onChange={handleChange}
                                            type="text" 
                                            placeholder="Enter website link" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='formLabel'>Affiliate Link</Form.Label>
                            <Form.Control   className='formControl' 
                                            name="affiliateLink"
                                            value={values.affiliateLink} 
                                            onChange={handleChange}
                                            type="text" 
                                            placeholder="Enter affiliate link" 
                                            isInvalid={touched.affiliateLink && !!errors.affiliateLink}/>
                            <Form.Control.Feedback type="invalid">
                                {errors.affiliateLink}
                            </Form.Control.Feedback>      
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='formLabel'>Expiry Date</Form.Label>
                            {(isEdit && !isDate) && <Form.Control   className='formControl' 
                                            type="text" 
                                            value={getDateFormat(values.expiryDate)}
                                            onFocus={()=>setIsDate(true)}
                                            />}
                            {(!isEdit || isDate) && <Form.Control className='formControl' 
                                            id='dateInput'
                                            name="expiryDate"
                                            type="date" 
                                            value={values.expiryDate}
                                            placeholder="dd/mm/yyyy" 
                                            onChange= {handleChange}
                                            onBlur={()=>setIsDate(false)}
                                            required
                                            isInvalid={touched.expiryDate && !!errors.expiryDate}/>}
                            <Form.Control.Feedback type="invalid">
                                {errors.expiryDate}
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
                                name="isActive"
                                type="switch"
                                checked={values.isActive}
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
                                name="isOnSale"
                                type="switch"
                                checked={values.isOnSale}
                                label="Is Product onsale?"
                                id="no_radio"
                                onChange={(e) => { 
                                        handleChange(e);
                                        setFieldValue("salePrice",0.0); 
                                        setFieldValue("isOnSale",!values.isOnSale);}}
                            /> 
                        </Form.Group> 
                        {values.isOnSale && 
                            <Form.Group className="mb-3">
                                <Form.Label className='formLabel'>Sale Price</Form.Label>
                                <Form.Control   className='formControl' 
                                                name="salePrice"
                                                value={values.salePrice} 
                                                onChange={handleChange}
                                                type="number" 
                                                placeholder="Enter sale price"/> 
                        </Form.Group>}
                        <Form.Group className="mb-3">
                            <Form.Check style={{color: "#adb5bd", marginTop: "30px"}}
                                name="hasBannerCode"
                                type="switch"
                                checked={values.hasBannerCode}
                                label="Is there a banner code?"
                                id="no_radio"
                                onChange={(e) => { 
                                        handleChange(e);
                                        setFieldValue("bannerCode",''); 
                                        setFieldValue("hasBannerCode",!values.hasBannerCode);
                                    }}
                            /> 
                        </Form.Group> 
                        { values.hasBannerCode && 
                            <Form.Group className="mb-3" controlId="validationFormik04">
                                <Form.Label className='formLabel'>bannercode</Form.Label>
                                <Form.Control className='formControl' 
                                            as="textarea"
                                            row={4}
                                            placeholder="Enter Banner Code" 
                                            name="bannerCode"
                                            value={values.bannerCode}
                                            onChange={handleChange}
                                />
                            </Form.Group>}
                        {!isDelete && 
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
                                            isInvalid={isAdd && !!errors.files}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.files}
                                </Form.Control.Feedback>
                                {values.files.length > 0 && 
                                    <ListGroup className="fileNameDiv" as="ol"> 
                                        {Object.values(values.files).map((file,index)=><ListGroup.Item className="fileNames" as="li">{file.name}
                                                    <CloseButton onClick={(e)=>{
                                                        setFieldValue("files",
                                                            Object.values(values.files).toSpliced(index,1));
                                                    }} className="fileRemove"/></ListGroup.Item>)
                                        }
                                    </ListGroup>
                                }
                            </Form.Group>
                        }
                        {isAdd  && <Button className="formButton" variant="primary" type="submit" style={{marginTop: "25px"}}>
                            Submit 
                        </Button>}
                        {isDelete && <Button className="formButton" variant="primary" type="submit" style={{marginTop: "25px"}} onClick={() => deleteProductData()}>
                            Delete
                        </Button>}
                        {isUpdate && 
                        <Button className="formButton" variant="primary" type="submit"  style={{marginTop: "25px"}} onClick={() => updateProductData(values, resetForm)}>
                            Update
                        </Button>
                        }
                        {(isUpdate && imagesForUpdate.length > 0) && 
                            <div className="updateImages">
                                {imagesForUpdate.map( image => 
                                <section>
                                    <Image className="updateImage" src={image.imageLink} fluid />
                                    <Button className="formButton deleteImageBut" variant="primary" type="Button" onClick={() => deleteProductImage(image)}>Delete Image</Button>
                                    </section>
                                )}        
                            </div>

                        }
                    </Form>
                    )}
                </Formik>
                </div>
            }
        </Container>
        </>
    );
}

export default AdminProduct;