const express = require('express');
const KiteConnect = require("kiteconnect").KiteConnect;
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { route } = require('./register');
const brokerValidator = require("../validateBrokerCreds")
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";


router.post("/", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const { email } = user;
      const jsonData = await User.findOne({ email });
    //   console.log(jsonData)
  
      // Extract the access token
      const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
      const access_token = accessToken;
      const api_key = apiKey;
  
      const a = async () => {
        const kite = new KiteConnect({ api_key });
        kite.setAccessToken(access_token);
  
        // Perform any kite operations here
        const orderbook = await kite.getOrders();    
        
        // console.log(orderbook)
        console.log(jsonData.BrokerList[0].accountName)
       
        // Send the response to the client
        res.send({ orderbook, accountName:jsonData.BrokerList[0].accountName });
      };
  
      a();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  

module.exports=router;