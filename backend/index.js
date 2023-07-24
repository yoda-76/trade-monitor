const express = require("express");
const app = express();
const User = require("./models/userDetails"); // Import the user schema from userDetails.js
app.use(express.json());
const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");
const signupRoute=require("./routes/register")
const signinRoute=require("./routes/login")
const authRoute=require("./routes/checkAuth")
const checkRouter=require("./routes/check")
const orderbookRouter=require("./routes/orderbook")
const userDataRouter=require("./routes/userData")
const generateTokenRouter=require("./routes/generateToken")
// const instruments=require("./routes/instruments")




//connecting to database
const mongoUrl = "mongodb+srv://yadvendras20:KfTTzI37UNrKM1Ol@cluster0.ynpefuu.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));



  //Routes
  app.use("/register", signupRoute)
  app.use("/login-user", signinRoute)
  app.use("/checkAuth", authRoute)
  app.use("/userData",userDataRouter)
  app.use("/check",checkRouter)
  app.use("/orderbook",orderbookRouter)

  app.use("/generateToken",generateTokenRouter)
//   app.use("/instruments",instruments)

  

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

