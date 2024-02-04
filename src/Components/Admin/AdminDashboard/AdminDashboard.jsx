'use strict';

import './AdminDashboard.css'
import Container from 'react-bootstrap/Container';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"; 
import { isUserLoggedIn } from '../../../Utils/CommonUtils';
import { ADMIN_KEY } from '../../../Utils/Constants';



function AdminDashboard(){

    const navigate = useNavigate(); 
  
    const redirect = (path) => { 
        navigate(path); 
    }

    const logout = () => {
        window.sessionStorage.removeItem(ADMIN_KEY);
        navigate("/adminlogin");
    }
    
    useEffect(() => {
        if(!isUserLoggedIn()){
            navigate("/adminlogin");
        }
    },[])
    
    return (
        <Container fluid className="adminDashboard">
            <div className="menuDiv">
                <Button onClick={() => redirect("/admin/product/add")}>Add Product</Button>
                <Button onClick={() => redirect("/admin/product/delete")}>Delete Product</Button>
                <Button onClick={() => redirect("/admin/product/update")}>Update Product</Button>
                <Button>List Products</Button>
                <Button>Notifications</Button>
                <Button onClick={() => logout()}>Logout</Button>
            </div>
        </Container>
    );
}

export default AdminDashboard;