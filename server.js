const express = require('express');
require("dotenv").config();
const PORT = 4000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGOBD_URL } = require('./config')
mongoose.connect(MONGOBD_URL);


mongoose.set('strictQuery', false);

mongoose.connection.on('connected', () => {
    console.log("DB connected");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})


// Importing models
require('./model/usermodel');
require('./model/MyCart')
require('./model/Product_model')
require('./model/order_model')



app.use(cors());
app.use(express.json());

// Importing Routes
app.use(require('./routes/user_routes'));
app.use(require('./routes/cart_route'));
app.use(require('./routes/product_route'));
app.use(require('./routes/order_route'));
app.use(require('./routes/payment_route'))



app.listen(PORT, () => {
    console.log("Server started");
});