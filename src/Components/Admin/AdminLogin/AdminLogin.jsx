'use strict';

import './AdminLogin.css'
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import * as formik from 'formik';
import { isUserLoggedIn } from '../../../Utils/CommonUtils';
import { useNavigate } from "react-router-dom";
import { ADMIN_KEY, USER_LOGGED_IN } from '../../../Utils/Constants';
import api from '../../../Utils/api/api';

function AdminLogin(){

    const navigate = useNavigate();
    const { Formik } = formik;
    const schema = yup.object().shape({
        userName: yup.string().required(),
        password: yup.string().required()
    });

    const handleLogin = (values, resetForm) => {
        if(isUserLoggedIn()){
            return;
        }
        api.getData({
            url: `/api/login/${values.userName}/${values.password}`,
            params: {}
        }).then((response)=>{
            window.sessionStorage.setItem(ADMIN_KEY, USER_LOGGED_IN);
            navigate("/admin");
        }).catch((error)=>{
            console.log("Failed to process login request.");
        })
    }

    return (
        <>
            <Container fluid>
                <div className="loginFormDiv">
                    <Formik
                        validationSchema={schema}
                        enableReinitialize={true} 
                        onSubmit={(values, {resetForm}) => { 
                            handleLogin(values, resetForm);}}    
                        initialValues={{
                            userName: '',
                            password: ''
                        }}
                        >
                        {({ handleSubmit, handleChange,  resetForm, setFieldValue, values, touched, errors }) => (
                        <Form className='form' noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="validationFormik03">
                                <Form.Label className='formLabel'>Username</Form.Label>
                                <Form.Control
                                    className='formControl' 
                                    type="text"
                                    placeholder="Enter username"
                                    name="userName"
                                    value={values.userName}
                                    onChange={handleChange}
                                    isInvalid={touched.userName && !!errors.userName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.userName}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="validationFormik04">
                                <Form.Label className='formLabel'>Password</Form.Label>
                                <Form.Control className='formControl' 
                                            type="password"
                                            row={4}
                                            placeholder="Enter password" 
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            isInvalid={touched.password && !!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button className="formButton" variant="primary" type="submit" style={{marginTop: "25px"}}>
                                Login 
                            </Button>
                        </Form>
                        )}
                    </Formik>
                </div>
            </Container>
        </>
    );
}

export default AdminLogin;