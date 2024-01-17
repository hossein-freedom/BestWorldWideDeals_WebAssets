import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../src/Components/Header/Header';
import Dashboard from '../src/Components/Dashboard/Dashboard'
import { Routes, Route } from "react-router-dom";
import AdminDashboard from './Components/Admin/AdminDashboard/AdminDashboard';
import AdminProduct from './Components/Admin/AdminProduct/AdminProduct';
import SearchResult from './Components/Search/SearchResult';


function App() {

  const isAdmin = () =>{
     return window.location.href.includes("admin");
  }
  return (
    <>{console.log(window.location.href)}
      <Header/>
      <>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/search" element={<SearchResult/>}></Route>
          <Route path="/admin" element={<AdminDashboard/>}>
              {/* <Route path="product" element={<AdminProduct/>}/> */}
          </Route>
          <Route path="/admin/product/:actionType" element={<AdminProduct/>}/>
        </Routes>
      </>
    </>
  );
}

export default App;
