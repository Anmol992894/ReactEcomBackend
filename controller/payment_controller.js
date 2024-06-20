const paypal = require('paypal-rest-sdk');
const path = require('path');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const OrderModel = mongoose.model("OrderModel");
var total=0;

// Bringing data from the env file
const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

// Configuring paypal
paypal.configure({
    'mode': PAYPAL_MODE, //sandbox or live
    'client_id': PAYPAL_CLIENT_KEY,
    'client_secret': PAYPAL_SECRET_KEY
});


// Testing Remder Page
const renderBuyPage = async (req, res) => {

    try {
        res.sendFile(path.join(__dirname, '../views', 'index.ejs'));

        // res.render('index');

    } catch (error) {
        console.log(error.message);
    }

}

// Pay Product Page to initiate the paypal payment
const payProduct = async (req, res) => {
    const { cartItems, shippingAddress, orderSummary } = req.body;
    total=orderSummary.totalPrice;
    try {
        const createPayment = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'http://localhost:4000/pay/success',
                cancel_url: 'http://localhost:4000/pay/cancel'
            },
            transactions: [{
                items: cartItems,
                shippingAddress: shippingAddress,
                amount: {
                    total: orderSummary.totalPrice,
                    currency: 'USD'
                },
                description: 'Hat for the best team ever'
            }]
        };

        paypal.payment.create(createPayment, function (error, payment) {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                res.json({ approvalUrl });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Success page execute after successfull payment
const successPage = async (req, res) => {

    try {
        console.log(req.query);
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": total
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            console.log(payment);
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                const successData = {
                    data:payment,
                    message: 'Payment successful!'
                };
                // Send success data to frontend
                    const postObj = new OrderModel({ cartItems: payment.transactions[0].item_list, shippingAddress: payment.payer.payer_info.shipping_address, orderSummary: payment.transactions[0].amount, author: req.user });
                    postObj.save()
                        .then((newPost) => {
                            console.log(newPost);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                res.redirect(`http://localhost:3000/OrderHistory`);
            }
        });


    } catch (error) {
        console.log(error.message);
    }

}

// Cacel Payment execute after payment cancelation
const cancelPage = async (req, res) => {

    try {

        res.render('cancel');

    } catch (error) {
        console.log(error.message);
    }

}

// Exporting several module
module.exports = {
    renderBuyPage,
    payProduct,
    successPage,
    cancelPage
}