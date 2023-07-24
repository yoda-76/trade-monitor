import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const PaperTradingCard = (props) => {
  console.log(props.accountName)
  const [show, setShow] = useState(false);
  const showButton = () => {
    console.log("first");
    setShow(!show);
  };
  useEffect(() => {}, [show]);
  function generateToken(brokerName){
    fetch("http://localhost:5000/generateToken", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({  
        token: window.localStorage.getItem("token"),
        brokerName
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.status==true){
          console.log("token generated")
        }
        else{
          console.log("token generation failed")
        }
      })
  }
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className="card  bg-[#E18E91] rounded-md   w-[260px] text-black text-lg "
    >
      <div className="card-body  justify-between flex flex-row p-0">
        <div className="flex items-center w-full  my-[16px] gap-4 flex-col">
          <div className="flex font-bold gap-2 w-full justify-evenly">
            <span>{props.accountName}</span>
            <span>$40</span>
          </div>
          <button onClick={()=>{generateToken(props.broker)}} className=" rounded-none w-[150px] text-center text-[12px] font-bold bg-white  text-black">
            Generate
          </button>
        </div>
        <div
          className={`bg-white rounded-r-md font-black ${
            show ? "flex" : "hidden"
          } h-full  justify-center items-center px-2`}
        >
          <Link to="/marketplace">&#62;</Link>
        </div>
      </div>
      {/* <button className="btn">Generate</button> */}
    </div>
  );
};

export default PaperTradingCard;
