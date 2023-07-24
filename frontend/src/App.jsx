import { useState, useEffect } from "react";
import "./App.css";
import PaperTrading from "./Components/PaperTrading";
import MarketPlace from "./Components/MarketPlace";
import { Route, Routes } from "react-router-dom";
// const user=
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = window.localStorage.getItem("token");
    // const email = window.localStorage.getItem("email");
    // console.log(email,"email")
    // const username = window.localStorage.getItem("username");
    if (token) {
      // User is logged in, fetch user data
      fetch("http://localhost:5000/checkAuth", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          token: token
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            // User data fetched successfully
            // setUserData(data.data);
            setIsLoggedIn(true);
          } else {
            // Token expired or invalid, clear localStorage and redirect to login
            window.localStorage.clear();
            setIsLoggedIn(false)
            // window.location.href = "./sign-in";
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      // User is not logged in, redirect to login
      // window.location.href = "./login";
      setIsLoggedIn(false)

    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={isLoggedIn?<PaperTrading/>:<h1 
          className="w-full bg-[#3186D4] text-white pt-[82px] pb-[12px] px-[25px] font-bold"
        >Please Login!</h1>} />
        <Route path="/marketplace" element={<MarketPlace />} />
      </Routes>
    
   
    </>
  );
}

export default App;
