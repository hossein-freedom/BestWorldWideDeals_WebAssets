'use strict';

import './AdminDashboard.css'
import Container from 'react-bootstrap/Container';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"; 



function AdminDashboard(){

    const navigate = useNavigate(); 
  
    const redirect = (path) => { 
        navigate(path); 
    } 
    
    return (
        <Container fluid className="adminDashboard">
            <div className="menuDiv">
                <Button onClick={() => redirect("/admin/product/add")}>Add Product</Button>
                <Button onClick={() => redirect("/admin/product/delete")}>Delete Product</Button>
                <Button onClick={() => redirect("/admin/product/update")}>Update Product</Button>
                <Button>List Products</Button>
            </div>
        </Container>
    );
}

export default AdminDashboard;