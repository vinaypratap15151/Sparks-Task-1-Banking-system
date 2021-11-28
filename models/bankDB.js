const mongoose = require('mongoose');



mongoose.connect("mongodb+srv://admin-vinay:shivbaba@cluster0.skn37.mongodb.net/bankingDB",{useNewUrlParser: true});//connecting mongodb

const customerSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    accountBalance: {
        type: Number,
        min: 0
    }
})

const transferSchema = new mongoose.Schema({
    _id: Number,
    transferredFrom: String,
    transferredTo: String,
    amount: {
        type: Number,
        min: 0
    },
    date: String
})

const Customer = mongoose.model("Customer", customerSchema);
const Transfer = mongoose.model("Transfer", transferSchema);

module.exports = {Customer,Transfer};