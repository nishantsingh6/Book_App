const Order = require("../models/Order");
const User = require("../models/Users");

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, address } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const activeOrder = await Order.findOne({ user: userId, orderStatus: "Pending" });
        if (!activeOrder) {
            return res.status(404).json({
                message:"No active order found",
            })
        }
       
        // Place the current order
        activeOrder.name = user.firstName;
        activeOrder.orderDescription = description;
        activeOrder.address = address;
        activeOrder.orderStatus = "Placed";
        await activeOrder.save();


        return res.status(201).json({
            message: "Order placed successfully",
            currentOrder: activeOrder,
            //  newOrder: newOrder
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating order",
            error: error.message
        });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id, orderStatus: "Placed" })
            .populate("user") // to access user details
            .populate({ path: "cartItem", populate: { path: "bookId" } })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        });
    }
};


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: { $in: ["Pending", "Placed"] } }).populate("user");
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json({
            message: "All placed orders fetched successfully",
            orders
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching all orders",
            error: error.message
        });
    }
};
