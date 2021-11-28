
   
  
  

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bankDB= require(__dirname+'/models/bankDB.js');
const customer= bankDB.Customer;
const transfer= bankDB.Transfer;
//const _=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(process.env.PORT||5000, function () {
  console.log("5000 port created");
});
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/customers", (req, res) => {
  customer.find({}, (err, Customers) => {
      if (!err) {
          if (Customers.length === 0) {
              // Creating a dummy data in the database for 10 customers
              for (let i = 1; i <= 10; i++) {
                  const customeR = new customer({
                      _id: i,
                      name: "Customer " + i,
                      email: "customer" + i + "@gmail.com",
                      accountBalance: i * 100000
                  })
                  customeR.save();
              }
              res.redirect("/customers");
          }
          else {
              Customers.sort((c1, c2) => c1._id - c2._id);
              res.render("customers", {  customers: Customers });
          }
      }
  });
});

app.get("/transfer",function(req,res){
    customer.find({},function(err,Customer){
      if(!err){
        res.render("transfer",{customers:Customer,flag1:0 ,flag2:0});
      }

    });

});
app.get("/transferhistory", (req, res) => {
  transfer.find({}, (err, transfers) => {
      if (!err) {
          transfers.sort((t1, t2) => t1._id - t2._id);
          res.render("transaction-history", {  transfers: transfers })
      }
  })
})



app.post("/", (req, res) => {
  console.log(req.body);
  let fromID = req.body.from;
  let toID = req.body.to;
  let amount = Number(req.body.amount);

  customer.find({}, (err, customers) => {
      if (!err) {
          let transferorBalance = customers[fromID - 1].accountBalance;

          // Check if the transferor and the transferee are same
          if (fromID === toID) {
              customers.sort((c1, c2) => c1._id - c2._id);
              res.render("transfer", {  customers: customers, flag1: 1, flag2: 0 });
          }
          // Else Check if the transferor's account balance is less than the amount mentioned by the user
          else if (transferorBalance < amount) {
              customers.sort((c1, c2) => c1._id - c2._id);
              res.render("transfer", { customers: customers, flag1: 0, flag2: 1 });
          }
          // Else update the db and render the changes
          else {
              customer.findByIdAndUpdate({ _id: fromID }, { $inc: { accountBalance: -amount } }, (err, customers) => { });
              customer.findByIdAndUpdate({ _id: toID }, { $inc: { accountBalance: amount } }, (err, customers) => { });

              const date = new Date();
              const currentTime = date.toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
              transfer.find({}, (err, transfers) => {
                  let len = transfers.length;
                  customers.sort((c1, c2) => c1._id - c2._id);
                  const Transfer = new transfer({
                      _id: len + 1,
                      transferredFrom: customers[fromID - 1].name,
                      transferredTo: customers[toID - 1].name,
                      amount: amount,
                      date: currentTime
                  })
                  Transfer.save();
              })

              res.redirect("/customers");
          }
      }
  })
})

// app.post('/customers',function(req,res){
  
// })
// app.get("/posts/:postname",function(req,res){
//   var current =_.lowerCase(req.params.postname);
//   posts.forEach(function(post){
//     if(current===_.lowerCase(post.title)){
//          const currentcontent=post.content;
//       res.render("post",{titlethis:current, contentthis:currentcontent});
      
//     }
//   })
// })
// app.get("/about", function (req, res) {

//   res.render("about", { contentabout: aboutContent });

// });
// app.get("/contact", function (req, res) {
//   res.render("contact", { contentcontact: contactContent });

// });
// app.get("/compose", function (req, res) {
//   res.render("compose");

// });
// app.post("/compose", function (req, res) {
//   const post = {
//     title: req.body.posttitle,
//     content: req.body.postbody


//   };
//   posts.push(post);
//   res.redirect("/");

// });
















