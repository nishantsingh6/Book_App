import React from 'react'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AdminDashBoard from './adminPages/AdminDashBoard';
import PostBook from './adminPages/PostBook';
import Order from './common/Order';
import CustomerDashBoard from './customerPages/CustomerDashBoard';
import CartPage from './customerPages/CartPage';
import {Routes, Route} from 'react-router-dom';
import DashBoard from "./common/DashBoard"
import PlaceOrder from './customerPages/PlaceOrder';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

const App = () => {

  return (
    <div >
      <Routes>
        <Route path={"/"} element={<PublicRoute>
          <SignUp/>
        </PublicRoute>}></Route> 
        <Route path={"/book/login"} element={<PublicRoute>
          <Login/>
        </PublicRoute>}></Route>
        <Route path={"/book/signup"} element={<PublicRoute>
          <SignUp/>
        </PublicRoute>}></Route>


       <Route element={<PrivateRoute/>}>
        {/* PROTECTER ROUTES FOR ADMIN ONLY */}
        <Route path= {"/admin/dashboard"} element = {<AdminDashBoard/>} ></Route>
        <Route path= {"/admin/postBook"} element = {<PostBook/>}></Route>
        <Route path={"/admin/orders"} element={<Order/>}></Route>

        {/* PROTECTED ROUTES FOR CUSTOMER ONLY */}
        <Route path={"/book/dashboard"} element={<CustomerDashBoard/>}></Route>
        <Route path={"/book/dashboard/orders"} element={<Order/>}></Route>
        <Route path={"/book/dashboard/cart"} element={<CartPage/>}></Route>
       </Route>


        {/* ERROR ROUTE */}
      <Route path='*' element={<><h1>Opps this is error page 404 Not Found</h1></>}/>
      </Routes>
    </div>
  );
}

export default App