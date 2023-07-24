const puppeteer = require("puppeteer");
const totp = require("totp-generator");
const KiteConnect = require("kiteconnect").KiteConnect;

const User = require("./models/userDetails"); // Import the user schema from userDetails.js

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function withTimeout(func, timeout) {
    return new Promise(async (resolve, reject) => {
        const timeoutId = setTimeout(function () {
        reject({ "validCreds": false, "broker": null });
        }, timeout);

        try {
        const result = await func();
        clearTimeout(timeoutId);
        resolve(result);
        } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
        }
    });
}
  
  
const zerodhaLoginValidator = (BrokerList,brokerDetails,email) => {
    console.log(BrokerList,brokerDetails,email)
    return new Promise(async(resolve, reject) => {
        const user_id = brokerDetails.broker_user_id;
        const user_password = brokerDetails.broker_user_password;
        const api_key = brokerDetails.api_key;
        const api_secret = brokerDetails.api_secret;
        const totp_token = brokerDetails.totp_token;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const requestUrls = [];
        page.on('request', request => {
            requestUrls.push(request.url());
        });
        try{
            await page.goto(
                `https://kite.trade/connect/login?api_key=${api_key}&v=3`
                );
            await sleep(500);
            await page.type("input[type=text]", user_id),
            await page.type("input[type=password]", user_password),
            await page.keyboard.press("Enter"),
            await sleep(500),
            await page.focus("input[type=text]"),
            await page.keyboard.type(totp(totp_token)),
            await page.keyboard.press("Enter"),
            await page.waitForNavigation(),
            page.url();
            browser.close();
            const redirectURL = requestUrls.filter(element => {
                if (element.includes("request_token")) {
                    return true;
                }
            });
            const requestToken = new URL(redirectURL[0]).searchParams.get('request_token');
            try {
                const kite = new KiteConnect({ api_key: api_key });
                const response = await kite.generateSession(requestToken, api_secret);
                const accessToken = response.access_token;
                kite.setAccessToken(accessToken);
                const credentials = {
                    api_key: api_key,
                    access_token: accessToken.replace(/"/g, '')
                };


                try {
                    const userData = await User.findOne({ email });
                    console.log(userData);
                  
                    let isUpdated = false;
                  
                    if (userData && Array.isArray(userData.BrokerList)) {
                      for (const broker of userData.BrokerList) {
                        if (broker.broker === BrokerList.broker) {
                          console.log("con-1");
                          broker.accessToken = credentials.access_token;
                          isUpdated = true;
                          await User.findOneAndUpdate(
                            { email, "BrokerList.broker": BrokerList.broker },
                            {
                              $set: {
                                "BrokerList.$": broker,
                              },
                            },
                            { new: true, upsert: true }
                          );
                          console.log("Updated");
                        }
                      }
                    }
                  
                    if (!isUpdated) {
                      console.log("con-2");
                  
                      const updatedUserData = await User.findOneAndUpdate(
                        { email },
                        { $push: { BrokerList: { ...BrokerList, accessToken: credentials.access_token } } },
                        { new: true }
                      );
                      console.log("Updated");
                    }
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ status: "error", data: error });
                  }
                      
                console.log("Kite Instance Created Successfully");
                console.log(credentials.access_token)
                if(accessToken)
                    resolve({"validCreds": true, "broker": kite});
                return reject({"validCreds": false, "broker": null});
            } catch (e) {
                console.error("Failed to Create the Kite Instance", e);
                reject({"validCreds": false, "broker": null});
            }
        }catch(err){
            console.error("Failed to Create the Kite Instance", err);
            reject({"validCreds": false, "error": err});
        }finally {
            browser.close();
        }
    })
}

const validateBrokerCreds = async(BrokerList,brokerDetails,email) => {
    const timeout = 12000; 
    console.log(brokerDetails)
    if(brokerDetails.broker_name === "Zerodha"){
        console.log("first")
        return await withTimeout(() => zerodhaLoginValidator(BrokerList,brokerDetails,email), timeout)
        .then((result) => {
          return result;
        })
        .catch((error) => {
          return error;
        }); 
    }
}

module.exports = validateBrokerCreds