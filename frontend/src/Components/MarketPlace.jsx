import React, { useState, useEffect } from "react";

import MarketPlaceItem from "./MarketPlaceItem";

const MarketPlace = () => {
  const [orderbook,setOrderbook]=useState()
  const [accountName,setAccountName]=useState("")

  // console.log(orderbook)
  // console.log(accountName)
  
  useEffect(() => {
    
  fetch("http://localhost:5000/orderbook", {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("token")
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setOrderbook(data.orderbook)
      setAccountName(data.accountName)
      
    })
    .catch((error) => {
      console.error("Error updating form data:", error);
    });
  }, []);
  
  




  return (
    <div className="flex flex-col gap-4 bg-[#101013] text-white w-ful h-full pt-[7rem] px-[5rem]">
      {/* header - nifty time  */}

      <h2 className="font-bold text-2xl">Order Book : {accountName}</h2>

      {/* main area displays cards */}
      <div className="overflow-x-auto">
        <table className="table  text-white">
          {/* head */}
          <thead className="bg[#0A0A0C]">
            <tr className=" text-[#BABABA] text-lg">
              <th className="font-normal">Symbol</th>
              {/* <th className="font-normal">LTP</th> */}
              <th className="font-normal">Time Stamp</th>
              <th className="font-normal">Qty</th>
              <th className="font-normal">Order Type</th>
              <th className="font-normal">Transaction Type</th>

              <th className="font-normal">Status</th>
              {/* <th className="font-normal">Sell</th> */}
            </tr>
          </thead>
          <tbody className="">
            {/* use map here  */}
            {orderbook&&orderbook.map((item,index)=>{
              return <MarketPlaceItem key={index} symbol={item.tradingsymbol} timeStamp={item.order_timestamp} qty={item.tradingsymbol} orderType={item.tradingsymbol} transactionType={item.transaction_type} status={item.status}   />
            })}
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default MarketPlace;
