import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../src/Components/Header/Header';
import Dashboard from '../src/Components/Dashboard/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import AdminProduct from './Components/Admin/AdminProduct/AdminProduct';


function App() {

  const isAdmin = () =>{
     return window.location.href.includes("admin");
  }
  return (
    <>{console.log(window.location.href)}
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/admin" element={<AdminDashboard/>}>
              {/* <Route path="product" element={<AdminProduct/>}/> */}
          </Route>
          <Route path="/admin/product/:actionType" element={<AdminProduct/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
