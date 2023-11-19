'use strict';

import './AdminDashboard.css'
import Container from 'react-bootstrap/Container';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';


function AdminDashboard(){
    
    return (
        <Container fluid className="adminDashboard">
            <div className="menuDiv">
                <Button>Add Product</Button>
                <Button>Delete Product</Button>
                <Button>Update Product</Button>
                <Button>List Products</Button>
            </div>
        </Container>
    );
}

export default AdminDashboard;