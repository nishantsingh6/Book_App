const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const User = require('../models/Users');
const Book = require('../models/Book');

const {authenticate} = require('../middlewares/authenticate');

exports.addToCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        // Find an active order
        let activeOrder = await Order.findOne({ user: userId, orderStatus: 'Pending' }).populate({
            path: 'cartItem',
            populate: { path: 'bookId' }
        });

        // If no active order is found, create one with a default address
        if (!activeOrder) {
            activeOrder = await Order.create({
                user: userId,
                orderStatus: 'Pending',
                amount: 0, 
                cartItem: [],
                address: "Default Address", 
            });
        }

        // Check if the book is already in the cart
        const existingCartItem = activeOrder.cartItem.find(item => item.bookId._id.toString() === bookId);
        if (existingCartItem) {
            return res.status(400).json({
                success: false,
                message: "Book already in cart",
            });
        }

        // Validate book and user
        const book = await Book.findById(bookId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        // Create a new cart item
        const cartItem = await CartItem.create({
            order: activeOrder._id,
            bookId,
            userId,
            quantity: 1,
            price: book.price,
        });

        // Update order amount and add cart item
        activeOrder.amount += book.price;  // Add book price to the total amount
        activeOrder.cartItem.push(cartItem._id);
        await activeOrder.save();

        return res.status(201).json({
            success: true,
            message: "Book added to cart successfully",
            cartItem,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to add to cart",
            error: error.message,
        });
    }
};

exports.removeFromCart = async(req, res) => {
    try{
        const {cartItemId} = req.params;
        const userId = req.user.id;
        const activeOrder = await Order.findOne({user:userId, orderStatus:'Pending'});
        if(!activeOrder){
            return res.status(404).json({
                success:false,
                message:"No active order found",
            })
        }
        const cartItem = await CartItem.findById(cartItemId);
        if(!cartItem){
            return res.status(404).json({
                success:false,
                message:"Cart item not found",
            })
        }
        // Check if the cart item belongs to the active order
        if(cartItem.order.toString() !== activeOrder._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Cart item does not belong to the active order",
            })
        }
        // Remove the cart item from the order
        activeOrder.cartItem = activeOrder.cartItem.filter(item => item.toString() !== cartItemId);
        activeOrder.amount -= cartItem.price; // Deduct the price of the removed item from the total amount
        await activeOrder.save();
        await CartItem.findByIdAndDelete(cartItemId); // Delete the cart item from the database
        return res.status(200).json({
            success:true,
            message:"Cart item removed successfully",
        });
      
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to remove from cart",
            error:error.message,
        })
    }
}


exports.getCartItems = async (req, res) => {

    try {

        const userId = req.user.id;

        const activeOrder = await Order.findOne({ user: userId, orderStatus: 'Pending' }).populate({
            path: 'cartItem',
            populate: {
                path: 'bookId',
                model: 'Books'
            }
        });

        if (!activeOrder || !activeOrder.cartItem.length) {
            return res.status(404).json({
                success: false,
                message: "No items in cart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart items fetched successfully",
            cartItems: activeOrder.cartItem,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch cart items",
            error: error.message,
        });
    }
};





