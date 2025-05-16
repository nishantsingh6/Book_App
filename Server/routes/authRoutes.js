const express = require('express');
const router = express.Router();

//Importing the controller functions
const {signup, login} = require("../controllers/auth");
const {authenticate, isCustomer, isAdmin} = require("../middlewares/authenticate");
const {getBooks, postBook, getBookByTitle, updateBook, deleteBook, getBooksByGenre} = require("../controllers/serviceControllers");
const{ addToCart,getCartItems ,removeFromCart } = require("../controllers/cartController");
const{createOrder,getOrder,getAllOrders} = require("../controllers/orderController");
router.post("/signup", signup);
router.post("/login", login);

router.get("/customer", authenticate, isCustomer, (req, res) => {
    res.status(200).json({
        success:true,
        message:"Welcome to the customer dashboard",
        user:req.user,
    });
})

router.get("/admin", authenticate, isAdmin, (req, res) => {
    res.status(200).json({
        success:true,
        message:"Welcome to the admin dashboard",
        user:req.user,
    });
})


//PROTECTED ROUTES FOR BOOKS ACCESS BY ADMIN ONLY
router.post("/admin/post", authenticate, isAdmin, postBook);
router.get("/admin/getAllOrders", authenticate, isAdmin, getAllOrders);
router.get("/admin/getBook", authenticate, isAdmin, getBooks);
router.get("/admin/get", authenticate, isAdmin, getBookByTitle);
router.put("/admin/update/:id", authenticate, isAdmin, updateBook);
router.delete("/admin/delete/:id", authenticate, isAdmin, deleteBook);
router.get("/admin/:genre", authenticate, isAdmin, getBooksByGenre);


//PROTECTED ROUTES FOR BOOKS ACCESS BY CUSTOMER ONLY
//Always use non parametric routes before parametric routes
router.post("/customer/addCart", authenticate, isCustomer, addToCart);
router.post("/customer/placeOrder", authenticate,isCustomer, createOrder);
router.get("/customer/getOrder", authenticate, isCustomer, getOrder);
router.get("/customer/getCart", authenticate, isCustomer, getCartItems); 
router.delete("/customer/removeCart/:cartItemId", authenticate, isCustomer, removeFromCart);
router.get("/customer/getBook", authenticate, isCustomer, getBooks);
router.get("/customer/get", authenticate, isCustomer, getBookByTitle);
router.get("/customer/:genre", authenticate, isCustomer, getBooksByGenre);


module.exports = router;