const express = require('express');
const payment_route = express();

// In this API Controller are saved in controller folder 
const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

const paymentController = require('../controller/payment_controller');

payment_route.get('/render', paymentController.renderBuyPage);
payment_route.post('/pay', paymentController.payProduct);
payment_route.get('/pay/success', paymentController.successPage);
payment_route.get('/pay/cancel', paymentController.cancelPage);
payment_route.get('/config',(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_KEY);
})

module.exports = payment_route;